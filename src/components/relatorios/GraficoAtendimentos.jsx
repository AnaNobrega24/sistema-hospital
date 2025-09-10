// src/components/relatorios/GraficoAtendimentos.jsx
import React from 'react';

// ATENÇÃO: Esta é uma versão SIMPLIFICADA apenas para exibir os dados.
// Mais tarde, vocês podem substituir isso por uma biblioteca de gráficos como a Chart.js.
export default function GraficoAtendimentos({ titulo, dados, chaveNome, chaveValor }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
      <ul>
        {dados.map((item, index) => (
          <li key={index} className="flex justify-between border-b py-2 text-sm">
            <span>{item[chaveNome]}</span>
            <span className="font-bold">{item[chaveValor]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}