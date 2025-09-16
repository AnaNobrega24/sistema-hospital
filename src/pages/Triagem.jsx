import React, { useEffect, useState } from "react";
import { getPriorityByReason } from "../utils/triagem";
import { getApi, postApi, updateApi } from "../services/apiServices";
import { useLocation } from "react-router-dom";

export default function Triagem() {
  const [patients, setPatients] = useState([]);
  // const [triagem, setTriagem] = useState({
  //   temperatura: "",
  //   pressao: "",
  //   freqCardiaca: "",
  //   freqRespiratoria: "",
  //   alergias: "",
  //   motivo: "",
  //   prioridade: "",
  //   notas: ""
  // })
  const [selectedId, setSelectedId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = async () => {
      const data = await getApi("pacientes/triagem", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(data);
    };
    load();
    window.addEventListener("patientsChanged", load);
    return () => window.removeEventListener("patientsChanged", load);
  }, [location.pathname]);

  const updatePatient = async (id, changes) => {
    const token = localStorage.getItem("token");
    const updated = patients.map((p) =>
      p.id === id ? { ...p, ...changes } : p
    );

    setPatients(updated);

    const infosPaciente = updated.filter((p) => p.id === id);
    const pacienteTriado = {
      pacienteId: infosPaciente[0].id,
      temperatura: infosPaciente[0].temperatura,
      pressao: infosPaciente[0].pressao,
      freqCardiaca: infosPaciente[0].freqCardiaca,
      freqRespiratoria: infosPaciente[0].freqRespiratoria,
      alergias: infosPaciente[0].alergias,
      notas: infosPaciente[0].notas,
      motivo: infosPaciente[0].motivo,
      prioridade: infosPaciente[0].prioridade,
      completedAt: new Date().toISOString(),
    };

    const paciente = updated.find((p) => p.id === id)
      const status = {
        status: paciente.status}
    console.log(status);
    

    await updateApi(`pacientes/${id}/status`, status, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await postApi("pacientes/triagem", pacienteTriado, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.dispatchEvent(new Event("patientsChanged"));
  };

  const handleFieldChange = (id, field, value) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleEnviarParaMedico = (id) => {
    const patient = patients.find((p) => p.id === id);
    updatePatient(id, {
      ...patient,
      status: "AGUARDANDO",
    });

    setSelectedId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Triagem de Pacientes</h2>

      {patients.length === 0 ? (
        <p className="text-gray-500">Nenhum paciente aguardando triagem.</p>
      ) : (
        <ul className="space-y-4">
          {patients.map((p) => (
            <li
              key={p.id}
              className="border p-4 rounded shadow-sm bg-gray-50 transition"
            >
              {/* Título clicável */}
              <div
                className="cursor-pointer hover:underline"
                onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
              >
                <strong>Nome:</strong> {p.nome}
              </div>

              {/* Ficha expandida */}
              {selectedId === p.id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  <p>
                    <strong>Data de Nascimento:</strong>{" "}
                    {new Date(p.dataNascimento).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Documento:</strong> {p.documento}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {p.telefone}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {p.endereco}
                  </p>

                  <div>
                    <label className="font-semibold">
                      Temperatura Corporal (°C):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={p.temperatura || ""}
                      onChange={(e) =>
                        handleFieldChange(p.id, "temperatura", e.target.value)
                      }
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Pressão Arterial:</label>
                    <input
                      type="text"
                      value={p.pressao || ""}
                      onChange={(e) =>
                        handleFieldChange(p.id, "pressao", e.target.value)
                      }
                      className="w-full border p-2 rounded mt-1"
                      placeholder="Ex: 120/80"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      Frequência Cardíaca (bpm):
                    </label>
                    <input
                      type="number"
                      value={p.freqCardiaca || ""}
                      onChange={(e) =>
                        handleFieldChange(p.id, "freqCardiaca", e.target.value)
                      }
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      Frequência Respiratória (rpm):
                    </label>
                    <input
                      type="number"
                      value={p.freqRespiratoria || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          p.id,
                          "freqRespiratoria",
                          e.target.value
                        )
                      }
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Alergias:</label>
                    <textarea
                      value={p.alergias || ""}
                      onChange={(e) =>
                        handleFieldChange(p.id, "alergias", e.target.value)
                      }
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      Motivo Principal da Consulta:
                    </label>
                    <textarea
                      value={p.motivo || ""}
                      onChange={(e) => {
                        handleFieldChange(p.id, "motivo", e.target.value);
                        handleFieldChange(
                          p.id,
                          "prioridade",
                          getPriorityByReason(e.target.value)
                        );
                      }}
                      className="w-full border p-2 rounded mt-1"
                      placeholder="Descreva com palavras do paciente"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      Anotações da Enfermagem:
                    </label>
                    <textarea
                      value={p.notas || ""}
                      onChange={(e) =>
                        handleFieldChange(p.id, "notas", e.target.value)
                      }
                      className="w-full border p-2 rounded mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      Classificação de Risco:
                    </label>
                    <select
                      value={p.prioridade || ""}
                      onChange={(e) =>
                        handleFieldChange(p.id, "prioridade", e.target.value)
                      }
                      className="w-full border p-2 rounded mt-1"
                    >
                      <option value="ALTA">🔴 Vermelho (Alta)</option>
                      <option value="MEDIA">🟡 Amarelo (Média)</option>
                      <option value="BAIXA">🟢 Verde (Baixa)</option>
                    </select>
                  </div>

                  {/* ✅ Botão com cor verde-esperança */}
                  <button
                    onClick={() => handleEnviarParaMedico(p.id)}
                    className="w-full bg-[#27ae60] text-white py-2 rounded hover:bg-[#219150] transition mt-4"
                  >
                    Enviar para Médico
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
