import React, { useState } from "react";
import { postApi } from "../services/apiServices";

export default function Registro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "ATENDENTE", // Valor padrão
    especialidade: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postApi("auth/register", formData);
    
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Registrar Novo Usuário
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Campo Nome */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Campo Email */}
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

        {/* Campo Senha */}
        <div className="mb-4">
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

        {/* Campo Perfil (Role) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Perfil</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-white"
          >
            <option value="ATENDENTE">Atendente</option>
            <option value="MEDICO">Médico</option>
          </select>
        </div>

        {/* Campo Especialidade (Condicional) */}
        {formData.role === "MEDICO" && (
          <div className="mb-6">
            <label className="block mb-1 font-medium">Especialidade</label>
            <input
              type="text"
              name="especialidade"
              value={formData.especialidade}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Ex: Clínico Geral"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#2c3e50] text-white py-3 rounded hover:bg-[#27ae60] transition-colors cursor-pointer"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
