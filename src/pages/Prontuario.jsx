import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApi } from "../services/apiServices";

export default function Prontuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = async () => {
      const data = await getApi("pacientes/fila", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const p = data.find((p) => p.id === Number(id));

      setPaciente(p);
      setForm(p?.atendimento || {});
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const salvar = () => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    const updated = stored.map((p) =>
      p.id === Number(id) ? { ...p, status: "CONCLUIDO", atendimento: form } : p
    );
    localStorage.setItem("patients", JSON.stringify(updated));
    window.dispatchEvent(new Event("patientsChanged"));
    navigate("/medico");
  };

  if (!paciente) {
    return (
      <div className="p-6 text-center text-gray-600">
        Paciente não encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Prontuário Médico</h2>

      {/* Informações separadas */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Pessoais */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-[#27ae60] mb-3">
            👤 Informações Pessoais
          </h3>
          <p>
            <strong>Nome:</strong> {paciente.nome}
          </p>
          <p>
            <strong>Data de Nascimento:</strong>{" "}
            {new Date(paciente.dataNascimento).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <strong>Documento:</strong> {paciente.documento}
          </p>
          <p>
            <strong>Telefone:</strong> {paciente.telefone}
          </p>
          <p>
            <strong>Endereço:</strong> {paciente.endereco}
          </p>
        </div>

        {/* Médicas */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-[#27ae60] mb-3">
            🩺 Informações Clínicas
          </h3>
          <p>
            <strong>Temperatura:</strong> {paciente.triage.temperatura} °C
          </p>
          <p>
            <strong>Pressão:</strong> {paciente.triage.pressao}
          </p>
          <p>
            <strong>Frequência Cardíaca:</strong> {paciente.triage.freqCardiaca}
          </p>
          <p>
            <strong>Frequência Respiratória:</strong>{" "}
            {paciente.triage.freqRespiratoria}
          </p>
          <p>
            <strong>Alergias:</strong> {paciente.triage.alergias}
          </p>
          <p>
            <strong>Motivo da Visita:</strong> {paciente.triage.motivo}
          </p>
          <p>
            <strong>Notas da Enfermagem:</strong> {paciente.triage.notas}
          </p>
        </div>
      </section>

      {/* Formulário de atendimento */}
      <form className="space-y-4">
        <div>
          <label className="font-semibold">Anamnese</label>
          <textarea
            name="anamnese"
            value={form.anamnese || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Exames e Resultados</label>
          <textarea
            name="exames"
            value={form.exames || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Procedimentos Médicos</label>
          <textarea
            name="procedimentos"
            value={form.procedimentos || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Prescrição Médica</label>
          <textarea
            name="prescricao"
            value={form.prescricao || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Evolução Médica</label>
          <textarea
            name="evolucao"
            value={form.evolucao || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">
            Hipóteses Diagnósticas e Diagnóstico
          </label>
          <textarea
            name="diagnostico"
            value={form.diagnostico || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Plano Terapêutico</label>
          <textarea
            name="plano"
            value={form.plano || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">
            Consentimento / Atestado / Encaminhamento
          </label>
          <textarea
            name="documentos"
            value={form.documentos || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="button"
          onClick={salvar}
          className="w-full bg-[#27ae60] text-white py-3 rounded hover:bg-green-700"
        >
          Finalizar Atendimento
        </button>
      </form>
    </div>
  );
}
