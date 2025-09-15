import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postApi } from '../services/apiServices';
// import { api } from '../services/api'; 
// import { useAtendimento } from '../context/AtendimentoContext';

export default function Login() {
  const navigate = useNavigate();
  // const { setUser } = useAtendimento();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. ADICIONE A FUNÇÃO handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    try {
      // Linha de exemplo para simular um sucesso.
     const response = await postApi('auth/login', formData);
     
     localStorage.setItem("token", response.token)
      
      // Simulação de sucesso
      toast.success('Login realizado com sucesso!', response);
      
      // Após o login real, você redirecionará o usuário
       navigate('/triagem');

    } catch (err) {
      // Simulação de erro
      toast.error('Email ou senha inválidos. Tente novamente.');
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {/* 2. CONECTE A FUNÇÃO AO FORMULÁRIO */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Senha</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#2c3e50] text-white py-3 rounded hover:bg-[#27ae60] transition-colors cursor-pointer"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}