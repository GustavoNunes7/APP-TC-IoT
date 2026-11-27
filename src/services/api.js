import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@techcampus:servidor:v2";

// Permite usar EXPO_PUBLIC_API_URL ou a configuração padrão.
// O IP abaixo é o endereço atual do notebook na rede local.
const ENV_URL = process.env.EXPO_PUBLIC_API_URL || "";

const envMatch = ENV_URL.match(
  /^(https?):\/\/([^/:?#]+)(?::(\d+))?\/?$/i
);

const DEFAULT_PROTOCOL = envMatch?.[1] || "http";
const DEFAULT_HOST = envMatch?.[2] || "10.21.129.20";
const DEFAULT_PORT = Number(envMatch?.[3] || 3022);

let serverProtocol = DEFAULT_PROTOCOL;
let serverHost = DEFAULT_HOST;
let serverPort = DEFAULT_PORT;

// Carrega a configuração salva no celular.
const configReady = (async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    if (saved) {
      const config = JSON.parse(saved);

      if (config.host && config.port) {
        serverHost = config.host;
        serverPort = Number(config.port);
        serverProtocol = config.protocol || DEFAULT_PROTOCOL;
      }
    }
  } catch (error) {
    console.warn(
      "Não foi possível carregar o servidor salvo:",
      error
    );
  }
})();

// Retorna o endereço completo do backend.
export const getBaseUrl = () =>
  `${serverProtocol}://${serverHost}:${serverPort}`;

// Configura e salva o servidor no celular.
export async function configurarServidor(host, port = DEFAULT_PORT) {
  const novoHost = String(host || "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

  const novaPorta = Number(port);

  if (!novoHost || /[/:?#\s]/.test(novoHost)) {
    throw new Error("Informe um endereço IP ou domínio válido.");
  }

  if (
    !Number.isInteger(novaPorta) ||
    novaPorta < 1 ||
    novaPorta > 65535
  ) {
    throw new Error("Informe uma porta válida.");
  }

  await configReady;

  const anterior = {
    host: serverHost,
    port: serverPort,
    protocol: serverProtocol,
  };

  serverHost = novoHost;
  serverPort = novaPorta;
  serverProtocol = "http";

  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        host: serverHost,
        port: serverPort,
        protocol: serverProtocol,
      })
    );
  } catch (error) {
    serverHost = anterior.host;
    serverPort = anterior.port;
    serverProtocol = anterior.protocol;

    throw new Error(
      "Não foi possível salvar a configuração no celular."
    );
  }

  return getBaseUrl();
}

// Recupera a configuração atual.
export async function obterConfiguracaoServidor() {
  await configReady;

  return {
    host: serverHost,
    port: serverPort,
    url: getBaseUrl(),
  };
}

const TIMEOUT = 10000;

// Faz requisições ao backend.
async function apiRequest(endpoint, options = {}) {
  await configReady;

  const controller = new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    TIMEOUT
  );

  try {
    const response = await fetch(
      `${getBaseUrl()}${endpoint}`,
      {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
          ...options.headers,
        },
        signal: controller.signal,
      }
    );

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
      throw new Error(
        "O servidor demorou para responder. Tente novamente."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        `Não foi possível acessar o TechCampus em ${getBaseUrl()}. ` +
        "Confira se o servidor está ligado e se o endereço está correto."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Verifica a conexão com o backend.
export async function verificarConexao() {
  const response = await apiRequest("/api/saude");

  return {
    online: response?.status === "online",
    data: response,
  };
}

export { getBaseUrl as BASE_URL };

export default apiRequest;
