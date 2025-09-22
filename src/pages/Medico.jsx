import {
  FaUserMd,
  FaClock,
  FaExclamationCircle,
  FaFileMedical,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { postApi } from "../services/apiServices";
import { useAtendimento } from "../context/AtendimentoContext";

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
  const user = useAtendimento();
  const patients = user.patients;

  const syncStatus = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const encounter = await postApi(
        "atendimentos/iniciar",
        { pacienteId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return encounter;
    } catch (err) {
      console.error("Erro sincronizando status:", err);
    }
  };

  const updatePatient = async (id, changes = {}) => {
    try {
      // Atualizar o estado local imediatamente para responsividade
      user.setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
      );

      if (changes.status === "EM_ATENDIMENTO") {
        // Criar encounter no backend
        const encounter = await syncStatus(id);

        // Atualizar o paciente local com as informações completas do encounter
        user.setPatients((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: "EM_ATENDIMENTO",
                  atendimentos: [
                    {
                      id: encounter.id,
                      horaInicio: encounter.horaInicio,
                      status: encounter.status,
                      medicoId: encounter.medicoId,
                      // Campos clínicos inicialmente vazios
                      sintomas: encounter.sintomas || "",
                      cid10: encounter.cid10 || "",
                      tipoAtendimento: encounter.tipoAtendimento || null,
                      prescricao: encounter.prescricao || "",
                      observacoes: encounter.observacoes || "",
                      anamnese: encounter.anamnese || "",
                      exames: encounter.exames || "",
                      procedimentos: encounter.procedimentos || "",
                      diagnostico: encounter.diagnostico || "",
                      plano: encounter.plano || "",
                      documentos: encounter.documentos || "",
                    },
                  ],
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      // Reverter mudança local em caso de erro
      user.setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "AGUARDANDO" } : p))
      );
      alert("Erro ao iniciar atendimento. Tente novamente.");
    }
  };

  const callNext = async () => {
    const orderPatients = patients.sort((a, b) => {
      const order = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
      const pa = (a.triage && a.triage.prioridade) || "";
      const pb = (b.triage && b.triage.prioridade) || "";
      return (order[pb] || 0) - (order[pa] || 0);
    });
    const next = orderPatients.find((p) => p.status === "AGUARDANDO");

    if (next) {
      await updatePatient(next.id, { status: "EM_ATENDIMENTO" });
      localStorage.setItem("horaInicio", Date.now());
    }
  };

  // Filtrar pacientes por status
  const fila = patients
    .filter((p) => p.status === "AGUARDANDO")
    .sort((a, b) => {
      const order = { ALTA: 3, MEDIA: 2, BAIXA: 1 };
      const pa = (a.triage && a.triage.prioridade) || "";
      const pb = (b.triage && b.triage.prioridade) || "";
      return (order[pb] || 0) - (order[pa] || 0);
    });

  const emAtendimento = patients.filter((p) => p.status === "EM_ATENDIMENTO");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#2f6f3d]">
            Atendimento Médico
          </h2>
          <p className="text-gray-500">
            Consultas e acompanhamento de pacientes
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* Botão Chamar Próximo */}
          <div className="text-center py-8">
            {fila.length > 0 ? (
              <button
                onClick={callNext}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2f6f3d] text-white rounded hover:bg-[#285a30]"
              >
                <FaUserMd /> Chamar Próximo
              </button>
            ) : (
              <div className="text-gray-500">
                Nenhum paciente aguardando na fila.
              </div>
            )}
          </div>

          {/* Pacientes em Atendimento */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
              <FaUserMd className="text-[#2f6f3d]" /> Pacientes em Atendimento{" "}
              <span className="ml-2 text-sm text-gray-500">
                ({emAtendimento.length})
              </span>
            </h3>

            {emAtendimento.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
                <div className="text-lg font-medium mb-2">
                  Nenhum paciente em atendimento
                </div>
                <div>Aguardando início de nova consulta médica</div>
              </div>
            ) : (
              <ul className="space-y-4">
                {emAtendimento.map((p) => {
                  const priority = renderPriority(p.triage?.prioridade);
                  return (
                    <li
                      key={p.id}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {p.nome}
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                EM ATENDIMENTO
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {p.triage?.motivo || "Motivo não informado"}
                            </div>
                          </div>
                          <div
                            className={`ml-4 w-3 h-3 rounded-full ${
                              priority.color === "red"
                                ? "bg-red-500"
                                : priority.color === "yellow"
                                ? "bg-yellow-400"
                                : "bg-green-400"
                            }`}
                          />
                        </div>

                        <div className="mt-2 text-sm text-gray-500 flex items-center gap-3">
                          <FaClock /> Em atendimento há{" "}
                          <span className="font-semibold">
                            {timeSince(p.updatedAt || p.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <Link
                          to={`/prontuario/${p.id}`}
                          className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                        >
                          Abrir Prontuário
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Fila de Espera */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
              <FaFileMedical className="text-[#2f6f3d]" /> Fila de Espera{" "}
              <span className="ml-2 text-sm text-gray-500">
                ({fila.length})
              </span>
            </h3>

            <ul className="space-y-4">
              {fila.map((p) => {
                const priority = renderPriority(p.triage?.prioridade);
                return (
                  <li
                    key={p.id}
                    className="bg-white rounded border p-4 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold">{p.nome}</div>
                          <div className="text-sm text-gray-600">
                            {p.triage?.motivo || "Motivo não informado"}
                          </div>
                        </div>
                        <div
                          className={`ml-4 w-3 h-3 rounded-full ${
                            priority.color === "red"
                              ? "bg-red-500"
                              : priority.color === "yellow"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                        />
                      </div>

                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-3">
                        <FaClock /> Aguardando há{" "}
                        <span className="font-semibold">
                          {timeSince(p.createdAt)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
              {fila.length === 0 && (
                <li className="text-center text-gray-500 py-6">Fila vazia</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
