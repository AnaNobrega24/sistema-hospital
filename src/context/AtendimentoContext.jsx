import { createContext, useContext, useState, useEffect } from "react";
import { loadPatients, savePatients } from "../utils/storage";

const AtendimentoContext = createContext();

export function AtendimentoProvider({ children }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setPatients(loadPatients());
  }, []);

  useEffect(() => {
    savePatients(patients);
    window.dispatchEvent(new Event('patientsChanged'));
  }, [patients]);

  const updatePatient = (id, changes) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...changes } : p))
    );
  };

  return (
    <AtendimentoContext.Provider value={{ patients, setPatients, updatePatient }}>
      {children}
    </AtendimentoContext.Provider>
  );
}

export function useAtendimento() {
  return useContext(AtendimentoContext);
}