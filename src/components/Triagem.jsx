import React, { useState, useEffect } from 'react'
import { FaClipboardList, FaCheckCircle } from 'react-icons/fa'

export default function Triagem() {
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({})

  // load + evento
  const load = () => {
    const stored = localStorage.getItem('patients')
    setPatients(stored ? JSON.parse(stored) : [])
  }
  useEffect(() => {
    load()
    window.addEventListener('patientsChanged', load)
    return () => window.removeEventListener('patientsChanged', load)
  }, [])

  const handleField = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  const submitTriage = (id) => {
    const { reason, priority } = formData[id] || {}
    if (!reason || !priority) return
    const updated = patients.map(p =>
      p.id === id
        ? { ...p, reason, priority, status: 'aguardando-atendimento' }
        : p
    )
    setPatients(updated)
    localStorage.setItem('patients', JSON.stringify(updated))
    window.dispatchEvent(new Event('patientsChanged'))
    // limpa data local
    setFormData(prev => { const c = { ...prev }; delete c[id]; return c })
  }

  // só aguardando triagem
  const queue = patients.filter(p => p.status === 'aguardando-triagem')

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold">Triagem de Pacientes</h2>
      {queue.length === 0 && (
        <p className="text-gray-500 flex items-center"><FaClipboardList className="mr-2"/>Nenhum paciente para triagem</p>
      )}
      {queue.map((p, i) => (
        <div key={p.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="font-mono text-gray-600">#{String(i+1).padStart(2,'0')}</span>
            <span className="font-semibold">{p.name}</span>
          </div>
          <p className="text-sm text-gray-500">
            Nasc: {new Date(p.dob).toLocaleDateString('pt-BR')} • Doc: {p.document} • Tel: {p.phone}
          </p>
          <div>
            <label className="block text-sm font-medium">Motivo da Visita</label>
            <textarea
              rows={2}
              value={formData[p.id]?.reason || ''}
              onChange={e => handleField(p.id, 'reason', e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Prioridade</label>
            <select
              value={formData[p.id]?.priority || ''}
              onChange={e => handleField(p.id, 'priority', e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded focus:ring-hospital-blue"
            >
              <option value="">Selecione</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
          <button
            onClick={() => submitTriage(p.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-hospital-blue text-white rounded hover:bg-hospital-dark transition"
          >
            <FaCheckCircle /> <span>Enviar Triagem</span>
          </button>
        </div>
      ))}
    </div>
  )
}
