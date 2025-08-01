import React, { useState, useEffect } from 'react';
import PerfilCard from './PerfilCard'; 


function MenuPerfil({ usuario_id }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarioEditado, setComentarioEditado] = useState('');

  useEffect(() => {
    // Cargar las publicaciones del usuario actual
    const fetchPublicaciones = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/publicaciones/${usuario_id}`);
        const data = await res.json();
        setPublicaciones(data);
      } catch (err) {
        console.error('Error al obtener publicaciones:', err);
      }
    };

    fetchPublicaciones();
  }, [usuario_id]);

  const borrarPublicacion = async (publicacion_id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/publicaciones`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, publicacion_id })
      });

      if (!response.ok) throw new Error('Error al borrar');

      const data = await response.json();
      console.log('Publicación borrada:', data);
      // Actualizar lista local
      setPublicaciones(publicaciones.filter(p => p.id !== publicacion_id));
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo borrar la publicación.');
    }
  };

  const editarPublicacion = async (publicacion_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/publicaciones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id,
          publicacion_id,
          texto: comentarioEditado
        }),
      });

      if (!res.ok) throw new Error('Error al editar publicación');

      const data = await res.json();
      console.log('Publicación editada:', data);
      setComentarioEditado('');
    } catch (err) {
      console.error('Error al editar:', err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <PerfilCard
        img_url="/ruta-default.jpg"
        usuario_id={usuario_id}
        seguidores={125}
        seguir="Seguir"
      />

      <h2 className="text-xl font-semibold mt-4">Mis publicaciones</h2>
      {publicaciones.map((publi) => (
        <div key={publi.id} className="border p-2 rounded shadow-sm">
          <p>{publi.texto}</p>
          <input
            type="text"
            placeholder="Editar..."
            className="border p-1 my-2 w-full"
            value={comentarioEditado}
            onChange={(e) => setComentarioEditado(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => editarPublicacion(publi.id)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => borrarPublicacion(publi.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Borrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuPerfil;

