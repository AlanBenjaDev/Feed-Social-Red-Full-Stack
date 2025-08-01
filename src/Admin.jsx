
import React, { useState, useEffect } from 'react';

import AdminEditarP from './Admin/AdminEditarP';
import AdminEditarU from './Admin/AdminEditarU';
import AdminBorrarU from './Admin/AdminBorrarU';
import AdminBorrarP from './Admin/AdminBorrarP';
import AdminMostrarProd from './Admin/AdminMostrarProd';
import AdminMostrarUs from './Admin/AdminMostrarUs';
import AdminCrearU from './Admin/AdminCrearU';
import AdminCrearP from './Admin/AdminCrearP';

function Admin() {
  // Estados para datos
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estados para formularios de usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // Estados para formularios de producto
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);

  // Estados separados para edición (mejor control)
  const [editandoUsuarioId, setEditandoUsuarioId] = useState(null);
  const [editandoProductoId, setEditandoProductoId] = useState(null);

  // Cargar usuarios y productos al montar componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await fetch('http://localhost:3000/api/admin/dashboard');
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        // Ajusta según estructura que retorne tu backend
        setUsuarios(data.usuarios || []);
        setProductos(data.productos || []);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      }
    }
    cargarDatos();
  }, []);

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">🛠 Panel de Administración</h1>

      {/* Mostrar productos */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📦 Publicaciones</h2>
        <AdminMostrarProd productos={productos} />
      </section>

      {/* Mostrar usuarios */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">👥 Usuarios</h2>
        <AdminMostrarUs usuarios={usuarios} />
      </section>

      {/* Editar productos */}
      <section>
        <AdminEditarP
          productos={productos}
          setProductos={setProductos}
          producto={producto}
          setProducto={setProducto}
          precio={precio}
          setPrecio={setPrecio}
          stock={stock}
          setStock={setStock}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          imagen={imagen}
          setImagen={setImagen}
          editandoId={editandoProductoId}
          setEditandoId={setEditandoProductoId}
        />
      </section>

      {/* Editar usuarios */}
      <section>
        <AdminEditarU
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          editandoId={editandoUsuarioId}
          setEditandoId={setEditandoUsuarioId}
        />
      </section>

      {/* Borrar productos */}
      <section>
        <AdminBorrarP productos={productos} setProductos={setProductos} />
      </section>

      {/* Borrar usuarios */}
      <section>
        <AdminBorrarU usuarios={usuarios} setUsuarios={setUsuarios} />
      </section>

      {/* Crear usuario */}
      <section>
        <AdminCrearU
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
        />
      </section>

      {/* Crear producto */}
      <section>
        <AdminCrearP
          productos={productos}
          setProductos={setProductos}
          producto={producto}
          setProducto={setProducto}
          precio={precio}
          setPrecio={setPrecio}
          stock={stock}
          setStock={setStock}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          imagen={imagen}
          setImagen={setImagen}
        />
      </section>
    </div>
  );
}

export default Admin;