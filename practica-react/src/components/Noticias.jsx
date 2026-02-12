import { useEffect, useState } from "react";

export default function Noticias({ recargar }) {
  const [noticias, setNoticias] = useState([]);

  // Esta función pide los datos a TU Python
  const obtenerNoticias = async () => {
    try {
      // Llamamos al endpoint GET que creamos en el paso anterior
      const response = await fetch(
        "https://mi-api-tienda.onrender.com/social-posts",
      );
      const data = await response.json();
      setNoticias(data);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    }
  };

  // 1. Cargar noticias al iniciar
  useEffect(() => {
    obtenerNoticias();
  }, [recargar]); // Truco: Si 'recargar' cambia, volvemos a pedir los datos

  return (
    <div className="bg-gray-100 p-6 rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📢 Novedades de la Red
      </h2>

      {noticias.length === 0 ? (
        <p className="text-gray-500">No hay noticias guardadas aún.</p>
      ) : (
        <div className="space-y-4">
          {noticias.map((nota) => (
            <div
              key={nota.id}
              className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
            >
              <h3 className="font-bold text-lg">{nota.title}</h3>
              <p className="text-gray-600 mt-1">{nota.body}</p>
              <span className="text-xs text-blue-400 font-semibold mt-2 block">
                Fuente: {nota.source} (ID Externo: {nota.external_id})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
