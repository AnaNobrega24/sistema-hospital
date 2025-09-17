// src/components/historico/ListaHistorico.jsx
import React from 'react';
import ItemHistorico from './ItemHistorico';

export default function ListaHistorico({ atendimentos }) {
  if (!atendimentos || atendimentos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><i className="fas fa-search"></i></div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum atendimento encontrado</h3>
        <p className="text-gray-500">Ajuste os filtros para encontrar os registros desejados.</p>
      </div>
    );
  }

  return (
    <div>
      {atendimentos.map((atendimento, index) => (
        <ItemHistorico key={atendimento.id} atendimento={atendimento} index={index} />
      ))}
    </div>
  );
}
