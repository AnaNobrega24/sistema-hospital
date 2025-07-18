import React, { useState, useEffect } from 'react'
import { FaUserMd } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const renderPriority = (priority) => {
  switch (priority) {
    case 'alta': return '🔴 Vermelho (Alta)'
    case 'media': return '🟡 Amarelo (Média)'
    case 'baixa': return '🟢 Verde (Baixa)'
    default: return '⚪️ Não definida'
  }
}

export default function Medico() {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({})

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
    const stored = localStorage.getItem('patients')
    const existing = stored ? JSON.parse(stored) : []
    const updated = existing.map(p => p.id === id ? { ...p, ...changes } : p)
    localStorage.setItem('patients', JSON.stringify(updated))
    window.dispatchEvent(new Event('patientsChanged'))
    setPatients(updated)
  }

  const callNext = () => {
    const next = patients.find(p => p.status === 'aguardando-atendimento')
    if (next) {
      updatePatient(next.id, { status: 'em-atendimento' })
      setForm({})
    }
  }

  const current = patients.find(p => p.status === 'em-atendimento')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const concluirAtendimento = () => {
    updatePatient(current.id, {
      status: 'concluido',
      atendimento: form
    })
    setForm({})
    setTimeout(callNext, 0)
  }

  const fila = patients
    .filter(p => p.status === 'aguardando-atendimento')
    .sort((a, b) => {
      const order = { alta: 3, media: 2, baixa: 1 }
      return (order[b.priority] || 0) - (order[a.priority] || 0)
    })

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Atendimento Médico</h2>

      {current ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <p><strong>Nome:</strong> {current.name}</p>
            <p><strong>Motivo da Visita:</strong> {current.reason}</p>
            <p><strong>Temperatura:</strong> {current.temperature}</p>
            <p><strong>Pressão:</strong> {current.bloodPressure}</p>
            <p><strong>Prioridade:</strong> {renderPriority(current.priority)}</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Diagnóstico</label>
              <textarea
                name="diagnostico"
                className="w-full p-2 border rounded"
                value={form.diagnostico || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold">Prescrição</label>
              <textarea
                name="prescricao"
                className="w-full p-2 border rounded"
                value={form.prescricao || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold">Observações</label>
              <textarea
                name="observacoes"
                className="w-full p-2 border rounded"
                value={form.observacoes || ''}
                onChange={handleChange}
              />
            </div>
          </form>

          <button
            onClick={concluirAtendimento}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Concluir Atendimento
          </button>
        </div>
      ) : (
        patients.some(p => p.status === 'aguardando-atendimento') ? (
          <button
            onClick={callNext}
            className="mb-6 px-6 py-3 bg-hospital-blue text-white rounded hover:bg-hospital-dark flex items-center gap-2"
          >
            <FaUserMd /> Chamar Próximo
          </button>
        ) : (
          <p className="text-gray-500 italic mb-6">Nenhum paciente aguardando na fila.</p>
        )
      )}

      <h3 className="text-xl font-semibold mt-8 mb-2">Fila de Espera</h3>
      <ul className="space-y-2">
        {fila.map(p => (
          <li
            key={p.id}
            className="p-3 bg-gray-50 rounded border-l-4 border-hospital-blue"
          >
            <div className="flex flex-col">
              <div>
                <strong>{p.name}</strong> — {p.reason || 'Motivo não informado'}
              </div>
              <span className="text-sm text-gray-600">{renderPriority(p.priority)}</span>
              <Link
                to={`/prontuario/${p.id}`}
                onClick={() => updatePatient(p.id, { status: 'em-atendimento' })}
                className="text-blue-600 hover:underline text-sm mt-1"
              >
                Abrir Prontuário
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
