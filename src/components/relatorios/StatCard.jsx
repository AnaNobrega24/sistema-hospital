// src/components/relatorios/StatCard.jsx
import React from 'react';

// Um card simples para mostrar um número em destaque.
export default function StatCard({ titulo, valor, unidade }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-gray-500 text-sm font-medium uppercase">{titulo}</h3>
      <p className="text-3xl font-bold text-[#2c3e50] mt-2">
        {valor} <span className="text-lg font-normal">{unidade}</span>
      </p>
    </div>
  );
}