import React, { useState, useEffect } from 'react'

export default function Painel() {
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
  const display = patients
    .filter(p => ['aguardando-atendimento','em-atendimento'].includes(p.status))
    .sort((a,b) => {
      if(a.status==='em-atendimento' && b.status!=='em-atendimento') return -1
      if(b.status==='em-atendimento' && a.status!=='em-atendimento') return 1
      if(order[b.priority]!==order[a.priority]) return order[b.priority]-order[a.priority]
      return new Date(a.createdAt)-new Date(b.createdAt)
    })

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Painel de Espera</h2>
      {display.length===0 ? (
        <p className="text-gray-500">Nenhum paciente na fila</p>
      ) : (
        <ul className="space-y-2">
          {display.map((p,i)=>(
            <li key={p.id} className="p-3 bg-gray-50 rounded border-l-4 border-hospital-blue">
              <strong>{p.name}</strong> — 
              {p.status==='em-atendimento'
                ? ' Em atendimento'
                : ` ${i+1}º na fila`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
