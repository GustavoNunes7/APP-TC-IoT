// Serviço central de comunicação com o backend TechCampus.
// O endereço pode ser definido por EXPO_PUBLIC_API_URL.
// Para a demonstração atual, o padrão é o IP do notebook na rede local.

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

export const getBaseUrl = () =>
  `${serverProtocol}://${serverHost}:${serverPort}`;

// Altera o servidor durante a sessão atual do aplicativo.
// Não carrega valores antigos do armazenamento do celular.
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

  serverHost = novoHost;
  serverPort = novaPorta;
  serverProtocol = "http";

  return getBaseUrl();
}

export async function obterConfiguracaoServidor() {
  return {
    host: serverHost,
    port: serverPort,
    url: getBaseUrl(),
  };
}

const TIMEOUT = 10000;

async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  const url = `${getBaseUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

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
    if (error?.name === "AbortError") {
      throw new Error(
        `Tempo esgotado ao acessar ${url}. Verifique se o servidor está ligado.`
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        `Não foi possível acessar ${url}. Confira o IP, a rede local e se o servidor está ligado.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function verificarConexao() {
  const response = await apiRequest("/api/saude");
  const status = String(response?.status || "").toLowerCase();

  return {
    online: status === "online",
    data: response,
  };
}

export { getBaseUrl as BASE_URL };
export default apiRequest;
