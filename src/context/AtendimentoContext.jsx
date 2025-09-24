import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  const [errorType, setErrorType] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Refs para evitar loops
  const loadingRef = useRef(false);
  const mountedRef = useRef(false);
  const abortControllerRef = useRef(null);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("token");
    return !!token;
  }, []);

  // Função para determinar se deve fazer retry baseado no erro
  const shouldRetry = useCallback((error, currentRetryCount) => {
    if (currentRetryCount >= MAX_RETRIES) return false;
    if ([401, 403, 422].includes(error.status)) return false;
    if (!error.status || [500, 502, 503, 504].includes(error.status)) return true;
    return false;
  }, []);

  // Função para aguardar antes do retry
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Função principal para carregar pacientes - REMOVIDO loading das dependências
  const loadPatients = useCallback(
    async (isRetry = false) => {
      // Evita execução se componente foi desmontado
      if (!mountedRef.current) return;

      // Se não está autenticado, limpa tudo e sai
      if (!isAuthenticated()) {
        setPatients([]);
        setError(null);
        setErrorType(null);
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      // Evita múltiplas requisições simultâneas usando ref
      if (loadingRef.current && !isRetry) {
        console.log("⏳ Carregamento já em andamento, ignorando nova requisição");
        return;
      }

      // Cancela requisição anterior se existir
      if (abortControllerRef.current && !isRetry) {
        abortControllerRef.current.abort();
      }

      // Cria novo controller para esta requisição
      abortControllerRef.current = new AbortController();

      loadingRef.current = true;
      setLoading(true);

      if (!isRetry) {
        setError(null);
        setErrorType(null);
        setRetryCount(0);
      }

      try {
        console.log(
          `📄 Carregando pacientes... ${
            isRetry ? `(retry ${retryCount + 1})` : ""
          }`
        );

        const token = localStorage.getItem("token");
        const data = await getApi("pacientes", {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current.signal, // Adiciona signal para cancelamento
        });

        // Verifica se componente ainda está montado antes de atualizar estado
        if (!mountedRef.current) return;

        // Sucesso - atualiza todos os estados de uma vez para evitar múltiplas renderizações
        setPatients(Array.isArray(data) ? data : []);
        setError(null);
        setErrorType(null);
        setRetryCount(0);
        setLastFetchTime(new Date());
        setIsRetrying(false);

        console.log("✅ Pacientes carregados com sucesso:", data?.length || 0);
      } catch (err) {
        // Se a requisição foi cancelada, não processa o erro
        if (err.name === 'AbortError') {
          console.log("🚫 Requisição cancelada");
          return;
        }

        // Verifica se componente ainda está montado
        if (!mountedRef.current) return;

        console.error("❌ Erro ao carregar pacientes:", err);

        setError(err);
        setPatients([]);

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

          if (newRetryCount === 1) {
            toast.info("Erro ao carregar pacientes. Tentando novamente...", {
              autoClose: 2000,
            });
          }

          // Libera loading antes do retry
          loadingRef.current = false;
          setLoading(false);

          await delay(RETRY_DELAY * newRetryCount);
          return loadPatients(true);
        } else {
          setIsRetrying(false);

          // Mensagens específicas por tipo de erro
          switch (currentErrorType) {
            case "network":
              toast.error(
                "Sem conexão com o servidor. Verifique sua internet.",
                { autoClose: 5000 }
              );
              break;

            case "auth":
              break;

            case "server":
              toast.error(
                "Servidor temporariamente indisponível. Tente novamente mais tarde.",
                { autoClose: 5000 }
              );
              break;

            default:
              if (retryCount > 0) {
                toast.error(
                  `Não foi possível carregar os pacientes após ${retryCount} tentativas.`,
                  { autoClose: 5000 }
                );
              } else {
                toast.error("Erro ao carregar lista de pacientes.", {
                  autoClose: 5000,
                });
              }
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    },
    [isAuthenticated, retryCount, shouldRetry] // REMOVIDO loading das dependências
  );

  // Função para retry manual
  const retryLoadPatients = useCallback(() => {
    setRetryCount(0);
    loadPatients();
  }, [loadPatients]);

  // Função para verificar se os dados estão "frescos"
  const isDataFresh = useCallback(() => {
    if (!lastFetchTime) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetchTime > fiveMinutesAgo;
  }, [lastFetchTime]);

  // Função para refresh inteligente
  const refreshPatients = useCallback(
    (force = false) => {
      if (force || !isDataFresh() || error) {
        loadPatients();
      }
    },
    [loadPatients, isDataFresh, error]
  );

  // EFEITO DE MONTAGEM - executa apenas uma vez
  useEffect(() => {
    mountedRef.current = true;
    
    // Carrega dados apenas se ainda não estão sendo carregados
    if (!loadingRef.current) {
      loadPatients();
    }

    // Cleanup ao desmontar
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // DEPENDÊNCIAS VAZIAS - executa apenas na montagem

  // Escuta eventos - useEffect separado com dependências estáveis
  useEffect(() => {
    const handlePatientsChanged = () => {
      if (mountedRef.current) {
        refreshPatients(true);
      }
    };

    const handleWindowFocus = () => {
      if (mountedRef.current) {
        refreshPatients();
      }
    };

    window.addEventListener("patientsChanged", handlePatientsChanged);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("patientsChanged", handlePatientsChanged);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [refreshPatients]);

  // Outras funções do contexto
  const updatePatient = useCallback((id, changes) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  }, []);

  const removePatient = useCallback((id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorType(null);
  }, []);

  // Valor do contexto - usando useMemo para evitar re-criações desnecessárias
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