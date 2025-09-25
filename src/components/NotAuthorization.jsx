import { Link } from "react-router-dom";
import { FaUserMd, FaExclamationTriangle, FaSignInAlt } from 'react-icons/fa';

const NotAuthorization = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg relative">
        {/* Header com ícone igual ao login */}
        <div className="hospital-logo text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2f6f3d] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserMd className="text-3xl" />
          </div>
          <div className="hospital-name text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#59995c] to-[#4a8049]">
            Hospital AlphaMed
          </div>
          <div className="hospital-subtitle text-gray-500">Sistema de Gestão Hospitalar</div>
        </div>

        {/* Conteúdo de não autorização */}
        <div className="text-center space-y-6">
          {/* Ícone de aviso */}
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
            <FaExclamationTriangle className="text-4xl" />
          </div>

          {/* Mensagem principal */}
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Acesso Não Autorizado
            </h1>
            <p className="text-gray-600 text-sm">
              Você precisa fazer login para acessar esta página
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorization;