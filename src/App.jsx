import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Triagem from './pages/Triagem.jsx'
import Medico from './pages/Medico.jsx'
import Painel from './pages/Painel.jsx'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/triagem" element={<Triagem />} />
          <Route path="/medico" element={<Medico />} />
          <Route path="/painel" element={<Painel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
