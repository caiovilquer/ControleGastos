import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import { queryKeys } from "@/lib/queryKeys"
import type { Transacao, TipoTransacao } from "@/types"

export interface CriarTransacaoInput {
  pessoaId: number
  descricao: string
  valor: number
  tipo: TipoTransacao
}

function mensagemErro(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback
}

export function useTransacoes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.transacoes,
    queryFn: () => api.get<Transacao[]>("/api/transacoes"),
  })

  useEffect(() => {
    if (query.error) {
      toast.error(mensagemErro(query.error, "Falha ao carregar transações."))
    }
  }, [query.error])

  const criarMutation = useMutation({
    mutationFn: (input: CriarTransacaoInput) =>
      api.post<Transacao>("/api/transacoes", input),
    onSuccess: async () => {
      toast.success("Transação cadastrada com sucesso.")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.transacoes }),
        queryClient.invalidateQueries({ queryKey: queryKeys.totais }),
      ])
    },
    onError: (err) => {
      toast.error(mensagemErro(err, "Falha ao cadastrar transação."))
    },
  })

  const criar = async (input: CriarTransacaoInput) => {
    try {
      await criarMutation.mutateAsync(input)
      return true
    } catch {
      return false
    }
  }

  const listar = () => queryClient.invalidateQueries({ queryKey: queryKeys.transacoes })

  return {
    transacoes: query.data ?? [],
    loading: query.isPending,
    erro: query.error ? mensagemErro(query.error, "Falha ao carregar transações.") : null,
    listar,
    criar,
  }
}
