import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Cadastro from './pages/Cadastro'
import Triagem from './pages/Triagem'
import Medico from './pages/Medico'
import Painel from './pages/Painel'
import './styles/App.css'
import Navbar from  './components/Navbar.jsx'

export default function App() {
  return (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Navbar /> {/* ✅ Adicionada logo abaixo do cabeçalho */}
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