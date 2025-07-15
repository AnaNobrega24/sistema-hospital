import React, { useState, useEffect } from 'react'
import { FaHospitalUser, FaRegAddressCard } from 'react-icons/fa'

export default function Cadastro() {
  const [patients, setPatients] = useState([])
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // carrega do LS
  useEffect(() => {
    const stored = localStorage.getItem('patients')
    setPatients(stored ? JSON.parse(stored) : [])
  }, [])

  // persiste + notifica
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients))
    window.dispatchEvent(new Event('patientsChanged'))
  }, [patients])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !dob || !document || !phone || !address) return
    setPatients([
      ...patients,
      {
        id: Date.now(),
        name: name.trim(),
        dob,
        document: document.trim(),
        phone: phone.trim(),
        address: address.trim(),
        // só aqui: aguardando triagem
        status: 'aguardando-triagem',
        createdAt: new Date().toISOString()
      }
    ])
    // limpa form
    setName('')
    setDob('')
    setDocument('')
    setPhone('')
    setAddress('')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: '#003e6b' }}>
  Cadastro de Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome Completo</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-hospital-blue"
            placeholder="Nome completo"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Data de Nascimento</label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-hospital-blue"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Documento (CPF/RG)</label>
          <input
            value={document}
            onChange={e => setDocument(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-hospital-blue"
            placeholder="000.000.000-00"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Telefone</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-hospital-blue"
            placeholder="(00) 00000-0000"
            required
          />
        </div>
         <div>
          <label className="block text-sm font-medium">Telefone para Emergência</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-hospital-blue"
            placeholder="(00) 00000-0000"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Endereço</label>
          <textarea
            rows={2}
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded focus:ring-2 focus:ring-hospital-blue resize-none"
            placeholder="Rua, nº, Bairro, Cidade - UF"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-3 bg-black text-white rounded hover:bg-hospital-dark transition"
        >
          <FaRegAddressCard /> <span>Cadastrar Paciente</span>
        </button>
      </form>
    </div>
  )
}
