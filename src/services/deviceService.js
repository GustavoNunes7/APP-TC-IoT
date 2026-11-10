
// Importa a função principal de comunicação com a API
import apiRequest from "./api";

// ==========================================
// CONSULTAR STATUS DO DISPOSITIVO
// ==========================================

export async function consultarStatusDispositivo() {

  // Consulta o backend para obter o estado do ESP8266
  // ATENÇÃO: a rota abaixo é um exemplo e precisa
  // existir no backend para funcionar.

  const response = await apiRequest("/api/iot/status");

  return {
    conectado: response.conectado ?? false,
    ledLigado: response.ledLigado ?? false,
    dispositivo: response.dispositivo ?? "ESP8266",
    data: response,
  };
}

// ==========================================
// CONSULTAR STATUS DA LIBERAÇÃO
// ==========================================

export async function consultarStatusLiberacao(token) {

  // Impede a consulta sem um token válido
  if (!token) {
    throw new Error("Token não informado.");
  }

  // Consulta o backend sobre o processo de liberação
  // A rota também precisa ser implementada no backend.

  const response = await apiRequest(
    `/api/iot/liberacao/${encodeURIComponent(token)}`
  );

  return {
    autorizado: response.autorizado ?? false,
    liberado: response.liberado ?? false,
    mensagem: response.mensagem ?? "Status não informado.",
    data: response,
  };
}

// ==========================================
// EXPORTAÇÕES
// ==========================================

export default {
  consultarStatusDispositivo,
  consultarStatusLiberacao,
};
