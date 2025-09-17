// src/components/historico/ItemHistorico.jsx
import React from 'react';

export default function ItemHistorico({ atendimento, index }) {
  const { paciente, medico, horaInicio, diagnostico } = atendimento;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div
      className="relative bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-4 transition transform hover:translate-x-2 hover:shadow-lg animate-fadeIn"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-600 to-green-500 rounded-l-2xl scale-y-0 hover:scale-y-100 transition-transform origin-top"></div>

      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-green-500 text-white mr-3">
            <i className="fas fa-user"></i>
          </div>
          <span className="font-bold text-gray-800 text-lg">{paciente.nome}</span>
        </div>
        <span className="text-gray-500 text-sm">{formatDate(horaInicio)}</span>
      </div>

      <div className="grid gap-3">
        <div className="flex items-start">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-gradient-to-br from-green-600 to-green-500 text-white mr-3 text-xs">
            <i className="fas fa-notes-medical"></i>
          </div>
          <span className="font-semibold text-gray-500 w-24 text-sm uppercase">Motivo:</span>
          <span className="text-gray-700">{paciente.motivo}</span>
        </div>

        <div className="flex items-start">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-gradient-to-br from-green-600 to-green-500 text-white mr-3 text-xs">
            <i className="fas fa-user-md"></i>
          </div>
          <span className="font-semibold text-gray-500 w-24 text-sm uppercase">Médico:</span>
          <span className="text-gray-700">{medico.nome}</span>
        </div>

        <div className="flex items-start">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-gradient-to-br from-green-600 to-green-500 text-white mr-3 text-xs">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <span className="font-semibold text-gray-500 w-24 text-sm uppercase">Diagnóstico:</span>
          <span className="text-gray-700">{diagnostico}</span>
        </div>
      </div>
    </div>
  );
}
