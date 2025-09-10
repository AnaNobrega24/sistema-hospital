// src/pages/Relatorios.jsx
import React, { useState } from 'react';
import { mockRelatoriosData } from '../data/mockRelatorios';
import StatCard from '../components/relatorios/StatCard';
import GraficoAtendimentos from '../components/relatorios/GraficoAtendimentos';

export default function Relatorios() {
  const [estatisticas, setEstatisticas] = useState(mockRelatoriosData);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard de Relatórios</h2>

      {/* Cards de Destaque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          titulo="Tempo Médio de Espera"
          valor={estatisticas.tempoMedioEsperaMin}
          unidade="min"
        />
        {/* Você pode adicionar outros StatCards aqui, como "Total de Atendimentos" */}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraficoAtendimentos
          titulo="Atendimentos por Médico"
          dados={estatisticas.pacientesPorMedico}
          chaveNome="nomeMedico"
          chaveValor="total"
        />
        <GraficoAtendimentos
          titulo="Pacientes por Prioridade"
          dados={estatisticas.pacientesPorPrioridade}
          chaveNome="prioridade"
          chaveValor="total"
        />
      </div>
    </div>
  );
}