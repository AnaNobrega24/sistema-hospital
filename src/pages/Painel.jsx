import React, { useState, useEffect } from "react";
import { getApi } from "../services/apiServices";

export default function Painel() {
  const [patients, setPatients] = useState([]);
  

  useEffect(() => {
    const token = localStorage.getItem("token")
    const load = async () => {
      const data = await getApi("pacientes/fila", {
        headers: {
          Authorization: `Bearer ${token}` 
        },
      });
      setPatients(data);
    };
    load();

    window.addEventListener("patientsChanged", load);
    return () => window.removeEventListener("patientsChanged", load);
  }, []);

  const emAtendimento = patients.find((p) => p.status === "EM_ATENDIMENTO");
  
  const fila = patients
    .filter((p) => p.status === "AGUARDANDO")
    .sort((a, b) => {
      const order = { alta: 3, media: 2, baixa: 1 };
      if (order[b.priority] !== order[a.priority])
        return order[b.priority] - order[a.priority];
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const renderPriority = (priority) => {
    switch (priority) {
      case "ALTA":
        return "🔴 Vermelho (Alta)";
      case "MEDIA":
        return "🟡 Amarelo (Média)";
      case "BAIXA":
        return "🟢 Verde (Baixa)";
      default:
        return "⚪️ Não definida";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6">
        Painel de Atendimento
      </h2>

      {/* Paciente em atendimento */}
      {emAtendimento ? (
        <div className="mb-8 text-center border p-4 rounded bg-gray-50">
          <p className="text-lg font-medium mb-1">
            🩺 Paciente em Atendimento:
          </p>
          <p className="text-xl font-bold text-hospital-blue">
            {emAtendimento.nome}
          </p>
          <p className="text-sm text-gray-600">
            Classificação: {renderPriority(emAtendimento.triage.prioridade)}
          </p>
        </div>
      ) : (
        <p className="text-center italic text-gray-500 mb-6">
          Nenhum paciente está sendo atendido no momento.
        </p>
      )}

      {/* Fila de espera */}
      <h3 className="text-lg font-semibold text-center mb-3">
        🕒 Fila de Espera
      </h3>
      {fila.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum paciente na fila</p>
      ) : (
        <ul className="space-y-2">
          {fila.map((p, i) => (
            <li
              key={p.id}
              className="p-3 bg-gray-50 rounded border-l-4 border-hospital-blue flex justify-between items-center"
            >
              <div>
                <strong>{p.nome}</strong>
                <div className="text-sm text-gray-600">
                  {renderPriority(p.triage.prioridade)}
                </div>
              </div>
              <span className="text-sm text-gray-500">{i + 1}º na fila</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
