// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Header   from './components/Header.jsx'
import Footer   from './components/Footer.jsx'
import Cadastro from './components/Cadastro.jsx'
import Triagem  from './components/Triagem.jsx'
import Medico   from './components/Medico.jsx'
import Painel   from './components/Painel.jsx'

// ⚠️ Corrigido o caminho para onde seu CSS realmente está
import './styles/App.css'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/"        element={<Cadastro />} />
          <Route path="/triagem" element={<Triagem  />} />
          <Route path="/medico"  element={<Medico   />} />
          <Route path="/painel"  element={<Painel   />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
