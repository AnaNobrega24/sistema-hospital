import React, { useEffect, useState } from 'react'
import { getPriorityByReason } from '../utils/triagem'

export default function Triagem() {
  const [patients, setPatients] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem('patients')
      const data = stored ? JSON.parse(stored) : []
      setPatients(data)
    }
    load()
    window.addEventListener('patientsChanged', load)
    return () => window.removeEventListener('patientsChanged', load)
  }, [])

  const updatePatient = (id, changes) => {
    const updated = patients.map(p => p.id === id ? { ...p, ...changes } : p)
    setPatients(updated)
    localStorage.setItem('patients', JSON.stringify(updated))
    window.dispatchEvent(new Event('patientsChanged'))
  }

  const handleFieldChange = (id, field, value) => {
    setPatients(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    )
  }

  const handleEnviarParaMedico = (id) => {
    const patient = patients.find(p => p.id === id)
    updatePatient(id, {
      ...patient,
      status: 'aguardando-atendimento'
    })
    setSelectedId(null)
  }

  const pacientesTriagem = patients.filter(p => p.status === 'cadastrado')

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Triagem de Pacientes</h2>

      {pacientesTriagem.length === 0 ? (
        <p className="text-gray-500">Nenhum paciente aguardando triagem.</p>
      ) : (
        <ul className="space-y-4">
          {pacientesTriagem.map((p) => (
            <li
              key={p.id}
              className="border p-4 rounded shadow-sm bg-gray-50 transition"
            >
              {/* Título clicável */}
              <div
                className="cursor-pointer hover:underline"
                onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
              >
                <strong>Nome:</strong> {p.name}
              </div>

              {/* Ficha expandida */}
              {selectedId === p.id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  <p><strong>Data de Nascimento:</strong> {new Date(p.dob).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Documento:</strong> {p.document}</p>
                  <p><strong>Telefone:</strong> {p.phone}</p>
                  <p><strong>Endereço:</strong> {p.address}</p>

                  <div>
                    <label className="font-semibold">Temperatura Corporal (°C):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={p.temperature || ''}
                      onChange={(e) => handleFieldChange(p.id, 'temperature', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Pressão Arterial:</label>
                    <input
                      type="text"
                      value={p.bloodPressure || ''}
                      onChange={(e) => handleFieldChange(p.id, 'bloodPressure', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                      placeholder="Ex: 120/80"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Frequência Cardíaca (bpm):</label>
                    <input
                      type="number"
                      value={p.heartRate || ''}
                      onChange={(e) => handleFieldChange(p.id, 'heartRate', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Frequência Respiratória (rpm):</label>
                    <input
                      type="number"
                      value={p.respiratoryRate || ''}
                      onChange={(e) => handleFieldChange(p.id, 'respiratoryRate', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Alergias:</label>
                    <textarea
                      value={p.allergies || ''}
                      onChange={(e) => handleFieldChange(p.id, 'allergies', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Motivo Principal da Consulta:</label>
                    <textarea
                      value={p.reason || ''}
                      onChange={(e) => {
                        handleFieldChange(p.id, 'reason', e.target.value)
                        handleFieldChange(p.id, 'priority', getPriorityByReason(e.target.value))
                      }}
                      className="w-full border p-2 rounded mt-1"
                      placeholder="Descreva com palavras do paciente"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Anotações da Enfermagem:</label>
                    <textarea
                      value={p.notes || ''}
                      onChange={(e) => handleFieldChange(p.id, 'notes', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Classificação de Risco:</label>
                    <select
                      value={p.priority || ''}
                      onChange={(e) => handleFieldChange(p.id, 'priority', e.target.value)}
                      className="w-full border p-2 rounded mt-1"
                    >
                      <option value="alta">🔴 Vermelho (Alta)</option>
                      <option value="media">🟡 Amarelo (Média)</option>
                      <option value="baixa">🟢 Verde (Baixa)</option>
                    </select>
                  </div>

                  {/* ✅ Botão com cor verde-esperança */}
                  <button
                    onClick={() => handleEnviarParaMedico(p.id)}
                    className="w-full bg-[#27ae60] text-white py-2 rounded hover:bg-[#219150] transition mt-4"
                  >
                    Enviar para Médico
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
