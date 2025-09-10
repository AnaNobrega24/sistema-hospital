// src/data/mockHistorico.js

// Este é um array de atendimentos, exatamente como a API vai retornar.
export const mockHistoricoData = [
  {
    id: 1,
    horaInicio: "2025-09-08T14:00:00.000Z",
    horaFim: "2025-09-08T14:25:00.000Z",
    status: "CONCLUIDO",
    diagnostico: "Virose comum",
    prescricao: "Repouso e hidratação.",
    paciente: {
      id: 101,
      nome: "Carlos Pereira",
      motivo: "Febre e mal-estar",
    },
    medico: {
      id: 201,
      nome: "Dra. Helena Souza",
    }
  },
  {
    id: 2,
    horaInicio: "2025-09-07T10:10:00.000Z",
    horaFim: "2025-09-07T10:50:00.000Z",
    status: "CONCLUIDO",
    diagnostico: "Entorse no tornozelo",
    prescricao: "Gelo, anti-inflamatório e evitar esforço.",
    paciente: {
      id: 102,
      nome: "Mariana Costa",
      motivo: "Queda durante atividade física",
    },
    medico: {
      id: 202,
      nome: "Dr. Ricardo Lima",
    }
  },
  {
    id: 3,
    horaInicio: "2025-09-06T18:30:00.000Z",
    horaFim: "2025-09-06T18:45:00.000Z",
    status: "CONCLUIDO",
    diagnostico: "Reação alérgica leve",
    prescricao: "Antialérgico por 3 dias.",
    paciente: {
      id: 103,
      nome: "João Martins",
      motivo: "Manchas vermelhas na pele",
    },
    medico: {
      id: 201,
      nome: "Dra. Helena Souza",
    }
  }
];