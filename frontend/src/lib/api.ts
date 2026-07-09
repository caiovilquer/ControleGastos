// Wrapper fino sobre fetch para a API do backend.

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5153"

interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Extrai a mensagem mais útil de um ProblemDetails: prioriza "detail",
// cai para os erros de validação do FluentValidation e por fim "title".
function extractErrorMessage(problem: ProblemDetails): string {
  if (problem.detail) return problem.detail

  if (problem.errors) {
    const mensagens = Object.values(problem.errors).flat()
    if (mensagens.length > 0) return mensagens.join(" ")
  }

  return problem.title ?? "Erro inesperado ao comunicar com a API."
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!response.ok) {
    let message = `Erro ${response.status} ao comunicar com a API.`
    try {
      const problem = (await response.json()) as ProblemDetails
      message = extractErrorMessage(problem)
    } catch {
      // Corpo da resposta não é JSON (ou está vazio); mantém a mensagem padrão.
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
