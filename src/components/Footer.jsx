import React from 'react'
import { HiBuildingOffice } from 'react-icons/hi2'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <HiBuildingOffice className="text-hospital-blue text-2xl" />
            <h4 className="text-lg font-semibold text-gray-900">Hospital XYZ</h4>
          </div>
          <p className="text-sm text-gray-600">
            Av. Saúde, 123<br/>Fortaleza, CE
          </p>
          <p className="text-sm text-gray-600">Telefone: (85) 99999-9999</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 border-l-4 border-hospital-blue pl-2 uppercase">
            Links Úteis
          </h4>
          <ul className="space-y-1">
            <li><a href="#" className="text-sm text-hospital-blue hover:underline">Política de Privacidade</a></li>
            <li><a href="#" className="text-sm text-hospital-blue hover:underline">Termos de Uso</a></li>
            <li><a href="#" className="text-sm text-hospital-blue hover:underline">Contato</a></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 border-l-4 border-hospital-blue pl-2 uppercase">
            Desenvolvedores
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Ana Nóbrega</li>
            <li>Lorena Rodrigues</li>
            <li>Maurício Gonçalves</li>
            <li>Vladimir Lima</li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-50">
        <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Hospital XYZ. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}