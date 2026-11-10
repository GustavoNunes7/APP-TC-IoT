import { useState, useEffect, useCallback } from "react";
import { verificarConexao } from "../services/api";

/**
 * Monitora a conexão entre o aplicativo e o BACKEND.
 * Isso não significa que o ESP8266 também esteja conectado.
 */
export default function useConnection() {
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("Verificando servidor...");

  const checkConnection = useCallback(async () => {
    setChecking(true);

    try {
      const response = await verificarConexao();
      const online = response.online === true;

      setConnected(online);
      setMessage(
        online ? "Servidor TechCampus conectado" : "Servidor indisponível"
      );

      return online;
    } catch (error) {
      setConnected(false);
      setMessage(error.message || "Não foi possível conectar ao servidor.");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    connected,
    checking,
    message,
    checkConnection,
  };
}
