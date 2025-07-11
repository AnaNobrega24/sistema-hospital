import React, { useState, useEffect } from 'react'
import { FaUserMd } from 'react-icons/fa'

export default function Medico() {
  const [patients, setPatients] = useState([])

  const load = () => {
    const stored = localStorage.getItem('patients')
    setPatients(stored ? JSON.parse(stored) : [])
  }
  useEffect(() => {
    load()
    window.addEventListener('patientsChanged', load)
    return () => window.removeEventListener('patientsChanged', load)
  }, [])

  const order = { alta:3, media:2, baixa:1 }
  const pending = patients.filter(p =>
    ['aguardando-atendimento','em-atendimento'].includes(p.status)
  )
  const sorted = pending.sort((a,b) => {
    if(a.status==='em-atendimento' && b.status!=='em-atendimento') return -1
    if(b.status==='em-atendimento' && a.status!=='em-atendimento') return 1
    if(order[b.priority]!==order[a.priority]) return order[b.priority]-order[a.priority]
    return new Date(a.createdAt)-new Date(b.createdAt)
  })

  const callNext = () => {
    const next = sorted.find(p=>p.status==='aguardando-atendimento')
    if(next) update(next.id,'em-atendimento')
  }
  const update = (id,status) => {
    const upd = patients.map(p=> p.id===id?({...p,status}):p)
    setPatients(upd)
    localStorage.setItem('patients',JSON.stringify(upd))
    window.dispatchEvent(new Event('patientsChanged'))
  }
  const current = sorted.find(p=>p.status==='em-atendimento')

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Atendimento Médico</h2>
      {current ? (
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded">
          <span className="font-semibold">Atendendo: {current.name}</span>
          <button
            onClick={()=>{update(current.id,'concluido'); setTimeout(callNext,0)}}
            className="px-4 py-2 bg-hospital-blue text-white rounded hover:bg-hospital-dark"
          >
            Concluir
          </button>
        </div>
      ) : (
        <button
          onClick={callNext}
          className="mb-6 px-6 py-3 bg-hospital-blue text-white rounded hover:bg-hospital-dark"
        >
          <FaUserMd /> Chamar Próximo
        </button>
      )}
      <h3 className="text-xl font-semibold mb-2">Fila de Espera</h3>
      <ul className="space-y-2">
        {sorted.map(p => (
          <li
            key={p.id}
            className="p-3 bg-gray-50 rounded border-l-4 border-hospital-blue"
          >
            {p.name} {p.status==='em-atendimento'&& '(em atendimento)'}
          </li>
        ))}
      </ul>
    </div>
)
}
