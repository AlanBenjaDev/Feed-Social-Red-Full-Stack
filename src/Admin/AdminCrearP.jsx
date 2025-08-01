import React from "react";
import { useEffect, useState } from 'react';

function AdminCrearP() {
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/productos')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const subirProducto = async (e) => {
    e.preventDefault();

    if (!producto || !descripcion || !precio || !stock || !imagen) {
      alert('Por favor completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('producto', producto);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);
    formData.append('imagen', imagen);

    try {
      const res = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const nuevoProducto = await res.json();

        alert('✅ Producto subido con éxito');

        // Agregamos el nuevo producto al listado
        setProducts(prev => [...prev, nuevoProducto]);

        // Limpiamos el formulario
        setProducto('');
        setDescripcion('');
        setPrecio('');
        setStock('');
        setImagen(null);
      } else {
        const error = await res.json();
        alert('❌ Error al subir producto: ' + error?.error);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Panel de Vendedor</h2>

      <form onSubmit={subirProducto} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={producto}
          onChange={e => setProducto(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          className="border p-2 rounded"
          min="0"
          step="0.01"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
          className="border p-2 rounded"
          min="0"
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImagen(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Subir Producto
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl mb-3 font-semibold">Mis Productos</h3>

      {products.length === 0 ? (
        <p className="text-gray-500">Aún no has subido productos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="border p-3 rounded shadow">
              <img
                src={`http://localhost:3000${p.img_url}`}
                alt={p.producto}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h4 className="font-semibold">{p.producto}</h4>
              <p>{p.descripcion}</p>
              <p className="font-bold">${p.precio}</p>
              <p>Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AdminCrearP;