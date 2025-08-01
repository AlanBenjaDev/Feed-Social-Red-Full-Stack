import React, { useState, useEffect } from 'react';

function Publicaciones({ usuario_id, id, contenido, img_url, total_likes, comentarios: comentariosIniciales = [] }) {
  const [likes, setLikes] = useState(total_likes || 0);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [comentarios, setComentarios] = useState(comentariosIniciales);
  const [usuarioLogueadoId, setUsuarioLogueadoId] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario?.id) {
      setUsuarioLogueadoId(usuario.id);
    }
  }, []);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);


  const comentar = async () => {
    if (!usuarioLogueadoId) {
      setMensaje('Debes iniciar sesión para comentar.');
      return;
    }

    if (!comentario.trim()) {
      setMensaje('El comentario no puede estar vacío.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/comentario/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comentario: comentario,
          usuario_id: usuarioLogueadoId,
          publicacion_id: id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Comentario enviado correctamente.');
        setComentario('');
        obtenerComentarios();
      } else {
        setMensaje(data.error || `Error al comentar: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setMensaje('Error del servidor: ' + error.message);
    }
  };

  const darLike = async () => {
   console.log("datos a enviar",{usuarioLogueadoId, id})
    try {
      const res = await fetch('http://localhost:3000/api/comentario/dar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioLogueadoId,
          publicacion_id: id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes); 
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 mb-4 rounded">
      <p>{contenido}</p>
      {img_url && <img src={img_url} alt="Imagen" className="mt-2 rounded w-80" />}
      <div className="flex items-center mt-2">
   
      </div>

      <div className="mt-2">
        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe un comentario..."
          className="border border-gray-300 p-1 rounded w-76"
        />
        <button onClick={comentar} className="bg-blue-500 text-white px-2 py-1 rounded mt-1">Comentar</button>
           <button onClick={darLike} className="mr-2">Dar Like</button>
        <span>{likes} Me gusta</span>
      </div>


      {mensaje && <div className="mt-2 text-green-500">{mensaje}</div>}

      <div className="mt-2">
        {comentarios.map((comentario, index) => (
          <div key={index} className="border-t border-gray-200 mt-2 pt-2">
            <strong>{comentario.usuario_nombre || 'Anónimo'}:</strong> {comentario.comentario}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Publicaciones;