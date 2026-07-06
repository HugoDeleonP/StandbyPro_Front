// Cliente HTTP para a API Spring Boot. So deve ser chamado a partir de
// Server Components/Server Actions (Next.js como BFF) - nunca de "use client".
// O token JWT nunca deve chegar ao navegador.

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080"

// Fallback para quando o backend principal (ex.: Render) estiver fora do
// ar/inacessivel - tenta um backend local antes de desistir. Util na
// apresentacao: se o Render "dormiu"/caiu, o backend rodando no laptop
// assume sem precisar trocar variavel de ambiente/redeploy.
const BACKEND_URL_FALLBACK = process.env.BACKEND_URL_FALLBACK ?? "http://localhost:8080"

const TIMEOUT_MS = 8000

export type ApiErrorBody = {
  status?: number
  mensagem?: string
  erros?: Record<string, string>
  error?: string
}

export class ApiError extends Error {
  status: number
  erros?: Record<string, string>

  constructor(status: number, message: string, erros?: Record<string, string>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.erros = erros
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  token?: string
}

async function tentarFetch(baseUrl: string, path: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(`${baseUrl}${path}`, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (token) headers["Authorization"] = `Bearer ${token}`

  const init: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  }

  let response: Response
  try {
    response = await tentarFetch(BACKEND_URL, path, init)
  } catch {
    // Backend principal fora do ar/inacessivel ou muito lento (timeout).
    // So vale a pena tentar o fallback se ele apontar para um endereco
    // diferente - senao seria a mesma tentativa de novo.
    if (BACKEND_URL_FALLBACK === BACKEND_URL) {
      throw new ApiError(0, "Nao foi possivel conectar ao servidor. Verifique se o backend esta no ar.")
    }
    try {
      response = await tentarFetch(BACKEND_URL_FALLBACK, path, init)
    } catch {
      throw new ApiError(0, "Nao foi possivel conectar ao servidor (nem ao principal, nem ao local de backup).")
    }
  }

  if (response.status === 204) {
    return undefined as T
  }

  const texto = await response.text()
  const dados: ApiErrorBody | null = texto ? safeJsonParse(texto) : null

  if (!response.ok) {
    const mensagemDosErros = dados?.erros ? Object.values(dados.erros).join(" ") : undefined
    const mensagem =
      dados?.mensagem ?? mensagemDosErros ?? dados?.error ?? "Erro inesperado ao comunicar com o servidor."
    throw new ApiError(response.status, mensagem, dados?.erros)
  }

  return dados as T
}

function safeJsonParse(texto: string): ApiErrorBody | null {
  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}
