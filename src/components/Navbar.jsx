import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-hospital-blue text-white py-3 flex justify-center gap-6">
      <NavLink to="/" className="hover:underline">Cadastro</NavLink>
      <NavLink to="/triagem" className="hover:underline">Triagem</NavLink>
      <NavLink to="/medico" className="hover:underline">Médico</NavLink>
      <NavLink to="/painel" className="hover:underline">Painel</NavLink>
    </nav>
  )
}
