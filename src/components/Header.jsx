import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi2";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  
  // Rotas que NÃO devem mostrar o Header
  const routesWithoutHeader = ["/", "/registro"];
  

  // Se estiver numa rota que não deve mostrar header, não renderiza nada
  const verifyRoutes = () => {
    if (routesWithoutHeader.includes(location.pathname)) {
      return null;
    } else {
      const id = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(id);
    }
  };

  useEffect(() => {
    verifyRoutes()
  }, []);

  const linkCls = ({ isActive }) =>
    `relative overflow-hidden px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "text-white bg-white/10"
        : "text-white/80 hover:text-[#59995c] hover:bg-white/10"
    }`;

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair do sistema?")) {
      logout();
      // Redirecionar para login se necessário
      window.location.href = "/";
    }
  };

  return (
    
    <header className="relative shadow-lg sticky top-0 z-50 border-b border-white/10">
      {/* Gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#59995c] via-[#4a8049] to-[#5ea361] animate-[shimmer_3s_infinite] pointer-events-none rounded-b-lg"></div>

      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 relative z-10">
        {/* Logo + Nome */}
        <div className="flex items-center space-x-3 transform transition-transform duration-200 hover:scale-105">
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-[#59995c] to-[#7cb342] rounded-lg flex items-center justify-center shadow-lg">
              <i className="fas fa-hospital text-white text-lg"></i>
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Hospital AlphaMed
            </span>
            <div className="text-xs text-white/60">Sistema de Gestão</div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="hidden md:flex space-x-1">
          <NavLink to="/" className={linkCls} end>
            <i className="fas fa-chart-bar mr-2"></i>Home
          </NavLink>
          <NavLink to="/cadastro" className={linkCls} end>
            <i className="fas fa-user-plus mr-2"></i>Cadastro
          </NavLink>
          <NavLink to="/triagem" className={linkCls}>
            <i className="fas fa-stethoscope mr-2"></i>Triagem
          </NavLink>
          <NavLink to="/medico" className={linkCls}>
            <i className="fas fa-user-md mr-2"></i>Médico
          </NavLink>
          <NavLink to="/painel" className={linkCls}>
            <i className="fas fa-chart-bar mr-2"></i>Painel
          </NavLink>
          {user && user.role === "MEDICO" && (
            <NavLink to="/historico" className={linkCls}>
              <i className="fas fa-history mr-2"></i>Histórico
            </NavLink>
          )}
        </nav>

        {/* Hora + Admin */}
        <div className="flex items-center space-x-4">
          {/* Relógio */}
          <div className="hidden sm:flex items-center space-x-2 backdrop-blur-md bg-white/10 px-3 py-1 rounded-lg">
            <i className="fas fa-clock text-[#59995c]"></i>
            <span className="font-mono text-sm text-white/90">
              {time.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>

          {/* Admin Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-gradient-to-br from-[#59995c] to-[#7cb342] flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 hover:from-[#7cb342] hover:to-[#59995c] hover:translate-y-[-1px] hover:shadow-xl"
            >
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <HiUserCircle className="text-white text-lg" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs opacity-75">Bem-vindo</div>
                <div className="font-semibold">
                  {user ? user.nome : "Admin"}
                </div>
              </div>
              <i
                className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                {/* Gradiente animado de fundo */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#59995c] via-[#4a8049] to-[#5ea361] animate-[shimmer_3s_infinite] pointer-events-none rounded-xl"></div>

                {/* Conteúdo do dropdown com backdrop */}
                <div className="relative backdrop-blur-md bg-white/10 z-10">
                  {/* Info usuário */}
                  <div className="p-4 border-b border-white/10 flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                      <HiUserCircle className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {user ? user.nome : "Dr. Admin"}
                      </div>
                      <div className="text-xs text-white/60">Administrador</div>
                    </div>
                  </div>

                  {/* Opções */}
                  <div className="p-2 flex flex-col space-y-2">
                    <NavLink
                      to="/relatorios"
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-white/90 
             bg-white/20 hover:bg-white/30 
             transition shadow-md hover:shadow-lg"
                    >
                      <i className="fas fa-clipboard-list"></i>
                      <span>Relatórios</span>
                    </NavLink>
                    <NavLink
                      to="/historico"
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-white/90 
             bg-white/20 hover:bg-white/30 
             transition shadow-md hover:shadow-lg"
                    >
                      <i className="fas fa-clipboard-list"></i>
                      <span>Histórico</span>
                    </NavLink>
                    <NavLink
                      to="/registro"
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-white/90 
             bg-white/20 hover:bg-white/30 
             transition shadow-md hover:shadow-lg"
                    >
                      <i className="fas fa-clipboard-list"></i>
                      <span>Registro</span>
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-3 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <i className="fas fa-sign-out-alt text-lg"></i>
                      <span className="font-medium">Sair do Sistema</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menu Mobile */}
          <button className="md:hidden text-white hover:text-[#59995c] transition-colors">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
