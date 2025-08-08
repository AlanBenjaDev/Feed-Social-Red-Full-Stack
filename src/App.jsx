import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Create from './Create';
import Publicaciones from './Publicaciones';
import SubirPublicacion from './SubirPublicacion';
import Header from './components/Header';
import Footer from './components/Footer';
import Log from './Log';
import VerPublicaciones from './VerPublicaciones';


function App() {
  return (
    <Router>
      <Header 
        title="DevGram" 
        subtitle="La forma mas facil de contratar Programadores" 
        buttonD="Ir al inicio"
        buttonH="Ver Perfiles" 
        buttonC="Subir publicacion" 
      />
      <Routes>
         <Route path="/" element={<Create />} />
      
        <Route path="/home" element={<Home />} />
   <Route path="/Publicaciones" element={<VerPublicaciones />} />
        <Route path="/Subir" element={<SubirPublicacion />} />
        <Route path='/login' element={<Log />} />
      </Routes>
    </Router>
  );
}

export default App;