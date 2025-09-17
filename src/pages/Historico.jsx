// src/pages/Historico.jsx
import React, { useState, useEffect } from 'react';
import FiltroHistorico from '../components/historico/FiltroHistorico';
import ListaHistorico from '../components/historico/ListaHistorico';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { mockHistoricoData } from '../data/mockHistorico';

export default function Historico() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [filteredAtendimentos, setFilteredAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAtendimentos(mockHistoricoData);
      setFilteredAtendimentos(mockHistoricoData);
      setLoading(false);
    }, 2000);
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const handleFilter = ({ nome, dataDe, dataAte }) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = atendimentos.filter(atendimento => {
        const atendimentoDate = atendimento.horaInicio.split('T')[0];
        if (nome && !atendimento.paciente.nome.toLowerCase().includes(nome.toLowerCase())) return false;
        if (dataDe && atendimentoDate < dataDe) return false;
        if (dataAte && atendimentoDate > dataAte) return false;
        return true;
      });
      setFilteredAtendimentos(filtered);
      setLoading(false);
      showAlert(`Encontrados ${filtered.length} atendimentos`, 'info');
    }, 1000);
  };

  const handleClear = () => {
    setFilteredAtendimentos(atendimentos);
    showAlert('Filtros limpos', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-green-600 to-green-500 mb-2">
          Histórico de Atendimentos
        </h1>
        <p className="text-gray-500 text-lg">Consulte e filtre o histórico completo de consultas médicas</p>
      </div>

      <FiltroHistorico onFilter={handleFilter} onClear={handleClear} />

      {loading ? <Spinner /> : <ListaHistorico atendimentos={filteredAtendimentos} />}

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
}
