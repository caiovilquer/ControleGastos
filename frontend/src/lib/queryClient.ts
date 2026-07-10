import { QueryClient } from "@tanstack/react-query"

// staleTime evita refetch ao trocar de aba enquanto o cache ainda é fresco;
// mutações usam invalidateQueries para forçar dados novos após criar/excluir.
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
