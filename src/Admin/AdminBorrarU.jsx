import React, { useEffect, useState } from 'react';

function AdminBorrarU() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/users') // Corregido endpoint
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('❌ Error al cargar usuarios:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {usuarios.map(user => (
          <div
            key={user.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>ID:</strong> {user.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminBorrarU;