import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../services/apiServices";
import { FaUser, FaCalendar, FaIdCard, FaPhone, FaMapMarkerAlt, FaHome, FaSearch, FaUserPlus } from "react-icons/fa";

export default function Cadastro() {
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState({
    nome: "",
    nascimento: "",
    documento: "",
    telefone: "",
    cep: "",
    endereco: "",
  });

  const [cepSuggestions, setCepSuggestions] = useState([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepValid, setCepValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Atualiza paciente
    setPaciente((prev) => ({ ...prev, [name]: value }));

    if (name === "cep") {
      const cleanCep = value.replace(/\D/g, "");
      setCepValid(false);

      if (cleanCep.length >= 5) {
        buscarEndereco(cleanCep);
      } else {
        setCepSuggestions([]);
      }
    }
  };

  const handleCepKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cleanCep = paciente.cep.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        buscarEndereco(cleanCep);
      }
    }
  };

  const buscarEndereco = async (cep) => {
    setLoadingCep(true);
    setCepSuggestions([]);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const suggestion = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setCepSuggestions([suggestion]);
        setCepValid(true);
      } else {
        setCepSuggestions([]);
        setCepValid(false);
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      setCepSuggestions([]);
      setCepValid(false);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSelectEndereco = (endereco) => {
    setPaciente((prev) => ({ ...prev, endereco }));
    setCepSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const novoPaciente = {
      id: Date.now(),
      nome: paciente.nome,
      dataNascimento: paciente.nascimento,
      documento: paciente.documento,
      telefone: paciente.telefone,
      endereco: paciente.endereco,
      cep: paciente.cep,
      status: "CADASTRADO",
      createdAt: new Date().toISOString(),
    };

    const data = await postApi("pacientes", novoPaciente, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data) {
      alert("Erro ao cadastrar usuário!");
      return;
    }

    navigate("/triagem");
  };

  // Máscaras
  const formatDocumento = (val) =>
    val.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2");

  const formatTelefone = (val) =>
    val.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");

  const formatCep = (val) => val.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro de Paciente</h1>
          <p className="text-gray-600">Preencha as informações do paciente para iniciar o atendimento</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">Nome Completo</label>
            <div className="relative">
              <input
                type="text"
                name="nome"
                value={paciente.nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                placeholder="Digite o nome completo"
                required
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Data de Nascimento e Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-semibold mb-1">Data de Nascimento</label>
              <div className="relative">
                <input
                  type="date"
                  name="nascimento"
                  value={paciente.nascimento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                  required
                />
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-1">Documento (CPF/RG)</label>
              <div className="relative">
                <input
                  type="text"
                  name="documento"
                  value={paciente.documento}
                  onChange={(e) =>
                    setPaciente((prev) => ({ ...prev, documento: formatDocumento(e.target.value) }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                  placeholder="000.000.000-00"
                  required
                />
                <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Telefone */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">Telefone</label>
            <div className="relative">
              <input
                type="tel"
                name="telefone"
                value={paciente.telefone}
                onChange={(e) =>
                  setPaciente((prev) => ({ ...prev, telefone: formatTelefone(e.target.value) }))
                }
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                placeholder="(11) 99999-9999"
                required
              />
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* CEP e Endereço */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1">CEP</label>
            <div className="relative">
              <input
                type="text"
                name="cep"
                value={paciente.cep}
                onChange={(e) =>
                  setPaciente((prev) => ({ ...prev, cep: formatCep(e.target.value) }))
                }
                onKeyDown={handleCepKeyDown}
                className={`w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 ${
                  cepValid ? "focus:ring-green-500 border-green-500" : "focus:ring-green-400 border-gray-300"
                }`}
                placeholder="00000-000"
                maxLength={9}
                required
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {loadingCep && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-gray-300 border-t-green-400 rounded-full animate-spin"></div>
              )}
              {cepValid && !loadingCep && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>

            {cepSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
                {cepSuggestions.map((end, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectEndereco(end)}
                    className="p-2 hover:bg-green-100 cursor-pointer"
                  >
                    {end}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold mb-1">Endereço Completo</label>
            <div className="relative">
              <textarea
                name="endereco"
                value={paciente.endereco}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                rows={3}
                placeholder="Rua, número, bairro, cidade - UF"
                required
              />
              <FaHome className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
          >
            <FaUserPlus /> <span>Cadastrar Paciente</span>
          </button>
        </form>
      </div>
    </div>
  );
}
