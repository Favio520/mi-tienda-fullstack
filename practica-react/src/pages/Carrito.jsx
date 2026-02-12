import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { Link } from "react-router-dom";

export default function Carrito() {
  // 1. Nos conectamos a la nube para sacar TODO lo que necesitamos
  const { carrito, eliminarDelCarrito, totalPagar } =
    useContext(CarritoContext);

  // 2. Si el carrito está vacío, mostramos un mensaje amigable
  if (carrito.length === 0) {
    return (
      <div className="text-center p-20">
        <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío 😢</h2>
        <Link to="/" className="text-blue-600 hover:underline text-lg">
          ¡Vamos a comprar algo!
        </Link>
      </div>
    );
  }

  // 3. Si hay productos, mostramos la lista
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Resumen de tu Compra</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Recorremos el carrito para mostrar cada ítem */}
        {carrito.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center justify-between border-b pb-4 mb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={producto.image}
                alt={producto.title}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="font-bold">{producto.title}</h3>
                <p className="text-gray-600">${producto.price}</p>
              </div>
            </div>

            {/* El Botón Rojo para eliminar */}
            <button
              onClick={() => eliminarDelCarrito(producto.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
            >
              Quitar 🗑️
            </button>
          </div>
        ))}

        {/* Sección del Total a Pagar */}
        <div className="text-right mt-8">
          <h2 className="text-2xl font-bold">
            Total a pagar:{" "}
            <span className="text-green-600">${totalPagar.toFixed(2)}</span>
          </h2>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg mt-4">
            Pagar Ahora 💳
          </button>
        </div>
      </div>
    </div>
  );
}
