import { useEffect, useState } from "react";
import React from "react";
function AdminEditarP() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(console.error);
  }, []);

  const editarProducto = async (e) => {
    e.preventDefault();

    if (!producto || !precio || !stock) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/admin/producto/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto, precio, stock }),
      });

      if (res.ok) {
        const productoEditado = await res.json();
        alert('✅ Producto editado con éxito');

        setProductos(prev =>
          prev.map(p => (p.id === productoEditado.id ? productoEditado : p))
        );

        setProducto('');
        setPrecio('');
        setStock('');
        setEditandoId(null);
      } else {
        const error = await res.json();
        alert('❌ Error al editar el producto: ' + error?.error);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const cargarProductoParaEditar = (prod) => {
    setEditandoId(prod.id);
    setProducto(prod.producto);
    setPrecio(prod.precio);
    setStock(prod.stock);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Panel de Administración de Producto</h2>

      <form onSubmit={editarProducto} className="flex flex-col gap-3 bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">{editandoId ? 'Editar Producto' : 'Selecciona un producto'}</h3>

        <input
          type="text"
          placeholder="Producto"
          value={producto}
          onChange={e => setProducto(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar Cambios
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl mb-3 font-semibold">Lista de Productos</h3>
      <ul className="space-y-2">
        {productos.map(p => (
          <li key={p.id} className="flex justify-between items-center bg-white p-3 shadow rounded">
            <span>{p.producto} - ${p.precio}</span>
            <button
              onClick={() => cargarProductoParaEditar(p)}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminEditarP;
