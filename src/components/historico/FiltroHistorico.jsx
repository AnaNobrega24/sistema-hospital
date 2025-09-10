// src/components/historico/FiltroHistorico.jsx
import React from 'react';

// Por enquanto, este componente é apenas visual. A lógica virá depois.
export default function FiltroHistorico() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-sm">Nome do Paciente</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="Digite o nome..." />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">De</label>
          <input type="date" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Até</label>
          <input type="date" className="w-full border p-2 rounded" />
        </div>
      </div>
    </div>
  );
}