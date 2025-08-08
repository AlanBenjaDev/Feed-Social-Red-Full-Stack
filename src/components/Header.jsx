import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function Header() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div className='min-h-screen bg-gradient-to-r from-slate-500 to-slate-800 flex flex-col items-center justify-center text-center p-6'
  whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
>
      <h1 className='text-4xl font-bold text-white  mb-6'>Bienvenido a DevGram</h1>

      <button
        onClick={() => setVisible(!visible)}
        className='bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition mb-4'
      >
        {visible ? "Ocultar menú" : "Mostrar menú"}
      </button>

      {visible && (
        <div className='mt-4 flex flex-row gap-4'>
          <button
            onClick={() => navigate('/home')}
            className='bg-white text-blue-700 font-semibold px-5 py-3 rounded hover:bg-blue-100 shadow'
          >
            Ir al Inicio
          </button>

          <button
            onClick={() => navigate('/publicaciones')}
            className='bg-green-600 text-white font-semibold px-5 py-3 rounded hover:bg-green-700 shadow'
          >
            Ir Al Feed
          </button>

          <button
            onClick={() => navigate('/Subir')}
            className='bg-yellow-500 text-white font-semibold px-5 py-3 rounded hover:bg-yellow-600 shadow'
          >
          Subir publicacion
          </button>

        
        </div>
      )}
    </motion.div>
  );
}

export default Header;