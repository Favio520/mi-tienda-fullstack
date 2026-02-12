import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CarritoContext } from "../context/CarritoContext"; // Asegúrate de la ruta correcta

export default function Detalle() {
  // 1. Usamos el hook para leer la URL
  const { id } = useParams();

  // 1. Estado para guardar el producto (empieza vacío/null)
  const [producto, setProducto] = useState(null);

  // 2. Sacamos la función de la nube
  const { agregarAlCarrito } = useContext(CarritoContext);

  // 2. Efecto: Cada vez que cambie el ID, buscamos el nuevo producto
  useEffect(() => {
    // a) Llamamos a la API con el ID específico
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProducto(data);
      });
  }, [id]); // <--- OJO: Ponemos [id] para que si cambias de producto, se actualice.

  if (!producto) return <div className="text-center mt-20">Cargando...</div>;

  return (
    <div className="container mx-auto p-10 max-w-4xl">
      <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Volver a la tienda
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow-lg">
        {/* Columna Izquierda: Imagen Gigante */}
        <div className="flex justify-center items-center">
          <img
            src={producto.image}
            alt={producto.title}
            className="max-h-96 object-contain"
          />
        </div>

        {/* Columna Derecha: Información */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{producto.title}</h1>

          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
            {producto.category}
          </span>

          <p className="text-gray-600 mt-4 mb-6 leading-relaxed">
            {producto.description}
          </p>

          <div className="text-4xl font-bold text-green-600 mb-6">
            ${producto.price}
          </div>

          <button
            onClick={() => agregarAlCarrito(producto)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-transform transform hover:scale-105"
          >
            ¡Comprar Ahora!
          </button>
        </div>
      </div>
    </div>
  );
}
