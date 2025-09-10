// src/components/historico/ListaHistorico.jsx
import React from 'react';
import ItemHistorico from './ItemHistorico';

// Este componente recebe a lista completa de atendimentos e a renderiza.
export default function ListaHistorico({ atendimentos }) {
  if (atendimentos.length === 0) {
    return <p className="text-center text-gray-500 mt-8">Nenhum atendimento encontrado.</p>;
  }

  return (
    <div className="mt-6">
      {atendimentos.map((atendimento) => (
        <ItemHistorico key={atendimento.id} atendimento={atendimento} />
      ))}
    </div>
  );
}