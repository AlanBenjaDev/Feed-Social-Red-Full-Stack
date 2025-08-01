import { useEffect, useState } from "react";
import React from "react";
function AdminBorrarP() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(console.error);
  }, []);

  const borrarProducto = async (id) => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar el producto?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("✅ Producto eliminado con éxito");
        setProductos(prev => prev.filter(p => p.id !== id));
      } else {
        const error = await res.json();
        alert("❌ Error al borrar: " + error?.error);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      <ul>
        {productos.map(producto => (
          <li key={producto.id} className="mb-2 flex justify-between items-center">
            <span>{producto.nombre} - ${producto.precio} - Stock: {producto.stock}</span>
            <button
              onClick={() => borrarProducto(producto.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminBorrarP;