// src/pages/Relatorios.jsx
import React, { useState, useEffect } from 'react';
import { mockRelatoriosData } from '../data/mockRelatorios';
import StatCard from '../components/relatorios/StatCard';
import GraficoAtendimentos from '../components/relatorios/GraficoAtendimentos';
import Spinner from '../components/Spinner'; // 1. IMPORTE O SPINNER

export default function Relatorios() {
  const [estatisticas, setEstatisticas] = useState(null); // Inicia como nulo
  const [loading, setLoading] = useState(true); // 2. CRIE O ESTADO DE CARREGAMENTO

  // 3. Simula a busca de dados
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEstatisticas(mockRelatoriosData);
      setLoading(false);
    }, 1500); // Simula 1.5 segundos de atraso
  }, []);

  // 4. Se estiver carregando, mostra o Spinner
  if (loading) {
    return <Spinner />;
  }
  
  // Se não houver estatísticas (após o carregamento), mostra uma mensagem
  if (!estatisticas) {
    return <p className="text-center text-gray-500">Não foi possível carregar as estatísticas.</p>
  }

  // 5. Se os dados chegaram, mostra o dashboard
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
        {/* Você pode adicionar outros StatCards aqui */}
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