import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateApi } from "../services/apiServices";
import { FaUserMd, FaIdCard, FaSearch, FaUserPlus } from "react-icons/fa";

// Componente Input com ícone centralizado
function InputWithIcon({
  icon: Icon,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-md px-4 py-3 pl-12 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#59995c] focus:border-[#59995c] transition"
        required
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon />
      </div>
    </div>
  );
}

// Função para formatar CPF
const formatDocumento = (val) =>
  val
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2");

// Função para validar CPF
function isValidCPF(cpf) {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

export default function BuscarPaciente() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleCPFChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setCpf(formatDocumento(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanCPF = cpf.replace(/\D/g, "");

    if (!cleanCPF) {
      toast.error("Digite o CPF do paciente.");
      return;
    }

    if (!isValidCPF(cleanCPF)) {
      toast.error("CPF inválido. Verifique os números digitados.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateApi(
        `pacientes/buscar`,
        { documento: formatDocumento(cleanCPF) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.encontrado) {
        toast.success("Paciente encontrado!");
        // Redirecionar para página de detalhes do paciente ou triagem
        setTimeout(() => {
          navigate("/triagem");
        }, 2000);
      } else {
        toast.info(
          "Paciente não encontrado. Você será redirecionado para a página de cadastro"
        );
        // Opcional: mostrar modal ou redirecionar para cadastro
        setTimeout(() => {
          navigate("/cadastro");
        }, 2000);
      }
    } catch (err) {
      console.error("Erro ao buscar paciente:", err);
      toast.error("Erro ao buscar paciente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="login-container w-full max-w-md p-8 bg-white rounded-2xl shadow-lg relative">
        {/* Header com ícone igual ao login */}
        <div className="hospital-logo text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2f6f3d] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserMd className="text-3xl" />
          </div>
          <div className="hospital-name text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#59995c] to-[#4a8049]">
            Hospital AlphaMed
          </div>
          <div className="hospital-subtitle text-gray-500">Buscar Paciente</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-600 mb-1">
              CPF do Paciente
            </label>
            <InputWithIcon
              icon={FaIdCard}
              type="text"
              name="cpf"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#59995c] to-[#4a8049] text-white py-3 rounded-lg font-semibold hover:opacity-95 transition relative"
          >
            {loading && (
              <span className="absolute left-4 inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            <FaSearch className={`${loading ? "opacity-50" : ""}`} />
            <span>{loading ? "Buscando..." : "Buscar Paciente"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
