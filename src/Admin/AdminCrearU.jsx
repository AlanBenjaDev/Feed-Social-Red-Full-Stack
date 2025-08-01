import { useEffect, useState } from 'react';
import React from "react";

function AdminCrearU() {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(console.error);
  }, []);

  const subirUsuario = async (e) => {
    e.preventDefault();

    if (!role || !email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    const nuevoUsuario = { role, email, password };

    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
        const data = await res.json();
        alert('✅ Usuario creado con éxito');
        setUsuarios(prev => [...prev, data]);

        setRole('');
        setEmail('');
        setPassword('');
      } else {
        const error = await res.json();
        alert('❌ Error al subir usuario: ' + error?.error);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Panel de Vendedor</h2>

      <form onSubmit={subirUsuario} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Rol del usuario"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email del usuario"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Subir Nuevo Usuario
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl mb-3 font-semibold">Usuarios registrados</h3>

      {usuarios.length === 0 ? (
        <p className="text-gray-500">Aún no has creado usuarios.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {usuarios.map(u => (
            <div key={u.id} className="border p-3 rounded shadow">
              <h4 className="font-semibold">{u.role}</h4>
              <p>{u.email}</p>
              {/* No se muestra la contraseña */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCrearU;