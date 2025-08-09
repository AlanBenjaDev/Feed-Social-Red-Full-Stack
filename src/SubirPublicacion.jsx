import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function SubirPublicacion() {
  const [usuario_id, setUsuario_id] = useState('');
  const [contenido, setContenido] = useState('');
  const [img_url, setImg_url] = useState(null);

  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    fetch('https://feed-social-red-full-stack.onrender.com/api/publicaciones/verPublicaciones')
      .then(res => res.json())
      .then(data => setPublicaciones(data))
      .catch(console.error);
  }, []);

  const subirPubli = async (e) => {
    e.preventDefault();

    if ( !usuario_id ||!contenido || !img_url) {
      alert('Por favor completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('usuario_id', usuario_id);
    formData.append('contenido', contenido);
    formData.append('imagen', img_url);



    try {
      const res = await fetch('https://feed-social-red-full-stack.onrender.com/api/publicaciones/subirPublicacion', {
        method: 'POST',
        credentials: 'include',

        body: formData,
      });

      if (res.ok) {
        const nuevaPublicacion = await res.json();

        alert('✅ Publicacion subida con éxito');


        setPublicaciones(prev => [...prev, nuevaPublicacion]);

      
        setUsuario_id('');
        setContenido('');
        setImg_url(null);
        
      } else {
        const error = await res.json();
        alert('❌ Error al subir la publicacion ' + error?.error);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Panel Para subir tu Publicacion</h2>

      <form onSubmit={subirPubli} className="flex flex-col gap-3 max-w-md">
        <input
  type="text"
  placeholder="Nombre Usuario"
  value={usuario_id}
  onChange={e => setUsuario_id(e.target.value)}
  className="border p-2 rounded"
/>

        <textarea
          placeholder="contenido"
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImg_url(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Subir Publicacion
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl mb-3 font-semibold">Mis Publicaciones</h3>

      {publicaciones.length === 0 ? (
  <p className="text-gray-500">Aún no has subido publicaciones.</p>
)  : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {publicaciones.map(p => (
            <div key={p.id} className="border p-3 rounded shadow">
              <img
                src={`http://localhost:3000${p.img_url}`}
                alt={p.usuario_id}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h4 className="font-semibold">{p.usuario_id}</h4>
              <p>{p.contenido}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubirPublicacion;