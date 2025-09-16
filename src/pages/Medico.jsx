// src/components/Medico.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  FaUserMd,
  FaClock,
  FaExclamationCircle,
  FaFileMedical,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getApi, postApi, updateApi } from "../services/apiServices";

const renderPriority = (priority) => {
  switch (priority) {
    case "ALTA":
      return { label: "Vermelho (Alta)", color: "red" };
    case "MEDIA":
      return { label: "Amarelo (Média)", color: "yellow" };
    case "BAIXA":
      return { label: "Verde (Baixa)", color: "green" };
    default:
      return { label: "Não definida", color: "gray" };
  }
};

function timeSince(createdAt) {
  if (!createdAt) return "--";
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

export default function Medico() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // paciente em atendimento
  const current = useMemo(
    () => patients.find((p) => p.status === "EM_ATENDIMENTO"),
    [patients]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = async () => {
      try {
        const data = await getApi("pacientes/fila", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
        setPatients([]);
      }
    };

    load();
    window.addEventListener("patientsChanged", load);
    return () => window.removeEventListener("patientsChanged", load);
  }, []);

  const syncStatus = async (id, paciente) => {
    const token = localStorage.getItem("token");
    try {
      if (paciente.status) {
        await updateApi(`pacientes/${id}/status`, { status: paciente.status }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (paciente.status === "EM_ATENDIMENTO") {
        await postApi("atendimento/iniciar", { pacienteId: id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (paciente.status === "CONCLUIDO" && paciente.atendimento) {
        await postApi("atendimento/concluir", {
          pacienteId: id,
          atendimento: paciente.atendimento,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      window.dispatchEvent(new Event("patientsChanged"));
    } catch (err) {
      console.error("Erro sincronizando status:", err);
    }
  };

  const updatePatientLocal = (id, changes = {}) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  };

  const updatePatient = async (id, changes = {}) => {
    updatePatientLocal(id, changes);
    const paciente = patients.find((p) => p.id === id) || {};
    const merged = { ...paciente, ...changes };
    await syncStatus(id, merged);
  };

  const callNext = () => {
    const next = patients.find((p) => p.status === "AGUARDANDO");
    if (next) {
      setForm({});
      updatePatient(next.id, { status: "EM_ATENDIMENTO" });
    }
  };

  const openProntuario = (id) => {
    setForm({});
    updatePatient(id, { status: "EM_ATENDIMENTO" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // open confirmation modal (shows brief summary)
  const askConfirmConclude = () => {
    if (!current) return;
    if (!form.sintomas || !form.cid10) {
      alert("Preencha pelo menos os sintomas e o CID-10 antes de concluir.");
      return;
    }
    setConfirmOpen(true);
  };

  // confirm action
  const confirmarConclusao = async () => {
    if (!current) return;
    setLoading(true);

    try {
      // update local paciente: status CONCLUIDO + atendimento
      updatePatientLocal(current.id, {
        status: "CONCLUIDO",
        atendimento: { ...form },
      });

      // sync with backend (calls updatePatient which posts atendimento/concluir)
      await syncStatus(current.id, {
        status: "CONCLUIDO",
        atendimento: { ...form },
      });

      // remove patient locally from list (optional — keeps history)
      setPatients((prev) => prev.filter((p) => p.id !== current.id));
      setForm({});
      setConfirmOpen(false);

      // call next automatically if present
      setTimeout(() => {
        callNext();
      }, 300);
    } catch (err) {
      console.error("Erro ao concluir:", err);
      alert("Erro ao concluir atendimento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fila = patients
    .filter((p) => p.status === "AGUARDANDO")
    .sort((a, b) => {
      const order = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
      const pa = (a.triage && a.triage.prioridade) || "";
      const pb = (b.triage && b.triage.prioridade) || "";
      return (order[pb] || 0) - (order[pa] || 0);
    });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#2f6f3d]">Atendimento Médico</h2>
          <p className="text-gray-500">Consultas e acompanhamento de pacientes</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* Paciente em atendimento header (green) */}
          {current && (
            <div className="rounded-lg overflow-hidden mb-6" style={{ background: "linear-gradient(90deg,#4f8f55,#609e60)" }}>
              <div className="p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-md">
                      <FaUserMd />
                    </div>
                    <div>
                      <div className="text-sm uppercase text-white/90 font-semibold">Paciente em Atendimento</div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-xxs text-white/80 uppercase">Nome do Paciente</div>
                          <div className="font-semibold">{current.nome}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-xxs text-white/80 uppercase">Motivo da Consulta</div>
                          <div className="font-semibold">{current.triage?.motivo || "—"}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-xxs text-white/80 uppercase">Temperatura</div>
                          <div className="font-semibold">{current.triage?.temperatura || "—"}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-xxs text-white/80 uppercase">Pressão Arterial</div>
                          <div className="font-semibold">{current.triage?.pressaoSanguinea || current.triage?.pressao || "—"}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${renderPriority(current.triage?.prioridade).color === "red" ? "bg-red-500" : renderPriority(current.triage?.prioridade).color === "yellow" ? "bg-yellow-400" : "bg-green-400"}`}></div>
                          <div>
                            <div className="text-xxs text-white/80 uppercase">Classificação de Risco</div>
                            <div className="font-semibold">{renderPriority(current.triage?.prioridade).label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <div className="bg-white/20 px-3 py-1 rounded text-white/90">Status: EM ATENDIMENTO</div>
                    <div className="text-white/90 text-xs mt-2 flex items-center gap-2"><FaClock /> {timeSince(current.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {current ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded border p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FaExclamationCircle className="text-[#2f6f3d]" /> Sinais e Sintomas</h4>
                  <textarea
                    name="sintomas"
                    rows={5}
                    value={form.sintomas || ""}
                    onChange={handleChange}
                    placeholder="Descreva os sinais e sintomas observados..."
                    className="w-full border rounded p-3 text-sm"
                  />
                </div>

                <div className="bg-white rounded border p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FaFileMedical className="text-[#2f6f3d]" /> Diagnóstico</h4>

                  <label className="text-xs text-gray-500">Código CID-10</label>
                  <input
                    name="cid10"
                    value={form.cid10 || ""}
                    onChange={handleChange}
                    placeholder="Ex: K52.9 - Gastroenterite"
                    className="w-full border rounded p-2 mt-1 mb-3 text-sm"
                  />

                  <label className="text-xs text-gray-500">Tipo de Atendimento</label>
                  <select
                    name="tipoAtendimento"
                    value={form.tipoAtendimento || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-2 mt-1 text-sm"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="ambulatorial">Ambulatorial</option>
                    <option value="urgencia">Urgência</option>
                    <option value="internacao">Internação</option>
                  </select>
                </div>

                <div className="bg-white rounded border p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FaFileMedical className="text-[#2f6f3d]" /> Prescrição Médica</h4>
                  <textarea
                    name="prescricao"
                    rows={4}
                    value={form.prescricao || ""}
                    onChange={handleChange}
                    placeholder="Digite a prescrição médica..."
                    className="w-full border rounded p-3 text-sm"
                  />
                </div>

                <div className="bg-white rounded border p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FaFileMedical className="text-[#2f6f3d]" /> Observações</h4>
                  <textarea
                    name="observacoes"
                    rows={4}
                    value={form.observacoes || ""}
                    onChange={handleChange}
                    placeholder="Observações gerais sobre o atendimento..."
                    className="w-full border rounded p-3 text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={askConfirmConclude}
                  className="w-full bg-[#2f6f3d] hover:bg-[#285a30] text-white py-3 rounded font-semibold flex items-center justify-center gap-3"
                >
                  <FaCheck /> CONCLUIR ATENDIMENTO
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              {fila.length > 0 ? (
                <button
                  onClick={callNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2f6f3d] text-white rounded hover:bg-[#285a30]"
                >
                  <FaUserMd /> Chamar Próximo
                </button>
              ) : (
                <div className="text-gray-500">Nenhum paciente aguardando na fila.</div>
              )}
            </div>
          )}

          {/* Fila de Espera */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3"><FaFileMedical className="text-[#2f6f3d]" /> Fila de Espera <span className="ml-2 text-sm text-gray-500">({fila.length})</span></h3>

            <ul className="space-y-4">
              {fila.map((p) => {
                const priority = renderPriority(p.triage?.prioridade);
                return (
                  <li key={p.id} className="bg-white rounded border p-4 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold">{p.nome}</div>
                          <div className="text-sm text-gray-600">{p.triage?.motivo || "Motivo não informado"}</div>
                        </div>
                        <div className={`ml-4 text-xs px-3 py-1 rounded-full text-${priority.color}-700 bg-${priority.color}-100`} />
                      </div>

                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-3">
                        <FaClock /> Aguardando há <span className="font-semibold">{timeSince(p.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Link
                        to={`/prontuario/${p.id}`}
                        onClick={() => openProntuario(p.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        Abrir Prontuário
                      </Link>

                      <button
                        onClick={() => updatePatient(p.id, { status: "EM_ATENDIMENTO" })}
                        className="px-3 py-1 border rounded text-sm text-[#2f6f3d] hover:bg-green-50"
                      >
                        Chamar
                      </button>
                    </div>
                  </li>
                );
              })}
              {fila.length === 0 && <li className="text-center text-gray-500 py-6">Fila vazia</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmOpen && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-3">Confirmar Conclusão do Atendimento</h3>

            <div className="mb-4 text-sm text-gray-700">
              <p><strong>Paciente:</strong> {current.nome}</p>
              <p><strong>Motivo:</strong> {current.triage?.motivo || "—"}</p>
              <p><strong>Prioridade:</strong> {renderPriority(current.triage?.prioridade).label}</p>
              <p className="mt-2 text-xs text-gray-500">Ao confirmar, o atendimento será marcado como concluído e os dados serão enviados para o servidor.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                <FaTimes className="inline mr-2" /> Cancelar
              </button>

              <button
                onClick={confirmarConclusao}
                disabled={loading}
                className="px-4 py-2 rounded bg-[#2f6f3d] text-white flex items-center gap-2 hover:bg-[#285a30]"
              >
                {loading ? "Confirmando..." : <><FaCheck /> Confirmar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
