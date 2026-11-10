
// Importa a função de comunicação com o backend
import apiRequest from "./api";

// ==========================================
// VALIDAR TOKEN DE RETIRADA
// ==========================================

export async function validarToken(token) {

  // Verifica se o aluno digitou algum token
  if (!token || !token.trim()) {
    throw new Error("Digite um token para continuar.");
  }

  try {

    // Envia o token para o backend do TechCampus
    // ATENÇÃO: a rota abaixo é uma proposta.
    // Precisamos confirmar a rota real do backend.

    const response = await apiRequest("/api/iot/validar-token", {
      method: "POST",

      body: JSON.stringify({
        token: token.trim(),
      }),
    });

    // Organiza os dados recebidos do servidor
    return {
      autorizado: response.autorizado ?? false,

      mensagem:
        response.mensagem ||
        "Não foi possível validar o token.",

      token: response.token ?? token.trim(),

      data: response,
    };

  } catch (error) {

    // Encaminha o erro para a tela que chamou a função
    throw error;

  }
}

// ==========================================
// EXPORTAÇÃO PADRÃO
// ==========================================

export default {
  validarToken,
};
