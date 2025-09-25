// src/pages/Painel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaClock, FaUserMd, FaListOl } from "react-icons/fa";
import { getApi } from "../services/apiServices";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/apiUtils";
import NotAuthorization from "../components/NotAuthorization";

function renderPriorityLabel(priority) {
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
}

function minutesSince(date) {
  if (!date) return "--";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatTime(date) {
  if (!date) return "--:--";
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// retorna a triagem mais recente do paciente (array ou objeto)
const getLatestTriage = (patient) => {
  if (!patient) return null;
  const t = patient.triage;
  if (!t) return null;
  if (Array.isArray(t)) {
    if (t.length === 0) return null;
    return t.reduce((latest, curr) => {
      const latestDate = new Date(latest.createdAt || latest.completedAt || latest.updatedAt || 0).getTime();
      const currDate = new Date(curr.createdAt || curr.completedAt || curr.updatedAt || 0).getTime();
      return currDate >= latestDate ? curr : latest;
    });
  }
  return t;
};

// retorna o atendimento atual (se houver) a partir do array atendimentos ou objeto
const getCurrentEncounter = (patient) => {
  if (!patient) return null;
  const a = patient.atendimentos;
  if (!a) return null;
  if (Array.isArray(a)) {
    if (a.length === 0) return null;
    // Preferir atendimento com status EM_ATENDIMENTO
    const inProgress = a.find((enc) => enc.status === "EM_ATENDIMENTO" || enc.status === "IN_PROGRESS");
    if (inProgress) return inProgress;
    // fallback: atendimento sem horaFim (aberto)
    const open = a.find((enc) => !enc.horaFim && (enc.horaInicio || enc.createdAt));
    if (open) return open;
    // fallback: último atendimento por horaInicio / createdAt
    return a.reduce((latest, curr) => {
      const latestDate = new Date(latest.horaInicio || latest.createdAt || 0).getTime();
      const currDate = new Date(curr.horaInicio || curr.createdAt || 0).getTime();
      return currDate >= latestDate ? curr : latest;
    });
  }
  // se for objeto único
  return a;
};

export default function Painel() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0); // trigger re-render for timers
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))

  // Função para carregar pacientes
  const loadPatients = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleApiError({ status: 401 }, navigate);
      return;
    }

    try {
      setLoading(true);
      const data = await getApi("pacientes/fila", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar painel:", err);
      handleApiError(err, navigate);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregamento inicial
  useEffect(() => {
    loadPatients();

    // Event listeners
    window.addEventListener("patientsChanged", loadPatients);
    return () => window.removeEventListener("patientsChanged", loadPatients);
  }, []);

  // tick every 30s to update elapsed times
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // derived stats
  const queue = useMemo(
    () =>
      (patients || [])
        .filter((p) => p.status === "AGUARDANDO")
        .sort((a, b) => {
          const order = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
          const pa = getLatestTriage(a)?.prioridade || "";
          const pb = getLatestTriage(b)?.prioridade || "";
          const diff = (order[pb] || 0) - (order[pa] || 0);
          if (diff !== 0) return diff;
          return new Date(a.createdAt) - new Date(b.createdAt);
        }),
    [patients]
  );

  const current = useMemo(
    () => patients.find((p) => p.status === "EM_ATENDIMENTO"),
    [patients]
  );

  const stats = useMemo(() => {
    const total = (patients || []).length;
    const waiting = queue.length;
    const alta = (queue || []).filter((p) => getLatestTriage(p)?.prioridade === "ALTA").length;
    const media = (queue || []).filter((p) => getLatestTriage(p)?.prioridade === "MEDIA").length;
    const baixa = (queue || []).filter((p) => getLatestTriage(p)?.prioridade === "BAIXA").length;

    // average wait (minutes)
    const avgMinutes =
      queue.length > 0
        ? Math.round(
            queue.reduce((acc, p) => acc + (Date.now() - new Date(getLatestTriage(p)?.createdAt || p.dataCadastro || p.createdAt)) / 60000, 0) / queue.length
          )
        : 0;

    return { total, waiting, alta, media, baixa, avgMinutes };
  }, [patients, queue, tick]);

  // obter atendimento atual detalhado (do paciente atual) — null se não existir
  const currentEncounter = useMemo(() => getCurrentEncounter(current), [current]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {user ? (
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#2f6f3d]">Painel de Atendimento</h1>
          <p className="text-gray-500">Monitoramento em tempo real do atendimento hospitalar</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-6 ">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#2f6f3d]">{stats.waiting}</div>
              <div className="text-xs text-gray-500 mt-1">Total na Fila</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#b91c1c]">{stats.alta}</div>
              <div className="text-xs text-gray-500 mt-1">Prioridade Alta</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#b45309]">{stats.media}</div>
              <div className="text-xs text-gray-500 mt-1">Prioridade Média</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#15803d]">{stats.baixa}</div>
              <div className="text-xs text-gray-500 mt-1">Prioridade Baixa</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{stats.avgMinutes > 0 ? `${stats.avgMinutes}m` : "--"}</div>
              <div className="text-xs text-gray-500 mt-1">Tempo Médio</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#2f6f3d]">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">Total (hoje)</div>
            </div>
          </div>

          {/* Current patient */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaListOl className="text-[#59995c]" /> Atendimento Atual
              </h2>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${loading ? "bg-red-400 animate-pulse" : "bg-green-400"}`} />
                  {loading ? "Atualizando..." : "Ao vivo"}
                </div>
                <button
                  onClick={loadPatients}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  title="Atualizar agora"
                >
                  <FaClock className="transform rotate-0" />
                </button>
              </div>
            </div>

            {current ? (
              <div className="rounded-lg overflow-hidden" style={{ background: "linear-gradient(90deg,#4f8f55,#609e60)" }}>
                <div className="p-4 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase opacity-90 font-semibold">Paciente em Atendimento</div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">Nome</div>
                          <div className="font-semibold">{current.nome}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">Classificação</div>
                          <div className="font-semibold">{renderPriorityLabel(getLatestTriage(current)?.prioridade)}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">Início</div>
                          <div className="font-semibold">{formatTime(currentEncounter?.horaInicio || currentEncounter?.horaInicioISO || current?.atendimentos?.horaInicio)}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">Tempo Decorrido</div>
                          <div className="font-semibold">{minutesSince(currentEncounter?.horaInicio || currentEncounter?.horaInicioISO || current?.atendimentos?.horaInicio)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="bg-white/20 px-3 py-1 rounded text-white/90">Status: EM ATENDIMENTO</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
                <div className="text-lg font-medium mb-2">Nenhum paciente em atendimento</div>
                <div>Aguardando início de nova consulta médica</div>
              </div>
            )}
          </div>

          {/* Queue */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaListOl className="text-[#59995c]" /> Fila de Espera
                <span className="ml-2 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {queue.length} AGUARDANDO
                </span>
              </h3>

              <div className="text-sm text-gray-500">
                Atualizado: {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            {queue.length === 0 ? (
              <div className="empty-state p-8 text-center text-gray-500 rounded-lg">{loading ? "Carregando..." : "Fila de espera vazia"}</div>
            ) : (
              <ul className="space-y-4">
                {queue.map((p, idx) => {
                  const latestTriage = getLatestTriage(p);
                  const priorityClass =
                    latestTriage?.prioridade === "ALTA"
                      ? "priority-alta"
                      : latestTriage?.prioridade === "MEDIA"
                      ? "priority-media"
                      : "priority-baixa";
                  return (
                    <li key={p.id} className={`queue-item ${priorityClass} p-4 rounded-lg flex justify-between items-center bg-white border`}>
                      <div className="flex items-center gap-4">
                        <div className="queue-position w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">{idx + 1}</div>
                        <div>
                          <div className="font-semibold">{p.nome}</div>
                          <div className="text-sm text-gray-600">{renderPriorityLabel(latestTriage?.prioridade)}</div>
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-500">
                        <div>Aguardando há</div>
                        <div className="font-semibold">{minutesSince(latestTriage?.createdAt || latestTriage?.completedAt || p.createdAt)}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatTime(latestTriage?.createdAt || latestTriage?.completedAt || p.createdAt)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      ): (
        <NotAuthorization />
      )}
    </div>
  );
}
