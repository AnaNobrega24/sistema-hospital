// src/pages/Triagem.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaHeartbeat,
  FaNotesMedical,
  FaUserMd,
  FaChevronDown,
} from "react-icons/fa";
import { getPriorityByReason } from "../utils/triagem";
import { getApi, postApi, updateApi } from "../services/apiServices";
import { useLocation, useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";
import { handleApiError } from "../utils/apiUtils";

export default function Triagem() {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingSend, setLoadingSend] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleApiError({ status: 401 }, navigate);
        return;
      }

      try {
        const data = await getApi("pacientes/triagem", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar pacientes para triagem:", err);
        handleApiError(err, navigate);
        setPatients([]);
      }
    };

    loadPatients();
    
    // Event listeners
    window.addEventListener("patientsChanged", loadPatients);
    return () => window.removeEventListener("patientsChanged", loadPatients);
  }, [location.pathname, navigate]);

  // contadores de prioridade (memorizados)
  const total = patients.length;
  const countAlta = useMemo(
    () => patients.filter((p) => p.prioridade === "ALTA").length,
    [patients]
  );
  const countMedia = useMemo(
    () => patients.filter((p) => p.prioridade === "MEDIA").length,
    [patients]
  );
  const countBaixa = useMemo(
    () => patients.filter((p) => p.prioridade === "BAIXA").length,
    [patients]
  );

  const handleFieldChange = (id, field, value) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const updatePatientRemote = async (id, changes) => {
    const token = localStorage.getItem("token");
    const updated = patients.map((p) =>
      p.id === id ? { ...p, ...changes } : p
    );
    setPatients(updated);

    const patientInfo = updated.find((p) => p.id === id);
    const pacienteTriado = {
      pacienteId: patientInfo.id,
      temperatura: patientInfo.temperatura,
      pressao: patientInfo.pressao,
      freqCardiaca: patientInfo.freqCardiaca,
      freqRespiratoria: patientInfo.freqRespiratoria,
      alergias: patientInfo.alergias,
      notas: patientInfo.notas,
      motivo: patientInfo.motivo,
      prioridade: patientInfo.prioridade,
      completedAt: new Date().toISOString(),
    };

    try {
      await updateApi(
        `pacientes/${id}/status`,
        { status: patientInfo.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await postApi("pacientes/triagem", pacienteTriado, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.dispatchEvent(new Event("patientsChanged"));
    } catch (err) {
      console.error("Erro ao atualizar paciente:", err);
      handleApiError(err, navigate);
    }
  };

  const handleEnviarParaMedico = async (id) => {
    const p = patients.find((x) => x.id === id);
    if (!p) return;

    if (!p.motivo || p.motivo.trim().length < 3) {
      alert("Preencha o motivo da consulta antes de enviar.");
      return;
    }
    if (!p.prioridade || p.prioridade === "") {
      alert("Selecione a classificação de risco antes de enviar.");
      return;
    }

    setLoadingSend(id);
    await updatePatientRemote(id, { ...p, status: "AGUARDANDO" });
    setLoadingSend(null);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#2f6f3d]">
            Triagem de Pacientes
          </h1>
          <p className="text-gray-500">
            Avaliação e classificação de risco dos pacientes
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[#2f6f3d]">{total}</div>
            <div className="text-xs text-gray-500 mt-1">Total de Pacientes</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[#b91c1c]">{countAlta}</div>
            <div className="text-xs text-gray-500 mt-1">Prioridade Alta</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[#b45309]">
              {countMedia}
            </div>
            <div className="text-xs text-gray-500 mt-1">Prioridade Média</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-[#15803d]">
              {countBaixa}
            </div>
            <div className="text-xs text-gray-500 mt-1">Prioridade Baixa</div>
          </div>
        </div>

        {/* Lista de pacientes */}
        <div className="space-y-6">
          {patients.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Nenhum paciente aguardando triagem.
            </div>
          )}

          {patients.map((p) => {
            const expanded = selectedId === p.id;
            return (
              <article
                key={p.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* header do card - mesmo código anterior */}
                <header
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedId(expanded ? null : p.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-10 w-10 bg-gradient-to-br from-[#59995c] to-[#7cb342] rounded-lg flex items-center justify-center text-white shadow">
                        <FaUserCircle />
                      </div>
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">
                          {p.nome}
                        </span>
                        <span className="text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full uppercase">
                          Cadastrado
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt />{" "}
                          {p.dataNascimento
                            ? new Date(p.dataNascimento).toLocaleDateString("pt-BR")
                            : "-"}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaIdCard /> {p.documento || "-"}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaPhone /> {p.telefone || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full 
                      ${
                        p.prioridade === "ALTA"
                          ? "bg-red-100 text-red-600"
                          : p.prioridade === "MEDIA"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {p.prioridade || "Sem Classificação"}
                    </span>
                    <button
                      aria-label={expanded ? "Fechar" : "Abrir"}
                      className="text-gray-400 hover:text-gray-600 transition-transform"
                    >
                      <FaChevronDown
                        className={`transform transition-transform ${
                          expanded ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  </div>
                </header>

                {/* Detalhes expandíveis - mesmo código anterior */}
                <div
                  className="px-6 pb-6 transition-all duration-300"
                  style={{
                    maxHeight: expanded ? 1500 : 0,
                    overflow: "hidden",
                  }}
                >
                  {expanded && (
                    <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Informações Pessoais */}
                      <div className="bg-gray-50 p-4 rounded border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaMapMarkerAlt /> INFORMAÇÕES PESSOAIS
                        </h4>
                        <div className="text-sm text-gray-700 p-3 bg-white rounded border">
                          {p.endereco || "—"}
                        </div>
                      </div>

                      {/* Sinais Vitais */}
                      <div className="bg-gray-50 p-4 rounded border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaThermometerHalf /> SINAIS VITAIS
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-600">
                              Temperatura (°C)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={p.temperatura || ""}
                              onChange={(e) =>
                                handleFieldChange(p.id, "temperatura", e.target.value)
                              }
                              className="mt-1 w-full border rounded px-2 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-600">
                              Pressão Arterial
                            </label>
                            <input
                              type="text"
                              placeholder="120/80"
                              value={p.pressao || ""}
                              onChange={(e) =>
                                handleFieldChange(p.id, "pressao", e.target.value)
                              }
                              className="mt-1 w-full border rounded px-2 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-600">
                              Freq. Cardíaca (bpm)
                            </label>
                            <input
                              type="number"
                              value={p.freqCardiaca || ""}
                              onChange={(e) =>
                                handleFieldChange(p.id, "freqCardiaca", e.target.value)
                              }
                              className="mt-1 w-full border rounded px-2 py-2 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-600">
                              Freq. Respiratória (rpm)
                            </label>
                            <input
                              type="number"
                              value={p.freqRespiratoria || ""}
                              onChange={(e) =>
                                handleFieldChange(p.id, "freqRespiratoria", e.target.value)
                              }
                              className="mt-1 w-full border rounded px-2 py-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Alergias */}
                      <div className="bg-gray-50 p-4 rounded border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaNotesMedical /> ALERGIAS
                        </h4>
                        <textarea
                          value={p.alergias || ""}
                          onChange={(e) =>
                            handleFieldChange(p.id, "alergias", e.target.value)
                          }
                          className="w-full border rounded p-2 h-28 text-sm"
                          placeholder="Descreva as alergias conhecidas..."
                        />
                      </div>

                      {/* Motivo da consulta */}
                      <div className="bg-gray-50 p-4 rounded border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaNotesMedical /> MOTIVO DA CONSULTA
                        </h4>
                        <textarea
                          value={p.motivo || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleFieldChange(p.id, "motivo", val);
                            handleFieldChange(p.id, "prioridade", getPriorityByReason(val));
                          }}
                          className="w-full border rounded p-2 h-28 text-sm"
                          placeholder="Descreva com as palavras do paciente..."
                        />
                      </div>

                      {/* Classificação */}
                      <div className="bg-gray-50 p-4 rounded border">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaHeartbeat /> CLASSIFICAÇÃO DE RISCO
                        </h4>
                        <select
                          value={p.prioridade || ""}
                          onChange={(e) =>
                            handleFieldChange(p.id, "prioridade", e.target.value)
                          }
                          className="w-full border rounded p-2 text-sm"
                        >
                          <option value="">Selecione a prioridade</option>
                          <option value="ALTA">🔴 Vermelho - Alta</option>
                          <option value="MEDIA">🟡 Amarelo - Média</option>
                          <option value="BAIXA">🟢 Verde - Baixa</option>
                        </select>
                      </div>

                      {/* Anotações */}
                      <div className="bg-gray-50 p-4 rounded border lg:col-span-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaNotesMedical /> ANOTAÇÕES DA ENFERMAGEM
                        </h4>
                        <textarea
                          value={p.notas || ""}
                          onChange={(e) =>
                            handleFieldChange(p.id, "notas", e.target.value)
                          }
                          className="w-full border rounded p-2 h-24 text-sm"
                          placeholder="Observações e anotações importantes..."
                        />
                      </div>

                      {/* Botão enviar */}
                      <div className="lg:col-span-3">
                        <button
                          onClick={() => handleEnviarParaMedico(p.id)}
                          disabled={loadingSend === p.id}
                          className="w-full inline-flex items-center justify-center gap-3 bg-[#2f6f3d] hover:bg-[#2b5f34] text-white py-3 rounded-md font-semibold transition"
                        >
                          <FaUserMd />
                          {loadingSend === p.id ? "Enviando..." : "ENVIAR PARA MÉDICO"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}