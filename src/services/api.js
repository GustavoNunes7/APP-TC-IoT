// Base da API do TechCampus.
//
// Emulador Android: http://10.0.2.2:3022
// Celular físico: use o IP local do computador, por exemplo:
// EXPO_PUBLIC_API_URL=http://192.168.0.100:3022
//
// Também é possível definir EXPO_PUBLIC_API_URL no ambiente do Expo.

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001"
).replace(/\/$/, "");

const TIMEOUT = 10000;

/**
 * Faz uma requisição HTTP para o backend.
 * Aceita respostas JSON e respostas sem conteúdo.
 */
async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

    // Lê como texto primeiro para não quebrar em respostas vazias
    // ou quando o servidor retorna uma página HTML de erro.
    const raw = await response.text();
    let data = null;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = { mensagem: raw };
      }
    }

    if (!response.ok) {
      throw new Error(
        data?.erro ||
        data?.message ||
        data?.mensagem ||
        `Erro HTTP ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("O servidor demorou para responder. Tente novamente.");
    }

    // Erros de rede no fetch geralmente chegam sem código HTTP.
    if (error instanceof TypeError) {
      throw new Error(
        `Não foi possível acessar o TechCampus em ${BASE_URL}. ` +
        "Confira se o servidor está ligado e se o endereço IP está correto."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Verifica a rota real de saúde do backend.
 * No servidor TechCampus: GET /api/saude
 */
export async function verificarConexao() {
  const response = await apiRequest("/api/saude");

  return {
    online: response?.status === "online",
    data: response,
  };
}

export { BASE_URL };
export default apiRequest;
