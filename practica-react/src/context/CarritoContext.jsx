import { createContext, useState, useEffect } from "react";

// 1. Creamos el Contexto (La Nube vacía)
export const CarritoContext = createContext();

// 2. Creamos el Proveedor (El motor que maneja los datos)
export function CarritoProvider({ children }) {
  // Movemos el estado del carrito de App.jsx hacia aquí
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem("carritoCompras");
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carritoCompras", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    alert(`Agregaste ${producto.title} al carrito`);
  };

  // 1. NUEVA FUNCIÓN: Eliminar del carrito
  const eliminarDelCarrito = (id) => {
    // Usamos .filter para crear una lista nueva que NO incluya el producto con este ID
    const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
    setCarrito(nuevoCarrito);
  };

  const totalPagar = carrito.reduce((total, item) => total + item.price, 0);

  // 3. Compartimos los datos con toda la aplicación
  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, totalPagar }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
