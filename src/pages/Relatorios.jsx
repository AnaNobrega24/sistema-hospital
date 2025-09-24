import React, { useEffect, useState } from "react";
import { FaStethoscope, FaUserInjured, FaUserMd, FaChartLine } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Spinner from "../components/Spinner";
import StatCard from "../components/relatorios/StatCard";
import { Filler } from "chart.js";

// Registrar módulos do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Simula fetch de dados
  useEffect(() => {
    const timeout = setTimeout(() => {
      setData({
        estatisticas: {
          atendimentos: 1240,
          pacientes: 890,
          medicos: 32,
          mediaAtendimentos: 42,
        },
        graficoAtendimentos: {
          labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ],
          dados: [120, 150, 180, 200, 170, 190, 220, 210, 230, 250, 270, 300],
        },
        graficoPacientes: {
          labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
          dados: [50, 70, 65, 80, 90, 40, 30],
        },
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Aqui poderia chamar API real
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-[#59995c] text-white rounded-lg shadow-md hover:bg-[#4a8049] transition"
        >
          <i className="fas fa-sync-alt mr-2"></i> Atualizar
        </button>
      </div>

     {/* Estatísticas */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  <StatCard
    title="Atendimentos"
    value={data.estatisticas.atendimentos}
    Icon={FaStethoscope} // ícone do estetoscópio
    color="#3b82f6" // azul
  />
  <StatCard
    title="Pacientes"
    value={data.estatisticas.pacientes}
    Icon={FaUserInjured} // ícone de paciente
    color="#10b981" // verde
  />
  <StatCard
    title="Médicos"
    value={data.estatisticas.medicos}
    Icon={FaUserMd} // ícone de médico
    color="#8b5cf6" // roxo
  />
  <StatCard
    title="Média Diária"
    value={data.estatisticas.mediaAtendimentos}
    Icon={FaChartLine} // ícone de gráfico
    color="#f97316" // laranja
  />
</div>


      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por mês */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Atendimentos por Mês</h2>
          <Bar
            data={{
              labels: data.graficoAtendimentos.labels,
              datasets: [
                {
                  label: "Atendimentos",
                  data: data.graficoAtendimentos.dados,
                  backgroundColor: "rgba(89, 153, 92, 0.7)",
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>

        {/* Pacientes por semana */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pacientes por Semana</h2>
          <Line
            data={{
              labels: data.graficoPacientes.labels,
              datasets: [
                {
                  label: "Pacientes",
                  data: data.graficoPacientes.dados,
                  borderColor: "#59995c",
                  backgroundColor: "rgba(89, 153, 92, 0.3)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
