// 1. OJO AL IMPORT: Usamos "../" para salir de la carpeta 'pages' y buscar 'components'
import Tarjeta from "../components/Tarjeta";
import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext"; // Asegúrate de la ruta correcta

// 2. Recibimos los datos y la función como props
export default function Inicio({ productos }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  return (
    <div className="container mx-auto py-8">
      {/* Grilla de Productos */}
      <div className="col-span-5 md:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {/* Aquí va el map que ya tenías */}
        {productos.map((producto) => (
          <Tarjeta
            key={producto.id}
            id={producto.id}
            titulo={producto.title}
            imagen={producto.image}
            precio={producto.price + "$"}
            // Pasamos la función corregida aquí
            handleComprar={() => agregarAlCarrito(producto)}
          />
        ))}
      </div>
    </div>
  );
}
