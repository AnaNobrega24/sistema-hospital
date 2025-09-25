// src/utils/apiUtils.js
import { toast } from "react-toastify";
import { getApi } from "../services/apiServices";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Função utilitária para tratar erros de API de forma consistente
 */
export function handleApiError(err, navigate) {
  const status = err.response?.status || err.status;
  
  if ([401, 403].includes(status)) {
    toast.error("Sessão expirada. Faça login novamente.", {
      autoClose: 5000,
    });
    // Remove token e redireciona após 2 segundos
    localStorage.removeItem("token");
    setTimeout(() => navigate("/"), 2000);
  } else if (status >= 500) {
    toast.error("Servidor indisponível. Tente novamente mais tarde.", {
      autoClose: 5000,
    });
  } else if (status >= 400) {
    toast.error("Erro na requisição. Verifique os dados enviados.", {
      autoClose: 5000,
    });
  } else {
    toast.error("Erro ao carregar dados. Verifique sua conexão.", {
      autoClose: 5000,
    });
  }
}

/**
 * Hook personalizado para fazer requisições de API com loading e error handling
 */
export function useApiData(endpoint, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const loadData = useCallback(async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Sessão expirada. Faça login novamente.");
      if (navigate) {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getApi(endpoint, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(`Erro ao carregar ${endpoint}:`, err);
      setError(err);
      setData([]);
      // Não chama handleApiError aqui para evitar toast duplicado
    } finally {
      setLoading(false);
    }
  }, [endpoint,navigate]);

  useEffect(() => {
    loadData();
  }, dependencies);

  return { data, setData, loading, error, reload: loadData };
}

/**
 * Função para verificar se token existe e é válido
 */
export function isAuthenticated() {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user");
  if (!user) return false;
  
  try {
    // Verifica se o token não expirou (se você usar JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
}