// src/components/Header.jsx
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { HiBuildingOffice, HiUserCircle } from 'react-icons/hi2'

export default function Header() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition  ${
      isActive
        ? 'text-hospital-blue border-b-2 border-hospital-blue'
        : 'text-gray-600 hover:text-hospital-blue'
    }`

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo + Nome */}
        <div className="flex items-center space-x-3">
          <HiBuildingOffice className="text-hospital-blue text-2xl" />
          <span className="text-xl font-semibold text-gray-900">
            Sistema Hospitalar
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex space-x-4">
          <NavLink to="/"        className={linkClasses} end>
            Cadastro
          </NavLink>
          <NavLink to="/triagem" className={linkClasses}>
            Triagem
          </NavLink>
          <NavLink to="/medico"  className={linkClasses}>
            Médico
          </NavLink>
          <NavLink to="/painel"  className={linkClasses}>
            Painel
          </NavLink>
        </nav>

        {/* Hora e Usuário */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 font-mono">
            {time.toLocaleTimeString('pt-BR')}
          </span>
          <div className="flex items-center space-x-2">
            <HiUserCircle className="text-gray-600 text-2xl" />
            <span className="text-sm font-medium text-gray-900">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}
