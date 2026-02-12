from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import SQLModel, Field, create_engine, Session, select
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import httpx
import os

# --- 1. CONFIGURACIÓN DE LA BASE DE DATOS ---
class SocialPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    external_id: int  # El ID original de Facebook/API externa
    title: str
    body: str
    source: str       # De dónde vino (ej: "Facebook", "Twitter")

# Creamos la clase que representa tu tabla "Product"
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    price: float
    description: str
    category: str
    image: str
    # Nota: rating lo dejamos simple por ahora para no complicar
db_connection_str = os.getenv("DATABASE_URL", "sqlite:///tienda.db")
# Conexión a la base de datos (se creará un archivo 'tienda.db')
sqlite_file_name = "tienda.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

if db_connection_str.startswith("postgres://"):
    db_connection_str = db_connection_str.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_connection_str)

# El motor que impulsa la base de datos
engine = create_engine(sqlite_url)

# Función para crear las tablas si no existen
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependencia para obtener la sesión (la conexión activa)
def get_session():
    with Session(engine) as session:
        yield session

# --- 2. CONFIGURACIÓN DE LA API ---

app = FastAPI()

# CORS (Igual que antes, para que React entre)
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. EVENTO DE INICIO (El Sembrador) ---
# Esto se ejecuta solo cuando prendes el servidor.
# Si la base de datos está vacía, le mete los productos de prueba.
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
    with Session(engine) as session:
        # Verificamos si ya hay productos
        productos_existen = session.exec(select(Product)).first()
        
        if not productos_existen:
            print("🚀 Base de datos vacía. Creando productos de prueba...")
            producto1 = Product(title="Mochila Python", price=50.0, description="Ideal para codear", category="ropa", image="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg")
            producto2 = Product(title="Camiseta FastAPI", price=22.5, description="100% Algodón", category="ropa", image="https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg")
            producto3 = Product(title="Monitor Dev", price=300.0, description="4K Ultra HD", category="tech", image="https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg")
            
            session.add(producto1)
            session.add(producto2)
            session.add(producto3)
            session.commit()

# --- 4. RUTAS (ENDPOINTS) ---

@app.get("/")
def read_root():
    return {"mensaje": "API con Base de Datos SQLModel 🚀"}

# Ruta para obtener TODOS los productos
@app.get("/products", response_model=List[Product])
def read_products(session: Session = Depends(get_session)):
    productos = session.exec(select(Product)).all()
    return productos

# Ruta para obtener UN producto por ID
@app.get("/products/{product_id}", response_model=Product)
def read_product(product_id: int, session: Session = Depends(get_session)):
    producto = session.get(Product, product_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# ¡NUEVO! Ruta para CREAR un producto (POST)
@app.post("/products", response_model=Product)
def create_product(product: Product, session: Session = Depends(get_session)):
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@app.post("/sync-facebook")
async def sync_facebook(session: Session = Depends(get_session)):
    # A) Python sale a internet a buscar datos (simulamos Facebook)
    async with httpx.AsyncClient() as client:
        response = await client.get("https://jsonplaceholder.typicode.com/posts?_limit=3")
        posts_externos = response.json()

    # B) Guardamos esos datos en NUESTRA base de datos
    nuevos_posts = []
    for post in posts_externos:
        # Verificamos si ya existe para no duplicar (opcional, pero buena práctica)
        ya_existe = session.exec(select(SocialPost).where(SocialPost.external_id == post["id"])).first()
        
        if not ya_existe:
            nuevo_post = SocialPost(
                external_id=post["id"],
                title=post["title"],
                body=post["body"],
                source="Facebook Fake API"
            )
            session.add(nuevo_post)
            nuevos_posts.append(nuevo_post)
    
    session.commit()
    return {"mensaje": f"Se importaron {len(nuevos_posts)} posts nuevos desde la API externa 🚀"}

# 3. ENDPOINT PARA REACT: Leer lo que tenemos guardado
@app.get("/social-posts", response_model=List[SocialPost])
def read_social_posts(session: Session = Depends(get_session)):
    posts = session.exec(select(SocialPost)).all()
    return posts