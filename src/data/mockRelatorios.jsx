// src/data/mockRelatorios.js

// Este é um objeto com as estatísticas, exatamente como a API vai retornar.
export const mockRelatoriosData = {
  // Quantidade de pacientes atendidos por cada médico
  pacientesPorMedico: [
    { medicoId: 201, nomeMedico: "Dra. Helena Souza", total: 2 },
    { medicoId: 202, nomeMedico: "Dr. Ricardo Lima", total: 1 },
  ],

  // Tempo médio de espera em minutos
  tempoMedioEsperaMin: 25,

  // Quantidade de pacientes por cada nível de prioridade
  pacientesPorPrioridade: [
    { prioridade: "ALTA", total: 5 },
    { prioridade: "MEDIA", total: 12 },
    { prioridade: "BAIXA", total: 8 },
  ],
};