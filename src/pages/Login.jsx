import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postApi } from '../services/apiServices';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserMd } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Componente Input com ícone centralizado
function InputWithIcon({ type = 'text', placeholder, name, value, onChange, icon }) {
  const Icon = icon || FaEnvelope;
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.senha) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await postApi('auth/login', formData);

      // salvar token no localStorage (continua necessário para chamadas à API)
      if (response.token) localStorage.setItem('token', response.token);

      // atualizar contexto de autenticação com os dados do usuário
      if (response.user) {
        login(response.user);
      }

      toast.success('Login realizado com sucesso!');

      // redirecionar conforme role (mantive sua lógica)
      if (response.user?.role === 'ATENDENTE') {
        navigate('/busca-paciente');
      } else if (response.user?.role === 'MEDICO') {
        navigate('/medico');
      } else {
        // rota fallback
        navigate('/');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      toast.error('Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="login-container w-full max-w-md p-8 bg-white rounded-2xl shadow-lg relative">
        {/* Header com ícone igual ao registro */}
        <div className="hospital-logo text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2f6f3d] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserMd className="text-3xl" />
          </div>
          <div className="hospital-name text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#59995c] to-[#4a8049]">
            Hospital AlphaMed
          </div>
          <div className="hospital-subtitle text-gray-500">Sistema de Gestão Hospitalar</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail</label>
            <InputWithIcon
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              icon={FaEnvelope}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Senha</label>
            <InputWithIcon
              icon={FaLock}
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
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
            <FaSignInAlt className={`${loading ? 'opacity-50' : ''}`} />
            <span>{loading ? 'Entrando...' : 'Entrar'}</span>
          </button>
        </form>

        {/* Esqueceu a senha */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => toast.info('Funcionalidade em desenvolvimento.')}
            className="text-sm text-[#59995c] hover:underline"
          >
            Esqueceu sua senha?
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to={'/registro'}>
            <button type="button" className="text-sm text-[#59995c] hover:underline">
              Não possui uma conta ainda?
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
