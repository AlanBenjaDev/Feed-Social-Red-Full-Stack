import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PerfilCard from './PerfilCard'; // Asegurate que este nombre coincida con tu archivo

function Home() {

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-tr from-slate-100 to-white">
      
      {/* Sección Hero o bienvenida */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20">
        <h2 className="text-4xl text-blue-900 font-bold max-w-3xl">
          Encontrá los mejores Programadores En un solo lugar
        </h2>
        <p className="text-xl text-gray-600 font-light mt-4 max-w-2xl">
          Compra fácil, rápido y seguro. Elegí tu rol y viví una experiencia única como comprador o vendedor.
        </p>
      </div>

      <main className="flex-grow p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mejores Perfiles</h2>
        <p className="text-gray-600 mb-6">Explorá Los perfiles, para encontrar a tu DevIdeal</p>

      </main>

    
    </div>
  );
}

export default Home;