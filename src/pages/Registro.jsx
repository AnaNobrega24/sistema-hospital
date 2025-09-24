import React, { useState, useMemo } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaHeadset,
  FaUserMd,
  FaCheck,
} from "react-icons/fa";
import { postApi } from "../services/apiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Componente reutilizável para input com ícone e label
function InputWithIcon({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  validation,
}) {
  const borderColor =
    validation === true
      ? "border-green-300"
      : validation === false
      ? "border-red-200"
      : "border-gray-200";

  return (
    <label className="block">
      {label && <div className="text-xs text-gray-600 mb-2">{label}</div>}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FaUser />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-md border px-4 py-3 pl-10 placeholder-gray-400 focus:outline-none transition ${borderColor}`}
        />
      </div>
    </label>
  );
}

export default function Registro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "ATENDENTE",
    especialidade: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [pwdInfo, setPwdInfo] = useState({ level: null, feedback: [] });
  const [validation, setValidation] = useState({
    nome: null,
    email: null,
    senha: null,
    especialidade: null,
  });

  const navigate = useNavigate()

  const validateEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").toLowerCase());

  const checkPasswordStrength = (pwd) => {
    let score = 0;
    const missing = [];
    if (!pwd) return { score, level: null, feedback: [] };
    if (pwd.length >= 8) score++;
    else missing.push("mín. 8 caracteres");
    if (/[a-z]/.test(pwd)) score++;
    else missing.push("minúscula");
    if (/[A-Z]/.test(pwd)) score++;
    else missing.push("MAIÚSCULA");
    if (/[0-9]/.test(pwd)) score++;
    else missing.push("número");
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    else missing.push("símbolo");

    const level = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";
    return { score, level, feedback: missing };
  };

  const passwordClass = useMemo(() => {
    if (!pwdInfo.level) return "";
    if (pwdInfo.level === "weak")
      return "bg-red-50 border-red-200 text-red-700";
    if (pwdInfo.level === "medium")
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    return "bg-green-50 border-green-200 text-green-700";
  }, [pwdInfo]);

  function updateField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));

    // Validação em tempo real
    if (name === "nome")
      setValidation((v) => ({ ...v, nome: value.trim().length >= 2 }));
    if (name === "email")
      setValidation((v) => ({ ...v, email: validateEmail(value) }));
    if (name === "especialidade")
      setValidation((v) => ({ ...v, especialidade: value.trim().length > 1 }));
    if (name === "senha") {
      const info = checkPasswordStrength(value);
      setPwdInfo(info);
      setValidation((v) => ({ ...v, senha: info.level === "strong" }));
    }
  }

  function selectRole(role) {
    setForm((p) => ({
      ...p,
      role,
      especialidade: role === "MEDICO" ? p.especialidade : "",
    }));
    if (role !== "MEDICO")
      setValidation((v) => ({ ...v, especialidade: null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Validações básicas
    if (!form.nome || form.nome.trim().length < 2)
      return toast.error("Nome inválido");
    if (!validateEmail(form.email)) return alert("Email inválido");
    const pwd = checkPasswordStrength(form.senha);
    if (pwd.level === "weak" || !pwd.level) return alert("Senha muito fraca");
    if (
      form.role === "MEDICO" &&
      (!form.especialidade || form.especialidade.trim().length < 2)
    )
      return toast.error("Especialidade obrigatória para Médicos");

    setSubmitting(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        role: form.role,
        especialidade: form.role === "MEDICO" ? form.especialidade : undefined,
      };
      
      await postApi("auth/register", payload);
      toast.success("Usuário registrado com sucesso");
      setForm({
        nome: "",
        email: "",
        senha: "",
        role: "ATENDENTE",
        especialidade: "",
      });
      setPwdInfo({ level: null, feedback: [] });
      setValidation({
        nome: null,
        email: null,
        senha: null,
        especialidade: null,
      });
     navigate("/") 
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar usuário");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#2f6f3d]">
            Registro de Usuário
          </h1>
          <p className="text-gray-500">
            Cadastre novos profissionais no sistema hospitalar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 relative"
        >
          <div className="absolute left-6 right-6 -top-3 h-1 rounded-full bg-gradient-to-r from-[#59995c] to-[#4a8049]" />

          {/* Informações Pessoais */}
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-[#2f6f3d] text-white flex items-center justify-center">
                <FaUser />
              </div>
              <h3 className="font-semibold text-sm uppercase text-gray-700">
                Informações Pessoais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithIcon
                label="Nome completo"
                value={form.nome}
                onChange={(e) => updateField("nome", e.target.value)}
                placeholder="Digite o nome completo"
                validation={validation.nome}
              />
              <InputWithIcon
                label="E-mail institucional"
                icon={FaEnvelope}
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="exemplo@alphamed.com"
                validation={validation.email}
              />
            </div>
          </div>

          {/* Segurança */}
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-[#2f6f3d] text-white flex items-center justify-center">
                <FaLock />
              </div>
              <h3 className="font-semibold text-sm uppercase text-gray-700">
                Configurações de Segurança
              </h3>
            </div>

            <InputWithIcon
              label="Senha"
              icon={FaLock}
              type="password"
              value={form.senha}
              onChange={(e) => updateField("senha", e.target.value)}
              placeholder="Digite uma senha segura"
              validation={validation.senha}
            />

            {pwdInfo.level && (
              <div
                className={`mt-3 text-sm rounded-md border px-3 py-2 ${passwordClass}`}
              >
                {pwdInfo.level === "strong" && (
                  <span className="inline-flex items-center gap-2 text-green-700">
                    <FaCheck /> Senha forte
                  </span>
                )}
                {pwdInfo.level === "medium" && (
                  <span>
                    Senha média — melhorar: {pwdInfo.feedback.join(", ")}
                  </span>
                )}
                {pwdInfo.level === "weak" && (
                  <span>
                    Senha fraca — faltam: {pwdInfo.feedback.join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Perfil Profissional */}
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-[#2f6f3d] text-white flex items-center justify-center">
                <FaUserMd />
              </div>
              <h3 className="font-semibold text-sm uppercase text-gray-700">
                Perfil Profissional
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => selectRole("ATENDENTE")}
                className={`flex items-center gap-3 p-4 rounded-lg border text-left transition ${
                  form.role === "ATENDENTE"
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#2f6f3d] text-white flex items-center justify-center">
                  <FaHeadset />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Atendente</div>
                  <div className="text-xs text-gray-500">
                    Cadastro de pacientes, agendamentos e atendimento inicial.
                  </div>
                </div>
                {form.role === "ATENDENTE" && (
                  <div className="text-green-600">
                    <FaCheck />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => selectRole("MEDICO")}
                className={`flex items-center gap-3 p-4 rounded-lg border text-left transition ${
                  form.role === "MEDICO"
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#2f6f3d] text-white flex items-center justify-center">
                  <FaUserMd />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Médico</div>
                  <div className="text-xs text-gray-500">
                    Profissional responsável por consultas, diagnósticos e
                    prescrições.
                  </div>
                </div>
                {form.role === "MEDICO" && (
                  <div className="text-green-600">
                    <FaCheck />
                  </div>
                )}
              </button>
            </div>

            {form.role === "MEDICO" && (
              <InputWithIcon
                label="Especialidade Médica"
                icon={FaUserMd}
                value={form.especialidade}
                onChange={(e) => updateField("especialidade", e.target.value)}
                placeholder="Ex: Clínico Geral, Cardiologia, Pediatria..."
                validation={validation.especialidade}
              />
            )}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-3 rounded-md bg-gradient-to-r from-[#59995c] to-[#4a8049] text-white py-3 font-semibold hover:opacity-95 transition"
            >
              {submitting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="3"
                    strokeOpacity="0.25"
                    fill="none"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              ) : (
                <FaUser className="text-white" />
              )}
              <span>Registrar Usuário</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
