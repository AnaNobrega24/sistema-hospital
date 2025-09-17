import React, { useState } from 'react';
import { FaFilter, FaUser, FaCalendar } from 'react-icons/fa';

export default function FiltroHistorico({ onFilter, onClear }) {
  const [nome, setNome] = useState('');
  const [dataDe, setDataDe] = useState('');
  const [dataAte, setDataAte] = useState('');

  const green = '#59995c';

  const handleApply = () => onFilter({ nome, dataDe, dataAte });
  const handleClear = () => {
    setNome('');
    setDataDe('');
    setDataAte('');
    onClear();
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${green}, #4a8049, #7cb342)` }}
      ></div>

      <h3 className="flex items-center mb-6 text-lg font-bold text-gray-700">
        <div
          className="w-6 h-6 flex items-center justify-center rounded mr-3 text-white"
          style={{ background: green }}
        >
          <FaFilter />
        </div>
        Filtros de Busca
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <label className="block mb-1 font-semibold text-gray-700 text-sm uppercase">
            Nome do Paciente
          </label>
          <input
            type="text"
            placeholder="Digite o nome do paciente..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#59995c] focus:ring-2 focus:ring-[#59995c]/20 outline-none transition"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <label className="block mb-1 font-semibold text-gray-700 text-sm uppercase">
            Data Inicial
          </label>
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#59995c] focus:ring-2 focus:ring-[#59995c]/20 outline-none transition"
            value={dataDe}
            onChange={(e) => setDataDe(e.target.value)}
          />
          <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <label className="block mb-1 font-semibold text-gray-700 text-sm uppercase">
            Data Final
          </label>
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#59995c] focus:ring-2 focus:ring-[#59995c]/20 outline-none transition"
            value={dataAte}
            onChange={(e) => setDataAte(e.target.value)}
          />
          <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg transition"
          style={{ background: `linear-gradient(135deg, ${green}, #4a8049)` }}
          onClick={handleApply}
        >
          <FaFilter /> Buscar
        </button>
        <button
          className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg transition bg-gray-600 hover:shadow-md"
          onClick={handleClear}
        >
          <FaFilter /> Limpar
        </button>
      </div>
    </div>
  );
}
