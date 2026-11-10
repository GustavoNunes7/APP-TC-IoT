
import colors from "../constants/colors";

// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

// IMPORTANTE:
// Altere o endereço conforme o ambiente utilizado.

// Android Studio Emulator:
// Use 10.0.2.2 para acessar o computador.

// Celular físico:
// Use o IP local do computador na mesma rede Wi-Fi.

// Exemplo: http://192.168.0.100:3022

const BASE_URL = "http://10.0.2.2:3022";

// Tempo máximo de espera das requisições
const TIMEOUT = 10000;

// ==========================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÃO
// ==========================================

async function apiRequest(endpoint, options = {}) {

  // Controlador para limitar o tempo da requisição
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {

    // Realiza a comunicação com o servidor
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,

      // Cabeçalhos padrão
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },

      signal: controller.signal,
    });

    // Converte a resposta para JSON
    const data = await response.json();

    // Verifica se o servidor retornou algum erro HTTP
    if (!response.ok) {
      throw new Error(
        data.message || `Erro HTTP: ${response.status}`
      );
    }

    return data;

  } catch (error) {

    // Trata erros de conexão e tempo limite
    if (error.name === "AbortError") {
      throw new Error("Tempo limite de conexão excedido.");
    }

    throw error;

  } finally {

    // Limpa o temporizador
    clearTimeout(timeoutId);

  }
}

// ==========================================
// VERIFICAÇÃO DE CONEXÃO
// ==========================================

export async function verificarConexao() {

  // Consulta a rota de saúde do backend
  const response = await apiRequest("/api/saude");

  return {
    online: response.status === "online",
    data: response,
  };

}

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default apiRequest;
