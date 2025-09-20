import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getApi } from "../services/apiServices";

const AtendimentoContext = createContext();

export function AtendimentoProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para carregar pacientes da API
  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getApi("pacientes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar pacientes:", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregamento inicial
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Escuta o evento customizado para recarregar
  useEffect(() => {
    const handlePatientsChanged = () => {
      loadPatients();
    };

    window.addEventListener('patientsChanged', handlePatientsChanged);
    return () => window.removeEventListener('patientsChanged', handlePatientsChanged);
  }, [loadPatients]);

  // Função para atualizar paciente localmente
  const updatePatient = (id, changes) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...changes } : p))
    );
  };

  // Função para remover paciente da lista
  const removePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const value = {
    patients,
    setPatients,
    updatePatient,
    removePatient,
    loadPatients,
    loading
  };

  return (
    <AtendimentoContext.Provider value={value}>
      {children}
    </AtendimentoContext.Provider>
  );
}

export function useAtendimento() {
  return useContext(AtendimentoContext);
}