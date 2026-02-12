// src/components/Tarjeta.jsx
//import "./Tarjeta.css"; // (Opcional si quieres estilos específicos)
import { Link } from "react-router-dom";
// 1. Recibimos 'props' (es un paquete con datos que envía el Padre)
function Tarjeta(props) {
  return (
    <div className=" border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform bg-white">
      {/* Imagen del producto (La API nos da props.imagen) */}
      <Link to={`/producto/${props.id}`}>
        <img
          src={props.imagen}
          alt={props.titulo}
          className="h-32 object-contain mb-4 cursor-pointer"
        />
      </Link>

      <h2 className="text-lg font-bold text-center mb-2 line-clamp-2">
        {props.titulo}
      </h2>

      <p className="text-green-600 font-bold text-xl mb-4">{props.precio}</p>

      <button
        onClick={props.handleComprar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full transition-colors font-bold"
      >
        Agregar al Carrito 🛒
      </button>
    </div>
  );
}

export default Tarjeta;
