import apiRequest from "./api";

/**
 * Valida um token de retirada no backend TechCampus.
 *
 * A rota confirmada no backend é POST /api/iot/validar.
 * O servidor espera um token numérico de exatamente 6 dígitos
 * e responde com { valido, pedidoId, produtos, expiraEm }.
 */
export async function validarToken(token) {
  const tokenLimpo = String(token || "").trim();

  if (!/^\d{6}$/.test(tokenLimpo)) {
    throw new Error("O token deve conter exatamente 6 números.");
  }

  const response = await apiRequest("/api/iot/validar", {
    method: "POST",
    body: JSON.stringify({ token: tokenLimpo }),
  });

  return {
    autorizado: response?.valido === true,
    mensagem: response?.valido
      ? "Token válido. Retirada autorizada."
      : response?.erro || "Token inválido ou não autorizado.",
    token: tokenLimpo,
    pedidoId: response?.pedidoId ?? null,
    produtos: response?.produtos ?? "",
    expiraEm: response?.expiraEm ?? null,
    data: response,
  };
}

export default { validarToken };
