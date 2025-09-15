// src/pages/Historico.jsx
import React, { useState, useEffect } from 'react';
import { mockHistoricoData } from '../data/mockHistorico';
import FiltroHistorico from '../components/historico/FiltroHistorico';
import ListaHistorico from '../components/historico/ListaHistorico';
import Spinner from '../components/Spinner'; // 1. IMPORTE O SPINNER

export default function Historico() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true); // 2. CRIE O ESTADO DE CARREGAMENTO

  // 3. Este useEffect simula a busca de dados na API
  useEffect(() => {
    setLoading(true); // Garante que o spinner apareça
    setTimeout(() => {
      setAtendimentos(mockHistoricoData);
      setLoading(false); // Esconde o spinner e mostra os dados
    }, 2000); // Simula um atraso de 2 segundos
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Atendimentos</h2>
      <FiltroHistorico />
      
      {/* 4. CONDIÇÃO: Se estiver carregando, mostra o Spinner. Senão, mostra a lista. */}
      {loading ? <Spinner /> : <ListaHistorico atendimentos={atendimentos} />}
    </div>
  );
}