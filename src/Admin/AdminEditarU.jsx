import { useEffect, useState } from 'react';
import React from 'react';
function AdminEditarU() {
  const [usuarios, setUsuarios] = useState([]);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editandoId, setEditandoId] = useState(null); // para saber qué usuario estamos editando

  useEffect(() => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(console.error);
  }, []);

  const editarUsuario = async (e) => {
    e.preventDefault();

    if (!role || !email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/admin/usuarios/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password }),
      });

      if (res.ok) {
        const usuarioEditado = await res.json();
        alert('✅ Usuario editado con éxito');

        setUsuarios(prev =>
          prev.map(u => (u.id === usuarioEditado.id ? usuarioEditado : u))
        );

        // limpiar formulario
        setRole('');
        setEmail('');
        setPassword('');
        setEditandoId(null);
      } else {
        const error = await res.json();
        alert('❌ Error al editar el usuario: ' + error?.error);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const cargarUsuarioParaEditar = (usuario) => {
    setEditandoId(usuario.id);
    setRole(usuario.role);
    setEmail(usuario.email);
    setPassword(usuario.password); // cuidado con esto en producción
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Panel de Administración de Usuarios</h2>

      <form onSubmit={editarUsuario} className="flex flex-col gap-3 bg-gray-100 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">{editandoId ? 'Editar Usuario' : 'Selecciona un usuario'}</h3>

        <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 rounded">
          <option value="">Selecciona un rol</option>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
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
          Guardar Cambios
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl mb-3 font-semibold">Lista de Usuarios</h3>
      <ul className="space-y-2">
        {usuarios.map(u => (
          <li key={u.id} className="flex justify-between items-center bg-white p-3 shadow rounded">
            <span>{u.email} - {u.role}</span>
            <button
              onClick={() => cargarUsuarioParaEditar(u)}
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

export default AdminEditarU;