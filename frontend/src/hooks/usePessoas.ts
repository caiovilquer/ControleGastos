import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import { queryKeys } from "@/lib/queryKeys"
import type { Pessoa } from "@/types"

export interface CriarPessoaInput {
  nome: string
  idade: number
}

function mensagemErro(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback
}

export function usePessoas() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.pessoas,
    queryFn: () => api.get<Pessoa[]>("/api/pessoas"),
  })

  useEffect(() => {
    if (query.error) {
      toast.error(mensagemErro(query.error, "Falha ao carregar pessoas."))
    }
  }, [query.error])

  // Criar/excluir pessoa afeta listas e totais (cascade delete remove
  // transações), então invalidamos os três caches relacionados.
  const criarMutation = useMutation({
    mutationFn: (input: CriarPessoaInput) => api.post<Pessoa>("/api/pessoas", input),
    onSuccess: async () => {
      toast.success("Pessoa cadastrada com sucesso.")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.pessoas }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transacoes }),
        queryClient.invalidateQueries({ queryKey: queryKeys.totais }),
      ])
    },
    onError: (err) => {
      toast.error(mensagemErro(err, "Falha ao cadastrar pessoa."))
    },
  })

  const excluirMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/pessoas/${id}`),
    onSuccess: async () => {
      toast.success("Pessoa excluída com sucesso.")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.pessoas }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transacoes }),
        queryClient.invalidateQueries({ queryKey: queryKeys.totais }),
      ])
    },
    onError: (err) => {
      toast.error(mensagemErro(err, "Falha ao excluir pessoa."))
    },
  })

  const criar = async (input: CriarPessoaInput) => {
    try {
      await criarMutation.mutateAsync(input)
      return true
    } catch {
      return false
    }
  }

  const excluir = async (id: number) => {
    try {
      await excluirMutation.mutateAsync(id)
      return true
    } catch {
      return false
    }
  }

  const listar = () => queryClient.invalidateQueries({ queryKey: queryKeys.pessoas })

  return {
    pessoas: query.data ?? [],
    // isPending = primeira carga sem cache; com cache fresco a troca de
    // aba não mostra skeleton de novo.
    loading: query.isPending,
    erro: query.error ? mensagemErro(query.error, "Falha ao carregar pessoas.") : null,
    listar,
    criar,
    excluir,
  }
}
