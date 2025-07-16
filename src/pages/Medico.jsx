import React, { useState, useEffect } from 'react'
import { FaUserMd } from 'react-icons/fa'

export default function Medico() {
  const [patients, setPatients] = useState([])

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
    const updated = patients.map(p => p.id === id ? { ...p, ...changes } : p)
    setPatients(updated)
    localStorage.setItem('patients', JSON.stringify(updated))
    window.dispatchEvent(new Event('patientsChanged'))
  }

  const waiting = patients
    .filter(p => ['aguardando-atendimento', 'em-atendimento'].includes(p.status))
    .sort((a, b) => {
      if (a.status === 'em-atendimento' && b.status !== 'em-atendimento') return -1
      if (b.status === 'em-atendimento' && a.status !== 'em-atendimento') return 1
      const order = { alta: 3, media: 2, baixa: 1 }
      if (order[b.priority] !== order[a.priority]) return order[b.priority] - order[a.priority]
      return new Date(a.createdAt) - new Date(b.createdAt)
    })

  const callNext = () => {
    const next = waiting.find(p => p.status === 'aguardando-atendimento')
    if (next) updatePatient(next.id, { status: 'em-atendimento' })
  }

  const current = waiting.find(p => p.status === 'em-atendimento')

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Atendimento Médico</h2>

      {current ? (
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded">
          <span className="font-semibold">
            Atendendo: <strong>{current.name}</strong> — {current.reason || 'Motivo não informado'}
          </span>
          <button
            onClick={() => {
              updatePatient(current.id, { status: 'concluido' })
              setTimeout(callNext, 0)
            }}
            className="px-4 py-2 bg-hospital-blue text-white rounded hover:bg-hospital-dark"
          >
            Concluir
          </button>
        </div>
      ) : (
        <button
          onClick={callNext}
          className="mb-6 px-6 py-3 bg-hospital-blue text-white rounded hover:bg-hospital-dark flex items-center gap-2"
        >
          <FaUserMd /> Chamar Próximo
        </button>
      )}

      <h3 className="text-xl font-semibold mb-2">Fila de Espera</h3>
      <ul className="space-y-2">
        {waiting.map(p => (
          <li
            key={p.id}
            className="p-3 bg-gray-50 rounded border-l-4 border-hospital-blue"
          >
            <strong>{p.name}</strong> — {p.reason || 'Motivo não informado'}
            {p.status === 'em-atendimento' && ' (em atendimento)'}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-2">Histórico de Atendimentos</h3>
      <ul className="space-y-2">
        {patients
          .filter(p => p.status === 'concluido')
          .map(p => (
            <li
              key={p.id}
              className="p-3 bg-gray-50 rounded border-l-4 border-green-500"
            >
              <strong>{p.name}</strong> — {p.reason || 'Motivo não informado'} — {p.priority?.charAt(0).toUpperCase() + p.priority?.slice(1)}
            </li>
          ))}
      </ul>
    </div>
  )
}
