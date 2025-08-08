import React, { useState, useEffect } from 'react';
import Publicaciones from './Publicaciones';
function VerPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [mensajes, setMensajes] = useState({});

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setCargando(true);
        const res = await fetch('https://feed-social-red-full-stack.onrender.com/api/publicaciones/verPublicaciones');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setPublicaciones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPublicaciones();
  }, []);

  useEffect(() => {
    const timeouts = Object.entries(mensajes).map(([publicacion_id, mensaje]) => {
      if (mensaje) {
        return setTimeout(() => {
          setMensajes(prev => ({ ...prev, [publicacion_id]: '' }));
        }, 3000);
      }
    });

    return () => timeouts.forEach(clearTimeout);
  }, [mensajes]);

  const enviarComentario = async (publicacion_id) => {
    const texto = nuevoComentario[publicacion_id]?.trim();
    if (!texto) {
      setMensajes(prev => ({
        ...prev,
        [publicacion_id]: 'El comentario no puede estar vacío'
      }));
      return;
    }

    const usuario_id = JSON.parse(localStorage.getItem('usuario'))?.id;
    if (!usuario_id) {
      setMensajes(prev => ({
        ...prev,
        [publicacion_id]: 'Debes iniciar sesión para comentar.'
      }));
      return;
    }

    try {
      const res = await fetch('https://feed-social-red-full-stack.onrender.com/api/comentario/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comentario: texto,
          usuario_id,
          publicacion_id
        })
      });

      const data = await res.json();

      if (res.ok) {
        setNuevoComentario(prev => ({ ...prev, [publicacion_id]: '' }));
        setMensajes(prev => ({
          ...prev,
          [publicacion_id]: 'Comentario enviado correctamente.'
        }));

        setPublicaciones(prev =>
          prev.map(publi => {
            if (publi.publicacion_id === publicacion_id) {
              return {
                ...publi,
                comentarios: [
                  { usuario_id, texto, created_at: new Date().toISOString() },
                  ...(publi.comentarios || [])
                ]
              };
            }
            return publi;
          })
        );
      } else {
        setMensajes(prev => ({
          ...prev,
          [publicacion_id]: data.error || 'Error al enviar comentario'
        }));
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setMensajes(prev => ({
        ...prev,
        [publicacion_id]: 'Error del servidor: ' + error.message
      }));
    }
  };

 const darLike = async (publicacion_id) => {
  const usuario_id = JSON.parse(localStorage.getItem('usuario'))?.id;
  console.log("datos a enviar like", {usuario_id, publicacion_id})
  if (!usuario_id) {
    setMensajes(prev => ({
      ...prev,
      [publicacion_id]: 'Debes iniciar sesión para dar like.'
    }));
    return;
  }

  try {
    const res = await fetch('https://feed-social-red-full-stack.onrender.com/api/comentario/dar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id,
        publicacion_id
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setPublicaciones(prev =>
        prev.map(publi =>
          publi.publicacion_id === publicacion_id
            ? { ...publi, total_likes: (publi.total_likes || 0) + 1 }
            : publi
        )
      );
    } else if (res.status === 409) {
      setMensajes(prev => ({
        ...prev,
        [publicacion_id]: 'Ya diste like a esta publicación.'
      }));
    } else {
      setMensajes(prev => ({
        ...prev,
        [publicacion_id]: data.error || 'Error al dar like.'
      }));
    }
  } catch (error) {
    console.error('Error al dar like:', error);
    setMensajes(prev => ({
      ...prev,
      [publicacion_id]: 'Error del servidor: ' + error.message
    }));
  }
};
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Publicaciones</h1>

      {cargando && <p>Cargando publicaciones...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {publicaciones.map(publi => (
 <div key={publi.publicacion_id} className="border rounded-lg p-4 mb-4">
    <p className="text-3xl text-black  mb-1"><strong>{publi.autor_publicacion}</strong> - {new Date(publi.created_at).toLocaleString()}</p>

  <h2 className="font-semibold text-2xl">{publi.contenido}</h2>
  
  {publi.img_url && (
    <img
      src={publi.img_url}
      alt="Imagen"
      className="w-80 max-h-90 object-cover my-2 rounded"
    />
  )}

  <div className="flex items-center mb-2">
    <button
      onClick={() => darLike(publi.publicacion_id)}
      className="text-red-600 text-3xl mr-2 hover:scale-110 transition-transform duration-300"
    >
      ❤️
    </button>
    <span className="text-xl text-gray-800">{publi.total_likes || 0} Me gusta</span>
  </div>

  {mensajes[publi.publicacion_id] && (
    <p
      className={`text-sm mt-2 mb-2 ${
        mensajes[publi.publicacion_id].includes('correctamente')
          ? 'text-green-500'
          : 'text-red-500'
      }`}
    >
      {mensajes[publi.publicacion_id]}
    </p>
  )}

  <textarea
    placeholder="Escribe un comentario..."
    className="w-80 p-2 border rounded-lg resize-none mb-2"
    rows={3}
    value={nuevoComentario[publi.publicacion_id] || ''}
    onChange={e =>
      setNuevoComentario(prev => ({
        ...prev,
        [publi.publicacion_id]: e.target.value
      }))
    }
  />

  <button
    onClick={() => enviarComentario(publi.publicacion_id)}
    className="bg-sky-400 w-32 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition duration-300"
    disabled={!nuevoComentario[publi.publicacion_id]?.trim()}
  >
    Comentar
  </button>

  {(publi.comentarios?.length > 0) && (
    <ul className="mt-2 mb-2 max-h-48 overflow-y-auto border rounded p-2">
      {publi.comentarios.map((com, idx) => (
        <li key={idx} className="border-b py-1">
          <strong>{com.autor_comentario || `Usuario ${com.usuario_id}`}</strong>:{' '}
          {com.texto}
          <span className="text-xs text-gray-500 ml-2">
            {new Date(com.created_at).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>
        
      ))}
    </div>
  );
}

export default VerPublicaciones;