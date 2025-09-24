import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getApi } from "../services/apiServices";
import { toast } from "react-toastify";

const AtendimentoContext = createContext();

export function AtendimentoProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Estados para controle de erro mais granular
  const [errorType, setErrorType] = useState(null); // 'network', 'auth', 'server', 'unknown'
  const [isRetrying, setIsRetrying] = useState(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 segundo

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("token");
    return !!token;
  }, []);

  // Função para determinar se deve fazer retry baseado no erro
  const shouldRetry = useCallback((error, currentRetryCount) => {
    // Não faz retry se já excedeu o limite
    if (currentRetryCount >= MAX_RETRIES) return false;

    // Não faz retry para erros de autenticação ou validação
    if ([401, 403, 422].includes(error.status)) return false;

    // Faz retry para erros de rede ou servidor
    if (!error.status || [500, 502, 503, 504].includes(error.status))
      return true;

    return false;
  }, []);

  // Função para aguardar antes do retry
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Função principal para carregar pacientes
  const loadPatients = useCallback(
    async (isRetry = false) => {
      // Se não está autenticado, limpa tudo e sai
      if (!isAuthenticated()) {
        setPatients([]);
        setError(null);
        setErrorType(null);
        setLoading(false);
        return;
      }

      // Evita múltiplas requisições simultâneas
      if (loading && !isRetry) return;

      setLoading(true);
      if (!isRetry) {
        setError(null);
        setErrorType(null);
        setRetryCount(0);
      }

      try {
        console.log(
          `🔄 Carregando pacientes... ${
            isRetry ? `(retry ${retryCount + 1})` : ""
          }`
        );
        const token = localStorage.getItem("token")
        const data = await getApi("pacientes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sucesso - limpa estados de erro e atualiza dados
        setPatients(Array.isArray(data) ? data : []);
        setError(null);
        setErrorType(null);
        setRetryCount(0);
        setLastFetchTime(new Date());
        setIsRetrying(false);

        console.log("✅ Pacientes carregados com sucesso:", data?.length || 0);
      } catch (err) {
        console.error("❌ Erro ao carregar pacientes:", err);

        setError(err);
        setPatients([]); // Limpa a lista em caso de erro

        // Classificar tipo de erro
        let currentErrorType = "unknown";
        if (!err.status) {
          currentErrorType = "network";
        } else if ([401, 403].includes(err.status)) {
          currentErrorType = "auth";
        } else if ([500, 502, 503, 504].includes(err.status)) {
          currentErrorType = "server";
        }

        setErrorType(currentErrorType);

        // Lógica de retry
        if (shouldRetry(err, retryCount)) {
          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);
          setIsRetrying(true);

          console.log(
            `🔄 Tentando novamente em ${RETRY_DELAY}ms... (tentativa ${newRetryCount}/${MAX_RETRIES})`
          );

          // Toast informativo para o usuário
          if (newRetryCount === 1) {
            toast.info("Erro ao carregar pacientes. Tentando novamente...", {
              autoClose: 2000,
            });
          }

          // Aguarda e tenta novamente
          await delay(RETRY_DELAY * newRetryCount); // Delay progressivo
          return loadPatients(true);
        } else {
          // Não vai mais tentar - mostra erro definitivo
          setIsRetrying(false);

          // Mensagens específicas por tipo de erro
          switch (currentErrorType) {
            case "network":
              toast.error(
                "Sem conexão com o servidor. Verifique sua internet.",
                {
                  autoClose: 5000,
                }
              );
              break;

            case "auth":
              // Erro de autenticação já é tratado no interceptor
              // Não mostra toast adicional aqui
              break;

            case "server":
              toast.error(
                "Servidor temporariamente indisponível. Tente novamente mais tarde.",
                {
                  autoClose: 5000,
                }
              );
              break;

            default:
              if (retryCount > 0) {
                toast.error(
                  `Não foi possível carregar os pacientes após ${retryCount} tentativas.`,
                  {
                    autoClose: 5000,
                  }
                );
              } else {
                toast.error("Erro ao carregar lista de pacientes.", {
                  autoClose: 5000,
                });
              }
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, retryCount, shouldRetry, loading]
  );

  // Função para retry manual
  const retryLoadPatients = useCallback(() => {
    setRetryCount(0);
    loadPatients();
  }, [loadPatients]);

  // Função para verificar se os dados estão "frescos" (menos de 5 minutos)
  const isDataFresh = useCallback(() => {
    if (!lastFetchTime) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetchTime > fiveMinutesAgo;
  }, [lastFetchTime]);

  // Função para refresh inteligente (só carrega se necessário)
  const refreshPatients = useCallback(
    (force = false) => {
      if (force || !isDataFresh() || error) {
        loadPatients();
      }
    },
    [loadPatients, isDataFresh, error]
  );

  // Carregamento inicial
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Escuta o evento customizado para recarregar
  useEffect(() => {
    const handlePatientsChanged = () => {
      refreshPatients(true); // Force refresh quando há mudanças
    };

    const handleWindowFocus = () => {
      // Recarrega dados quando o usuário volta para a aba (se não estão frescos)
      refreshPatients();
    };

    window.addEventListener("patientsChanged", handlePatientsChanged);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("patientsChanged", handlePatientsChanged);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [refreshPatients]);

  // Demais funções do contexto...
  const updatePatient = (id, changes) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  };

  const removePatient = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const clearError = () => {
    setError(null);
    setErrorType(null);
  };

  const value = {
    // Dados
    patients,
    loading,
    error,
    errorType,
    retryCount,
    isRetrying,
    lastFetchTime,

    // Estados derivados
    hasError: !!error,
    isEmpty: !loading && patients.length === 0 && !error,
    hasData: patients.length > 0,
    isDataFresh: isDataFresh(),

    // Ações
    setPatients,
    updatePatient,
    removePatient,
    loadPatients,
    refreshPatients,
    retryLoadPatients,
    clearError,
    isAuthenticated,

    // Utilitários para componentes
    getErrorMessage: () => {
      if (!error) return null;

      switch (errorType) {
        case "network":
          return "Problema de conexão. Verifique sua internet.";
        case "server":
          return "Servidor indisponível. Tente novamente mais tarde.";
        case "auth":
          return "Sessão expirada. Faça login novamente.";
        default:
          return error.message || "Erro desconhecido ao carregar pacientes.";
      }
    },
  };

  return (
    <AtendimentoContext.Provider value={value}>
      {children}
    </AtendimentoContext.Provider>
  );
}

export function useAtendimento() {
  return useContext(AtendimentoContext);
}
