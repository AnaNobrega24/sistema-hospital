import { FaUserMd, FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg relative">
        <div className="hospital-logo text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2f6f3d] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserMd className="text-3xl" />
          </div>
          <div className="hospital-name text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#59995c] to-[#4a8049]">
            Hospital AlphaMed
          </div>
          <div className="hospital-subtitle text-gray-500">Sistema de Gestão Hospitalar</div>
        </div>

        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-800 flex items-center justify-center mx-auto">
            <FaSearch className="text-4xl" />
          </div>

          {/* Mensagem principal */}
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Página Não encontrada
            </h1>
            
            <Link to={"/"}>
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#59995c] to-[#4a8049] text-white py-3 rounded-lg font-semibold hover:opacity-95 transition relative cursor-pointer">
                  Clique aqui para ir à página de login
                </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;