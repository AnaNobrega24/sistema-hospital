import React, { useState } from 'react'; // Importe o useState
import { postApi } from '../services/apiServices';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    const data = await postApi("auth/login", formData) 
    localStorage.setItem("token",data.token)
    
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email} // Conecte ao estado
            onChange={handleChange} // Conecte à função
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Senha</label>
          <input
            type="password"
            name="senha"
            value={formData.senha} // Conecte ao estado
            onChange={handleChange} // Conecte à função
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