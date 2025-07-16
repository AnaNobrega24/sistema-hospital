import React, { useState, useEffect } from 'react'
import { FaPrint } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function Cadastro() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    name: '',
    dob: '',
    document: '',
    phone: '',
    address: ''
  })

  // Carrega pacientes salvos
  useEffect(() => {
    const stored = localStorage.getItem('patients')
    setPatients(stored ? JSON.parse(stored) : [])
  }, [])

  // Atualiza localStorage ao alterar pacientes
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients))
    window.dispatchEvent(new Event('patientsChanged'))
  }, [patients])

  // Salva paciente e redireciona
  const saveAndNavigate = () => {
    const { name, dob, document, phone, address } = form
    if (!name || !dob || !document || !phone || !address) return false

    const newPatient = {
      id: Date.now(),
      ...form,
      status: 'cadastrado',
      createdAt: new Date().toISOString()
    }

    const updated = [...patients, newPatient]
    localStorage.setItem('patients', JSON.stringify(updated)) // salva direto
    window.dispatchEvent(new Event('patientsChanged'))
    setPatients(updated)

    setForm({ name: '', dob: '', document: '', phone: '', address: '' })
    navigate('/triagem')
    return true
  }

  // Botão de imprimir
  const handlePrint = () => {
    if (saveAndNavigate()) {
      setTimeout(() => window.print(), 300)
    }
  }

  // Atualiza formulário
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-hospital-dark">Cadastro de Paciente</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome Completo</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Data de Nascimento</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Documento (CPF/RG)</label>
          <input
            name="document"
            value={form.document}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Telefone</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Endereço</label>
          <textarea
            name="address"
            rows={2}
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer"
        >
          <FaPrint />
          <span>Imprimir Ficha</span>
        </button>
      </div>
    </div>
  )
}
