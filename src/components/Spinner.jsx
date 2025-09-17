// src/components/Spinner.jsx
import React from 'react';

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-green-600 rounded-full animate-spin mb-4"></div>
      <div className="text-gray-500 font-medium text-lg">Carregando Histórico</div>
      <div className="text-gray-400 text-sm">Buscando registros de atendimentos...</div>
    </div>
  );
}
