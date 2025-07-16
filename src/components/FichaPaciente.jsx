import React from 'react'

export default function FichaPaciente({ paciente }) {
  if (!paciente) return <div className="p-4">Paciente não encontrado.</div>

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Ficha do Paciente</h2>
      <div className="mb-2"><strong>Nome:</strong> {paciente.name}</div>
      <div className="mb-2"><strong>Data de Nascimento:</strong> {new Date(paciente.dob).toLocaleDateString('pt-BR')}</div>
      <div className="mb-2"><strong>Documento:</strong> {paciente.document}</div>
      <div className="mb-2"><strong>Telefone:</strong> {paciente.phone}</div>
      <div className="mb-2"><strong>Endereço:</strong> {paciente.address}</div>
      <div className="mb-2"><strong>Motivo da Visita:</strong> {paciente.reason || 'Motivo não informado'}</div>
      {paciente.temperature && <div className="mb-2"><strong>Temperatura:</strong> {paciente.temperature} °C</div>}
      {paciente.bloodPressure && <div className="mb-2"><strong>Pressão:</strong> {paciente.bloodPressure}</div>}
      {paciente.priority && <div className="mb-2"><strong>Prioridade:</strong> {pacient
