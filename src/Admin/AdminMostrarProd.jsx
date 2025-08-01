import { useEffect, useState } from 'react';
import React from 'react';
function AdminMostrarProd() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('❌ Error al cargar productos:', err));
  }, []);



  const productosFiltrados = productos.filter(p =>
    p.producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        className="border border-gray-400 rounded p-2 mb-4 w-full max-w-md"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="flex flex-wrap justify-center">
        {productosFiltrados.map(prod => (
          <Carrito
            key={prod.id}
            nombre={prod.producto}
            descripcion={prod.descripcion}
            precio={prod.precio}
            img_url={prod.img_url}
          
          />
        ))}
      </div>
    </div>
  );
}

export default AdminMostrarProd;