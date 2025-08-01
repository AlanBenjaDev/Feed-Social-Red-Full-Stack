import React, { useEffect, useState } from 'react';

function AdminMostrarUs() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/users') // ✅ ruta corregida
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('❌ Error al cargar usuarios:', err));
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {usuarios.map(user => (
        <div
          key={user.id}
          className="bg-white shadow-md rounded-lg p-4 m-2 w-60 text-center"
        >
          <h2 className="font-bold text-lg">Rol: {user.role}</h2>
          <p>Email: {user.email}</p>
          <p>Contraseña (hash): {user.password}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminMostrarUs;