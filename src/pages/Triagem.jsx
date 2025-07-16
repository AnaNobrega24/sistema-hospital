import React, { useState, useEffect } from 'react'
import { FaClipboardList, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function Triagem() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem('patients')
      setPatients(stored ? JSON.parse(stored) : [])
    }
    load()
    window.addEventListener('patientsChanged', load)
    return () => window.removeEventListener('patientsChanged', load)
  }, [])

  const updatePatient = (id, changes) => {
    const updated = patients.map(p =>
      p.id === id ? { ...p, ...changes } : p
    )
    setPatients(updated)
    localStorage.setItem('patients', JSON.stringify(updated))
    window.dispatchEvent(new Event('patientsChanged'))
  }

  const handleField = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  const startTriage = id => {
    updatePatient(id, { status: 'em-triagem' })
  }

  const confirmTriage = id => {
    const data = formData[id] || {}
    const requiredFields = ['priority', 'temperature', 'bloodPressure', 'heartRate', 'oxygen', 'glucose', 'reason']
    const allFilled = requiredFields.every(f => data[f])

    if (!allFilled) return alert('Por favor, preencha todos os campos da triagem.')

    updatePatient(id, {
      ...data,
      status: 'aguardando-atendimento',
      triageDate: new Date().toISOString()
    })

    setFormData(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })

    navigate('/medico')
  }

  const queue = patients.filter(
    p => p.status === 'cadastrado' || p.status === 'em-triagem'
  )

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold">Triagem de Pacientes</h2>
      <p className="text-gray-600">
        Revise os dados do paciente, registre sinais vitais e defina a prioridade.
      </p>

      {queue.length === 0 ? (
        <p className="text-gray-500 flex items-center">
          <FaClipboardList className="mr-2" />
          Nenhum paciente para triagem
        </p>
      ) : (
        queue.map((p, i) => (
          <div key={p.id} className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-gray-600">#{String(i + 1).padStart(2, '0')}</span>
              {p.status === 'cadastrado' ? (
                <button
                  onClick={() => startTriage(p.id)}
                  className="px-4 py-2 bg-hospital-blue text-white rounded hover:bg-hospital-dark"
                >
                  Iniciar Triagem
                </button>
              ) : (
                <span className="text-sm font-medium text-hospital-blue">Em Triagem</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700"><strong>Nome:</strong> {p.name}</p>
                <p className="text-gray-700"><strong>Nasc:</strong> {new Date(p.dob).toLocaleDateString('pt-BR')}</p>
                <p className="text-gray-700"><strong>Documento:</strong> {p.document}</p>
                <p className="text-gray-700"><strong>Telefone:</strong> {p.phone}</p>
                <p className="text-gray-700"><strong>Endereço:</strong> {p.address}</p>
              </div>
              <div>
                <p className="text-gray-700"><strong>Registro:</strong> {p.createdAt.slice(0, 10)}</p>
              </div>
            </div>

            {p.status === 'em-triagem' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Temperatura (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData[p.id]?.temperature || ''}
                      onChange={e => handleField(p.id, 'temperature', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Pressão Arterial (mmHg)</label>
                    <input
                      value={formData[p.id]?.bloodPressure || ''}
                      onChange={e => handleField(p.id, 'bloodPressure', e.target.value)}
                      placeholder="120/80"
                      className="mt-1 w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Frequência Cardíaca (bpm)</label>
                    <input
                      type="number"
                      value={formData[p.id]?.heartRate || ''}
                      onChange={e => handleField(p.id, 'heartRate', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Saturação (%)</label>
                    <input
                      type="number"
                      value={formData[p.id]?.oxygen || ''}
                      onChange={e => handleField(p.id, 'oxygen', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Glicemia (mg/dL)</label>
                    <input
                      type="number"
                      value={formData[p.id]?.glucose || ''}
                      onChange={e => handleField(p.id, 'glucose', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Classificação de Risco</label>
                    <select
                      value={formData[p.id]?.priority || ''}
                      onChange={e => handleField(p.id, 'priority', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded"
                    >
                      <option value="">Selecione</option>
                      <option value="vermelho">🔴 Vermelho — Emergência</option>
                      <option value="laranja">🟠 Laranja — Muito Urgente</option>
                      <option value="amarelo">🟡 Amarelo — Urgente</option>
                      <option value="verde">🟢 Verde — Pouco Urgente</option>
                      <option value="azul">⚪ Azul — Não Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Queixa Principal / Motivo da Visita</label>
                  <textarea
                    value={formData[p.id]?.reason || ''}
                    onChange={e => handleField(p.id, 'reason', e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => confirmTriage(p.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-hospital-blue text-white rounded hover:bg-hospital-dark"
                  >
                    <FaCheckCircle /> <span>Confirmar Triagem</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Imprimir Ficha
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
