import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import BuscarPaciente from "./pages/BuscarPaciente";
import Cadastro from "./pages/Cadastro";
import Triagem from "./pages/Triagem";
import Medico from "./pages/Medico";
import Painel from "./pages/Painel";
import Prontuario from "./pages/Prontuario";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";

import { AuthProvider } from "./contexts/AuthContext";
import "./styles/App.css";

export default function App() {
  const location = useLocation();

  // Define as rotas onde o header não deve aparecer
  const routesWithoutHeader = ["/", "/registro"];

  // Verifica se a rota atual está na lista de rotas sem header
  const shouldShowHeader = !routesWithoutHeader.includes(location.pathname);
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <ToastContainer autoClose={3000} hideProgressBar />
        {shouldShowHeader && <Header />}
        <main className="flex-grow bg-gray-50">
          <Routes>
            {/* Rotas públicas (sem contexto de atendimento) */}
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/busca-paciente" element={<BuscarPaciente />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/triagem" element={<Triagem />} />
            <Route path="/medico" element={<Medico />} />
            <Route path="/painel" element={<Painel />} />
            <Route path="/prontuario/:id" element={<Prontuario />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
