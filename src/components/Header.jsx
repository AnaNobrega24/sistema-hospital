// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HiUserCircle } from 'react-icons/hi2';
import { useAtendimento } from '../context/AtendimentoContext'; // 1. IMPORTE O HOOK DO CONTEXTO

export default function Header() {
  const { user } = useAtendimento(); // 2. PEGUE O USUÁRIO DO ESTADO GLOBAL
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const linkCls = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold transition duration-200 ${
      isActive
        ? 'text-[#27ae60] border-b-2 border-[#27ae60]'
        : 'text-white/80 hover:text-[#27ae60]'
    }`;

  return (
    <header className="bg-[#2c3e50] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* ... (código do logotipo não muda) ... */}
        <div className="flex items-center space-x-3">
            <img
            src="/img/logo.png"
            alt="Logo AlphaMed"
            className="h-10 w-auto rounded"
            />
            <span className="text-xl font-bold text-white tracking-tight">
            Hospital AlphaMed
            </span>
        </div>

        {/* Navegação */}
        <nav className="flex space-x-6">
          <NavLink to="/" className={linkCls} end>Cadastro</NavLink>
          <NavLink to="/triagem" className={linkCls}>Triagem</NavLink>
          <NavLink to="/medico" className={linkCls}>Médico</NavLink>
          <NavLink to="/painel" className={linkCls}>Painel</NavLink>
          
          {/* 3. APLIQUE A CONDIÇÃO AQUI */}
          {user && user.role === 'MEDICO' && (
            <NavLink to="/historico" className={linkCls}>Histórico</NavLink>
          )}
        </nav>

        {/* Hora + Admin */}
        <div className="flex items-center space-x-4 text-white/90">
          <span className="font-mono text-sm">{time.toLocaleTimeString('pt-BR')}</span>
          <div className="flex items-center space-x-2">
            <HiUserCircle className="text-[#27ae60] text-2xl" />
            {/* Mostra o nome do usuário logado ou 'Admin' como padrão */}
            <span className="text-sm font-medium">{user ? user.nome : 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}