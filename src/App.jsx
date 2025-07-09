import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Triagem from './pages/Triagem.jsx';
import Medico from './pages/Medico.jsx';
import Painel from './pages/Painel.jsx';
import Footer from './components/Footer';
import './App.css'; 


export default function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Cadastro />} />
            <Route path="/triagem" element={<Triagem />} />
            <Route path="/medico" element={<Medico />} />
            <Route path="/painel" element={<Painel />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
