import React from 'react'
import { getPriorityColor } from '../utils/triagem'

export default function PacienteCard({ paciente, onClick, children }) {
  if (!paciente) return null
  return (
    <div
      className="border rounded-lg p-4 mb-2 bg-white flex flex-col md:flex-row md:items-center justify-between shadow"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{paciente.name}</span>
          {paciente.priority && (
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-bold uppercase bg-${getPriorityColor(paciente.priority)}-100 text-${getPriorityColor(paciente.priority)}-800`}
            >
              {paciente.priority}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600">
          <span>Doc: {paciente.document}</span> | <span>Nasc: {new Date(paciente.dob).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="text-xs text-gray-500">Status: {paciente.status}</div>
      </div>
      {children && <div className="mt-2 md:mt-0">{children}</div>}
    </div>
  )
}