import apiRequest from "./api";

/**
 * O backend atual não possui uma rota GET para consultar a telemetria
 * do ESP8266. Não retornamos um status fictício como "conectado".
 *
 * Quando a rota de telemetria for criada no backend, ela poderá ser
 * integrada aqui.
 */
export async function consultarStatusDispositivo() {
  return {
    disponivel: false,
    conectado: null,
    mensagem:
      "O backend ainda não disponibiliza uma rota de status do ESP8266.",
  };
}

/**
 * Registra a retirada como concluída no backend.
 *
 * IMPORTANTE:
 * A rota /api/iot/confirmar marca o pedido como entregue e consome
 * o token. Ela só deve ser chamada DEPOIS que o equipamento realmente
 * liberar/entregar o item. Não chamar apenas ao validar o token.
 */
export async function registrarRetiradaConcluida(token) {
  const tokenLimpo = String(token || "").trim();

  if (!/^\d{6}$/.test(tokenLimpo)) {
    throw new Error("Token inválido para confirmar a retirada.");
  }

  return apiRequest("/api/iot/confirmar", {
    method: "POST",
    body: JSON.stringify({ token: tokenLimpo }),
  });
}

export default {
  consultarStatusDispositivo,
  registrarRetiradaConcluida,
};
