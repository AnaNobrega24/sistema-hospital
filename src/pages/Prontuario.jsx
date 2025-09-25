import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApi, updateApi } from "../services/apiServices";

import {
  FaUserMd,
  FaClock,
  FaExclamationCircle,
  FaFileMedical,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { handleApiError, isAuthenticated } from "../utils/apiUtils";
import NotAuthorization from "../components/NotAuthorization";
import { toast } from "react-toastify";

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

export default function Prontuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({});
  const [user, setUser] = useState(null)

  useEffect(() => {
      const checkAuth = () => {
        if (!isAuthenticated()) {
          toast.error("Sessão expirada. Faça login novamente.", {
            autoClose: 3000,
          });
          // Remove dados do localStorage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          // Redireciona para login após um delay
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
        
        // Se autenticado, carrega os dados do usuário
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
      };
  
      checkAuth();
    }, [navigate]);

    console.log(user);
    
  const loadPatients = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleApiError({ status: 401 }, navigate);
      return;
    }

    try {
      setLoading(true);
      const data = await getApi(`pacientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const atendimentoAtual = data?.atendimentos.find(
        (a) => a.status === "EM_ATENDIMENTO"
      );
      setPatient(data);
      setForm(atendimentoAtual)
    } catch (err) {
      console.error("Erro ao carregar painel:", err);
      handleApiError(err, navigate);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();

    // Event listeners
    window.addEventListener("patientsChanged", loadPatients);
    return () => window.removeEventListener("patientsChanged", loadPatients);
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updatePatient = async (id, changes = {}) => {
    try {
      setPatient({ ...patient, ...changes });

      if (changes.status === "CONCLUIDO") {
        // Criar encounter no backend
        await syncStatus(id, form);

        const pacienteAtualizado = await getApi(`pacientes/${patient.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Atualizar o paciente local com as informações completas do encounter
        setPatient({ ...pacienteAtualizado, ...changes });
      }
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      // Reverter mudança local em caso de erro
      setPatient({ ...patient, ...changes });
      alert("Erro ao iniciar atendimento. Tente novamente.");
    }
  };

  const askConfirmConclude = () => {
    if (!patient) return;

    if (!form.sintomas || !form.cid10) {
      alert("Preencha pelo menos os sintomas e o CID-10 antes de concluir.");
      return;
    }

    setConfirmOpen(true);
  };

  const confirmarConclusao = async () => {
    if (!patient) return;
    setLoading(true);

    try {
      // Atualizar o paciente no contexto COM A PROPRIEDADE CORRETA

      await updatePatient(patient.id, { status: "CONCLUIDO" });

      // Atualizar localStorage
      const stored = JSON.parse(localStorage.getItem("patients")) || [];
      const updated = stored.map((p) =>
        p.id === Number(id)
          ? { ...p, status: "CONCLUIDO", atendimentos: form }
          : p
      );
      localStorage.setItem("patients", JSON.stringify(updated));
      window.dispatchEvent(new Event("patientsChanged"));

      setForm([]);
      setConfirmOpen(false);

      // Navegar de volta
      navigate("/medico");
    } catch (err) {
      console.error("Erro ao concluir:", err);
      alert("Erro ao concluir atendimento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const syncStatus = async (id, atendimento) => {
    const token = localStorage.getItem("token");
    try {
      await updateApi(
        `atendimentos/finalizar/${atendimento.id}`,
        {
          pacienteId: id,
          ...atendimento,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.dispatchEvent(new Event("patientsChanged"));
    } catch (err) {
      console.error("Erro sincronizando status:", err);
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="p-6 text-center text-gray-600 bg-white rounded shadow">
            Paciente não encontrado.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {user && user.role === "MEDICO" ? (
        <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#2f6f3d]">
            Prontuário Médico
          </h2>
          <p className="text-gray-500">Atendimento e registro médico</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* Header do Paciente em Atendimento */}
          <div
            className="rounded-lg overflow-hidden mb-6"
            style={{ background: "linear-gradient(90deg,#4f8f55,#609e60)" }}
          >
            <div className="p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-md">
                    <FaUserMd />
                  </div>
                  <div>
                    <div className="text-sm uppercase text-white/90 font-semibold">
                      Paciente em Atendimento
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white/10 p-3 rounded text-xs">
                        <div className="text-xs text-white/80 uppercase">
                          Nome do Paciente
                        </div>
                        <div className="font-semibold">{patient.nome}</div>
                      </div>
                      <div className="bg-white/10 p-3 rounded text-xs">
                        <div className="text-xs text-white/80 uppercase">
                          Motivo da Consulta
                        </div>
                        <div className="font-semibold">
                          {patient.triage?.motivo || "—"}
                        </div>
                      </div>
                      <div className="bg-white/10 p-3 rounded text-xs">
                        <div className="text-xs text-white/80 uppercase">
                          Temperatura
                        </div>
                        <div className="font-semibold">
                          {patient.triage?.temperatura || "—"}
                        </div>
                      </div>
                      <div className="bg-white/10 p-3 rounded text-xs">
                        <div className="text-xs text-white/80 uppercase">
                          Pressão Arterial
                        </div>
                        <div className="font-semibold">
                          {patient.triage?.pressaoSanguinea ||
                            patient.triage?.pressao ||
                            "—"}
                        </div>
                      </div>
                      <div className="bg-white/10 p-3 rounded text-xs flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            renderPriority(patient.triage?.prioridade).color ===
                            "red"
                              ? "bg-red-500"
                              : renderPriority(patient.triage?.prioridade)
                                  .color === "yellow"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                        ></div>
                        <div>
                          <div className="text-xs text-white/80 uppercase">
                            Classificação de Risco
                          </div>
                          <div className="font-semibold">
                            {renderPriority(patient.triage?.prioridade).label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="bg-white/20 px-3 py-1 rounded text-white/90">
                    Status: EM ATENDIMENTO
                  </div>
                  <div className="text-white/90 text-xs mt-2 flex items-center gap-2">
                    <FaClock /> {timeSince(patient.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Atendimento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded border p-4">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaExclamationCircle className="text-[#2f6f3d]" /> Sinais e
                Sintomas
              </h4>
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
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaFileMedical className="text-[#2f6f3d]" /> Diagnóstico
              </h4>

              <label className="text-xs text-gray-500">Código CID-10</label>
              <input
                name="cid10"
                value={form.cid10 || ""}
                onChange={handleChange}
                placeholder="Ex: K52.9 - Gastroenterite"
                className="w-full border rounded p-2 mt-1 mb-3 text-sm"
              />

              <label className="text-xs text-gray-500">
                Tipo de Atendimento
              </label>
              <select
                name="tipoAtendimento"
                value={form.tipoAtendimento || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1 text-sm"
              >
                <option value="">Selecione o tipo</option>
                <option value="AMBULATORIAL">Ambulatorial</option>
                <option value="URGENCIA">Urgência</option>
                <option value="INTERNACAO">Internação</option>
              </select>
            </div>

            <div className="bg-white rounded border p-4">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaFileMedical className="text-[#2f6f3d]" /> Prescrição Médica
              </h4>
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
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaFileMedical className="text-[#2f6f3d]" /> Observações
              </h4>
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

          {/* Botão de Conclusão */}
          <div className="mb-6">
            <button
              onClick={askConfirmConclude}
              className="w-full bg-[#2f6f3d] hover:bg-[#285a30] text-white py-3 rounded font-semibold flex items-center justify-center gap-3"
            >
              <FaCheck /> CONCLUIR ATENDIMENTO
            </button>
          </div>
        </div>

        {/* Modal de Confirmação */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold mb-3">
                Confirmar Conclusão do Atendimento
              </h3>

              <div className="mb-4 text-sm text-gray-700">
                <p>
                  <strong>Paciente:</strong> {patient.nome}
                </p>
                <p>
                  <strong>Motivo:</strong> {patient.triage?.motivo || "—"}
                </p>
                <p>
                  <strong>Prioridade:</strong>{" "}
                  {renderPriority(patient.triage?.prioridade).label}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Ao confirmar, o atendimento será marcado como concluído e os
                  dados serão salvos.
                </p>
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
                  {loading ? (
                    "Confirmando..."
                  ) : (
                    <>
                      <FaCheck /> Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      ): (
        <NotAuthorization />
      )}
    </div>
  );
}
