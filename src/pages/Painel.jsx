import React, { useEffect, useMemo, useState } from "react";
import { FaClock, FaUserMd, FaListOl } from "react-icons/fa";
import { useAtendimento } from "../context/AtendimentoContext";

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

export default function Painel() {
  const { patients, loadPatients, loading } = useAtendimento();
  const [tick, setTick] = useState(0); // trigger re-render for timers

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
          const pa = (a.triage && a.triage.prioridade) || "";
          const pb = (b.triage && b.triage.prioridade) || "";
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
    const alta = (queue || []).filter(
      (p) => p.triage?.prioridade === "ALTA"
    ).length;
    const media = (queue || []).filter(
      (p) => p.triage?.prioridade === "MEDIA"
    ).length;
    const baixa = (queue || []).filter(
      (p) => p.triage?.prioridade === "BAIXA"
    ).length;

    // average wait (minutes)
    const avgMinutes =
      queue.length > 0
        ? Math.round(
            queue.reduce(
              (acc, p) =>
                acc +
                (Date.now() - new Date(p.dataCadastro || p.createdAt)) / 60000,
              0
            ) / queue.length
          )
        : 0;

    return { total, waiting, alta, media, baixa, avgMinutes };
  }, [patients, queue, tick]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#2f6f3d]">
            Painel de Atendimento
          </h1>
          <p className="text-gray-500">
            Monitoramento em tempo real do atendimento hospitalar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-6 ">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#2f6f3d]">
                {stats.waiting}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total na Fila</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#b91c1c]">
                {stats.alta}
              </div>
              <div className="text-xs text-gray-500 mt-1">Prioridade Alta</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#b45309]">
                {stats.media}
              </div>
              <div className="text-xs text-gray-500 mt-1">Prioridade Média</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#15803d]">
                {stats.baixa}
              </div>
              <div className="text-xs text-gray-500 mt-1">Prioridade Baixa</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">
                {stats.avgMinutes > 0 ? `${stats.avgMinutes}m` : "--"}
              </div>
              <div className="text-xs text-gray-500 mt-1">Tempo Médio</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#2f6f3d]">
                {stats.total}
              </div>
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
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      loading ? "bg-red-400 animate-pulse" : "bg-green-400"
                    }`}
                  />
                  {loading ? "Atualizando..." : "Ao vivo"}
                </div>
                <button
                  onClick={loadPatients}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  title="Atualizar agora"
                >
                  <FaClock className="transform rotate-0" />
                </button>
              </div>
            </div>

            {current ? (
              <div
                className="rounded-lg overflow-hidden"
                style={{ background: "linear-gradient(90deg,#4f8f55,#609e60)" }}
              >
                <div className="p-4 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase opacity-90 font-semibold">
                        Paciente em Atendimento
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">
                            Nome
                          </div>
                          <div className="font-semibold">{current.nome}</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">
                            Classificação
                          </div>
                          <div className="font-semibold">
                            {renderPriorityLabel(current.triage?.prioridade)}
                          </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">
                            Início
                          </div>
                          <div className="font-semibold">
                            {formatTime(current?.atendimentos.horaInicio)}
                          </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded text-xs">
                          <div className="text-white/80 text-xxs uppercase">
                            Tempo Decorrido
                          </div>
                          <div className="font-semibold">
                            {minutesSince(current?.atendimentos.horaInicio)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="bg-white/20 px-3 py-1 rounded text-white/90">
                        Status: EM ATENDIMENTO
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
                <div className="text-lg font-medium mb-2">
                  Nenhum paciente em atendimento
                </div>
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
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
                  {queue.length} AGUARDANDO
                </span>
              </h3>

              <div className="text-sm text-gray-500">
                Atualizado:{" "}
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {queue.length === 0 ? (
              <div className="empty-state p-8 text-center text-gray-500 rounded-lg">
                Fila de espera vazia
              </div>
            ) : (
              <ul className="space-y-4">
                {queue.map((p, idx) => {
                  const priorityClass =
                    p.triage?.prioridade === "ALTA"
                      ? "priority-alta"
                      : p.triage?.prioridade === "MEDIA"
                      ? "priority-media"
                      : "priority-baixa";
                  return (
                    <li
                      key={p.id}
                      className={`queue-item ${priorityClass} p-4 rounded-lg flex justify-between items-center bg-white`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="queue-position">{idx + 1}</div>
                        <div>
                          <div className="font-semibold">{p.nome}</div>
                          <div className="text-sm text-gray-600">
                            {renderPriorityLabel(p.triage?.prioridade)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-500">
                        <div>Aguardando há</div>
                        <div className="font-semibold">
                          {minutesSince(p.triage.completedAt)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatTime(p.triage.completedAt)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


