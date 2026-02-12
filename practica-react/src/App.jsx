// src/App.jsx
import { useState, useEffect, useContext } from "react";
import { CarritoContext } from "./context/CarritoContext";
import "./index.css";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Inicio from "./pages/inicio";
import Carrito from "./pages/Carrito";
import Detalle from "./pages/Detalle";
import Noticias from "./components/Noticias";

function App() {
  const [recargarTrigger, setRecargarTrigger] = useState(0); // <--- AGREGA ESTO
  const { carrito } = useContext(CarritoContext);
  const [productos, setProductos] = useState([]);

  const sincronizarDatos = async () => {
    try {
      const respuesta = await fetch(
        "https://mi-api-tienda.onrender.com/sync-facebook",
        {
          method: "POST", // OJO: Es un POST porque estamos creando datos
        },
      );
      const data = await respuesta.json();

      // ¡Aquí está tu alerta!
      alert(data.mensaje);

      // (Opcional) Aquí podrías recargar la página para ver los nuevos datos
      // window.location.reload();
      setRecargarTrigger(recargarTrigger + 1);
    } catch (error) {
      alert("Error conectando con el servidor 😢");
      console.error(error);
    }
  };

  // 3. AQUÍ OCURRE LA MAGIA
  useEffect(() => {
    fetch("https://mi-api-tienda.onrender.com/products")
      .then((response) => response.json()) // b) Convertimos la respuesta a JSON
      .then((data) => {
        // c) Guardamos los datos en el estado
        setProductos(data);
        console.log("¡Datos recibidos!", data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 text-white sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mi Tienda React</h1>
        <Link to="/carrito" className="text-blue-600 hover:underline text-lg">
          <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold">
            {/* El carrito funciona mágicamente desde la nube */}
            🛒 Carrito: {carrito.length}
          </div>
        </Link>
      </nav>

      <div>
        {/* ZONA DE TRÁFICO */}
        <Routes>
          {/* RUTA 1: Cuando la URL sea "/", muestra Inicio y PASALE los datos */}
          <Route path="/" element={<Inicio productos={productos} />} />
          <Route path="/producto/:id" element={<Detalle />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </div>

      <button
        onClick={sincronizarDatos}
        className="bg-blue-800 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-blue-700"
      >
        🔄 Sincronizar Noticias de "Facebook"
      </button>

      <Noticias recargar={recargarTrigger} />
    </div>
  );
}

export default App;
