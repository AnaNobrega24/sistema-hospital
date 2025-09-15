import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postApi } from '../services/apiServices'

export default function Cadastro() {
  const navigate = useNavigate()

  const [paciente, setPaciente] = useState({
    nome: '',
    nascimento: '',
    documento: '',
    telefone: '',
    cep: '',
    endereco: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPaciente((prev) => ({ ...prev, [name]: value }))

    // Dispara busca do CEP após 8 dígitos
    if (name === 'cep' && value.length === 8) {
      buscarEndereco(value)
    }
  }

  const buscarEndereco = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setPaciente(prev => ({
          ...prev,
          endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    

    const novoPaciente = {
      id: Date.now(),
      nome: paciente.nome,
      dataNascimento: paciente.nascimento,
      documento: paciente.documento,
      telefone: paciente.telefone,
      endereco: paciente.endereco,
      cep: paciente.cep,
      status: 'CADASTRADO',
      createdAt: new Date().toISOString(),
    }
    

    const data = await postApi("pacientes",novoPaciente, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

    if(!data) {
      alert("Erro ao cadastrar usuário!")
    }
    

    navigate('/triagem')
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Cadastro de Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={paciente.nome}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Data de Nascimento</label>
          <input
            type="date"
            name="nascimento"
            value={paciente.nascimento}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Documento (CPF/RG)</label>
          <input
            type="text"
            name="documento"
            value={paciente.documento}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Telefone</label>
          <input
            type="tel"
            name="telefone"
            value={paciente.telefone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">CEP</label>
          <input
            type="text"
            name="cep"
            value={paciente.cep}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            maxLength="8"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Endereço</label>
          <textarea
            name="endereco"
            value={paciente.endereco}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#2c3e50] text-white py-3 rounded hover:bg-[#27ae60] transition-colors cursor-pointer"
        >
          Cadastrar Paciente
        </button>
      </form>
    </div>
  )
}
