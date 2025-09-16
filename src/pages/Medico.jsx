import React, { useState, useEffect } from 'react'
import { FaUserMd } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getApi, postApi } from '../services/apiServices'

const renderPriority = (priority) => {
  switch (priority) {
    case 'ALTA': return '🔴 Vermelho (Alta)'
    case 'MEDIA': return '🟡 Amarelo (Média)'
    case 'BAIXA': return '🟢 Verde (Baixa)'
    default: return '⚪️ Não definida'
  }
}

export default function Medico() {
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({})

  useEffect(() => {
    const token = localStorage.getItem("token")
        const load = async () => {
          const data = await getApi("pacientes/fila", {
            headers: {
              Authorization: `Bearer ${token}` 
            },
          });
          setPatients(data);
        };
    load()
    window.addEventListener('patientsChanged', load)
    return () => window.removeEventListener('patientsChanged', load)
  }, [])
  

  const updatePatient = async(id, changes) => {
    const token = localStorage.getItem("token")
    const updated = patients.map(p => p.id === id ? { ...p, ...changes } : p)
    setPatients(updated)
    const pacienteEmAtendimento = patients.filter((p) => p.id === id)
    
    await postApi("atendimento/iniciar", {pacienteId: pacienteEmAtendimento[0].id}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    window.dispatchEvent(new Event('patientsChanged'))
  }

  const callNext = () => {
    const next = patients.find(p => p.status === 'AGUARDANDO')
    if (next) {
      updatePatient(next.id, { status: 'EM_ATENDIMENTO' })
      setForm({})
    }
  }

  const current = patients.find(p => p.status === 'EM_ATENDIMENTO')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const concluirAtendimento = () => {
    updatePatient(current.id, {
      status: 'CONCLUIDO',
      atendimento: form
    })
    setForm({})
    setTimeout(callNext, 0)
  }

  const fila = patients
    .filter(p => p.status === 'AGUARDANDO')
    .sort((a, b) => {
      const order = { alta: 3, media: 2, baixa: 1 }
      return (order[b.triage.prioridade] || 0) - (order[a.triage.prioridade] || 0)
    })

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Atendimento Médico</h2>

      {current ? (
        <div className="space-y-4">
          {/* Dados do Paciente */}
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="text-lg font-semibold mb-2">Informações do Paciente</h3>
            <p><strong>Nome:</strong> {current.nome}</p>
            <p><strong>Motivo da Visita:</strong> {current.triage.motivo}</p>
            <p><strong>Temperatura:</strong> {current.triage.temperatura}</p>
            <p><strong>Pressão:</strong> {current.triage.pressaoSanguinea}</p>
            <p><strong>Prioridade:</strong> {renderPriority(current.triage.prioridade)}</p>
          </div>

          {/* Formulário Médico */}
          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Sinais e Sintomas</label>
              <textarea
                name="sintomas"
                className="w-full border p-2 rounded"
                value={form.sintomas || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-semibold">Diagnóstico CID-10</label>
              <input
                type="text"
                name="cid10"
                className="w-full border p-2 rounded"
                value={form.cid10 || ''}
                onChange={handleChange}
                placeholder="Ex: K52.9 - Gastroenterite"
              />
            </div>

            <div>
              <label className="block font-semibold">Tipo de Atendimento</label>
              <select
                name="tipoAtendimento"
                value={form.tipoAtendimento || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecione</option>
                <option value="ambulatorial">Ambulatorial</option>
                <option value="urgencia">Urgência</option>
                <option value="internacao">Internação</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Prescrição Médica</label>
              <textarea
                name="prescricao"
                className="w-full border p-2 rounded"
                value={form.prescricao || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-semibold">Observações</label>
              <textarea
                name="observacoes"
                className="w-full border p-2 rounded"
                value={form.observacoes || ''}
                onChange={handleChange}
              />
            </div>
          </form>

          <button
            onClick={concluirAtendimento}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            Concluir Atendimento
          </button>
        </div>
      ) : (
        patients.some(p => p.status === 'aguardando-atendimento') ? (
          <button
            onClick={callNext}
            className="mb-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <FaUserMd /> Chamar Próximo
          </button>
        ) : (
          <p className="text-gray-500 italic mb-6">Nenhum paciente aguardando na fila.</p>
        )
      )}

      <h3 className="text-xl font-semibold mt-10 mb-2">Fila de Espera</h3>
      <ul className="space-y-2">
        {fila.map(p => (
          <li
            key={p.id}
            className="p-3 bg-gray-50 rounded border"
          >
            <div className="flex flex-col">
              <div>
                <strong>{p.nome}</strong> — {p.triage.motivo || 'Motivo não informado'}
              </div>
              <span className="text-sm text-gray-600">{renderPriority(p.triage.prioridade)}</span>
              <Link
                to={`/prontuario/${p.id}`}
                onClick={() => updatePatient(p.id, { status: 'EM_ATENDIMENTO' })}
                className="text-green-700 hover:underline text-sm mt-1"
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
