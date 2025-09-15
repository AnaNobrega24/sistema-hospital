import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Cadastro from './pages/Cadastro'
import Triagem from './pages/Triagem'
import Medico from './pages/Medico'
import Painel from './pages/Painel'
import FichaPaciente from './components/FichaPaciente'
import Prontuario from './pages/Prontuario'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Historico from './pages/Historico'
import Relatorios from './pages/Relatorios'
import './styles/App.css'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer autoClose={3000} hideProgressBar />
      <Header />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/" element={<Cadastro />} />
          <Route path="/triagem" element={<Triagem />} />
          <Route path="/medico" element={<Medico />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/ficha-paciente/:id" element={<FichaPaciente />} />
          <Route path='/prontuario/:id' element={<Prontuario />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
