
// Importa os Hooks do React
import { useState, useEffect, useCallback } from "react";

// Importa a função que verifica a conexão com a API
import { verificarConexao } from "../services/api";

// Hook personalizado para monitorar a conexão
export default function useConnection() {

  // Guarda se o servidor está conectado
  const [connected, setConnected] = useState(false);

  // Controla se a verificação está acontecendo
  const [checking, setChecking] = useState(true);

  // Guarda a mensagem de conexão
  const [message, setMessage] = useState("Verificando conexão...");

  // Função responsável por verificar a conexão
  const checkConnection = useCallback(async () => {

    // Informa que a verificação começou
    setChecking(true);

    try {

      // Consulta o backend do TechCampus
      const response = await verificarConexao();

      // Se o servidor respondeu corretamente
      if (response.online) {

        setConnected(true);
        setMessage("Servidor conectado");

      } else {

        setConnected(false);
        setMessage("Servidor indisponível");

      }

    } catch (error) {

      // Caso não consiga acessar o servidor
      setConnected(false);
      setMessage("Sem conexão com o servidor");

    } finally {

      // Finaliza a verificação
      setChecking(false);

    }

  }, []);

  // Executa a primeira verificação quando o Hook é utilizado
  useEffect(() => {

    checkConnection();

  }, [checkConnection]);

  // Disponibiliza os dados e a função para as telas
  return {
    connected,
    checking,
    message,
    checkConnection,
  };

}
