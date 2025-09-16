import React from "react";
import {
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLink,
  FaShieldAlt,
  FaFileContract,
  FaHeadset,
  FaQuestionCircle,
  FaCode,
  FaUserCircle,
  FaHeart,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const developers = [
    { name: "Ana Nóbrega", role: "Frontend Developer" },
    { name: "Mickael Maciel", role: "Full Stack Developer" },
    { name: "Gabriel das Chagas Albuquerque", role: "Full Stack Developer" },
  ];

  const usefulLinks = [
    { name: "Política de Privacidade", icon: <FaShieldAlt /> },
    { name: "Termos de Uso", icon: <FaFileContract /> },
    { name: "Suporte Técnico", icon: <FaHeadset /> },
    { name: "FAQ", icon: <FaQuestionCircle /> },
    { name: "Contato", icon: <FaEnvelope /> },
  ];

  return (
    <footer className="relative text-white">
      {/* Gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#59995c] via-[#4a8049] to-[#5ea361] animate-[shimmer_3s_infinite] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hospital Info */}
        <div className="backdrop-blur-md bg-white/10 rounded-lg p-6 shadow-lg space-y-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#59995c] to-[#7cb342] rounded-lg flex items-center justify-center shadow-lg">
              <FaHospital className="text-white text-xl" />
            </div>
            <div>
              <div className="font-bold text-lg">Hospital AlphaMed</div>
              <div className="text-xs text-white/70">
                Sistema de Gestão Hospitalar
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-gradient-to-br from-[#59995c] to-[#7cb342] w-8 h-8 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt />
              </div>
              <div>
                <div className="font-semibold">Localização</div>
                <div className="text-sm text-white/80">
                  Av. Saúde, 123
                  <br />
                  Fortaleza, CE
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-gradient-to-br from-[#59995c] to-[#7cb342] w-8 h-8 rounded-lg flex items-center justify-center">
                <FaPhone />
              </div>
              <div>
                <div className="font-semibold">Telefone</div>
                <div className="text-sm text-white/80">(85) 99999-9999</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-gradient-to-br from-[#59995c] to-[#7cb342] w-8 h-8 rounded-lg flex items-center justify-center">
                <FaEnvelope />
              </div>
              <div>
                <div className="font-semibold">E-mail</div>
                <div className="text-sm text-white/80">
                  contato@alphamed.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="backdrop-blur-md bg-white/10 rounded-lg p-6 shadow-lg space-y-4">
          <h4 className="flex items-center text-lg font-bold mb-4">
            <div className="mr-3 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#59995c] to-[#7cb342] rounded-lg">
              <FaLink />
            </div>
            Links Úteis
          </h4>
          <div className="space-y-2">
            {usefulLinks.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div>{link.icon}</div>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Desenvolvedores */}
        <div className="backdrop-blur-md bg-white/10 rounded-lg p-6 shadow-lg space-y-4">
          <h4 className="flex items-center text-lg font-bold mb-4">
            <div className="mr-3 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#59995c] to-[#7cb342] rounded-lg">
              <FaCode />
            </div>
            Desenvolvedores
          </h4>
          <div className="space-y-3">
            {developers.map((dev, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <FaUserCircle className="text-xl" />
                <div>
                  <div className="font-semibold">{dev.name}</div>
                  <div className="text-xs text-white/70">{dev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 backdrop-blur-md bg-white/10 border-t border-white/20 py-4 mt-8 text-center text-white/80">
        &copy; {currentYear} Hospital AlphaMed. Todos os direitos reservados.
        Feito com <FaHeart className="inline text-red-400 mx-1" /> e dedicação
      </div>
    </footer>
  );
}
