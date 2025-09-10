// src/components/historico/ItemHistorico.jsx
import React from 'react';

// Este componente recebe um único atendimento como "prop" e o exibe.
export default function ItemHistorico({ atendimento }) {
  const { paciente, medico, horaInicio, diagnostico } = atendimento;

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-[#2c3e50]">{paciente.nome}</span>
        <span className="text-sm text-gray-500">
          {new Date(horaInicio).toLocaleDateString('pt-BR')}
        </span>
      </div>
      <div className="text-sm">
        <p><span className="font-semibold">Motivo:</span> {paciente.motivo}</p>
        <p><span className="font-semibold">Médico:</span> {medico.nome}</p>
        <p><span className="font-semibold">Diagnóstico:</span> {diagnostico}</p>
      </div>
    </div>
  );
}