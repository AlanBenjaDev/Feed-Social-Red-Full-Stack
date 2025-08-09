import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {Link} from 'react-router-dom';

function Create() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registrarUsuario = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://feed-social-red-full-stack.onrender.com/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',

        body: JSON.stringify({ user, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registro exitoso ✅');
        navigate('/home'); 
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <form onSubmit={registrarUsuario} className="p-4   flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold">Registro</h2>

      <input type="text" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} required className="border p-2 rounded" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 rounded" />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 rounded" />

      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Registrarse
      </button>
       <div>
        <p className='mt-4 text-center text-sm text-gray-600'>¿ya tenes una cuenta?</p>
        <Link to="/login" className='text-blue-600 hover:underline font-medium'>Iniciar Sesion</Link>
       </div>
    </form>
  );
}

export default Create;