// src/pages/Historico.jsx
import React, { useState } from 'react';
import { mockHistoricoData } from '../data/mockHistorico'; // Nossos dados falsos
import FiltroHistorico from '../components/historico/FiltroHistorico';
import ListaHistorico from '../components/historico/ListaHistorico';

export default function Historico() {
  const [atendimentos, setAtendimentos] = useState(mockHistoricoData);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Atendimentos</h2>
      <FiltroHistorico />
      <ListaHistorico atendimentos={atendimentos} />
    </div>
  );
}