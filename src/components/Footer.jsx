import React from 'react'
import { HiBuildingOffice } from 'react-icons/hi2'

export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo e informações */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-semibold">Hospital AlphaMed</h4>
          </div>
          <p className="text-sm text-white/80">
            Av. Saúde, 123<br/>Fortaleza, CE
          </p>
          <p className="text-sm text-white/80">Telefone: (85) 99999-9999</p>
        </div>

        {/* Links úteis */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold border-l-4 border-[#27ae60] pl-2 uppercase">
            Links Úteis
          </h4>
          <ul className="space-y-1">
            <li><a href="#" className="text-sm hover:text-[#27ae60]">Política de Privacidade</a></li>
            <li><a href="#" className="text-sm hover:text-[#27ae60]">Termos de Uso</a></li>
            <li><a href="#" className="text-sm hover:text-[#27ae60]">Contato</a></li>
          </ul>
        </div>

        {/* Desenvolvedores */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold border-l-4 border-[#27ae60] pl-2 uppercase">
            Desenvolvedores
          </h4>
          <ul className="space-y-1 text-sm text-white/80">
            <li>Ana Nóbrega</li>
            <li>Lorena Rodrigues</li>
            <li>Maurício Gonçalves</li>
            <li>Vladimir Lima</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#1e2a35]">
        <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-white/60">
          &copy; {new Date().getFullYear()} Hospital AlphaMed. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
