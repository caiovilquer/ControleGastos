import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { usePessoas } from "@/hooks/usePessoas"
import { api } from "@/lib/api"
import { queryKeys } from "@/lib/queryKeys"

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  },
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function criarWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 30_000 },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return { Wrapper, queryClient }
}

describe("usePessoas (TanStack Query)", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("carrega pessoas via query cacheada", async () => {
    vi.mocked(api.get).mockResolvedValueOnce([
      { id: 1, nome: "Ana", idade: 30 },
    ])

    const { Wrapper } = criarWrapper()
    const { result } = renderHook(() => usePessoas(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.pessoas).toEqual([{ id: 1, nome: "Ana", idade: 30 }])
    expect(api.get).toHaveBeenCalledWith("/api/pessoas")
  })

  it("ao criar invalida pessoas, transacoes e totais", async () => {
    vi.mocked(api.get).mockResolvedValue([])
    vi.mocked(api.post).mockResolvedValue({ id: 2, nome: "Bruno", idade: 25 })

    const { Wrapper, queryClient } = criarWrapper()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(() => usePessoas(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const ok = await result.current.criar({ nome: "Bruno", idade: 25 })
    expect(ok).toBe(true)

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.pessoas })
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.transacoes })
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.totais })
    })
  })

  it("ao excluir invalida pessoas, transacoes e totais", async () => {
    vi.mocked(api.get).mockResolvedValue([{ id: 1, nome: "Ana", idade: 30 }])
    vi.mocked(api.delete).mockResolvedValue(undefined)

    const { Wrapper, queryClient } = criarWrapper()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries")

    const { result } = renderHook(() => usePessoas(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const ok = await result.current.excluir(1)
    expect(ok).toBe(true)

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.pessoas })
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.transacoes })
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.totais })
    })
  })
})
