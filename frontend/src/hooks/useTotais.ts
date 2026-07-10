import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import { queryKeys } from "@/lib/queryKeys"
import type { TotaisGeral } from "@/types"

function mensagemErro(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback
}

export function useTotais() {
  const queryClient = useQueryClient()

  // Totais são recalculados no backend; o cache é invalidado pelas
  // mutações de pessoas/transações, não por refetch a cada troca de aba.
  const query = useQuery({
    queryKey: queryKeys.totais,
    queryFn: () => api.get<TotaisGeral>("/api/totais"),
  })

  useEffect(() => {
    if (query.error) {
      toast.error(mensagemErro(query.error, "Falha ao carregar totais."))
    }
  }, [query.error])

  const listar = () => queryClient.invalidateQueries({ queryKey: queryKeys.totais })

  return {
    totais: query.data ?? null,
    loading: query.isPending,
    erro: query.error ? mensagemErro(query.error, "Falha ao carregar totais.") : null,
    listar,
  }
}
