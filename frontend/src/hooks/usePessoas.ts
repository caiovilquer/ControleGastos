import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import type { Pessoa } from "@/types"

export interface CriarPessoaInput {
  nome: string
  idade: number
}

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const listar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const dados = await api.get<Pessoa[]>("/api/pessoas")
      setPessoas(dados)
    } catch (err) {
      const mensagem = err instanceof ApiError ? err.message : "Falha ao carregar pessoas."
      setErro(mensagem)
      toast.error(mensagem)
    } finally {
      setLoading(false)
    }
  }, [])

  // Carrega a lista uma vez ao montar; mutações abaixo revalidam chamando
  // listar() novamente em vez de atualizar o estado local otimisticamente,
  // mantendo a lista sempre consistente com o backend.
  useEffect(() => {
    listar()
  }, [listar])

  const criar = useCallback(
    async (input: CriarPessoaInput) => {
      try {
        await api.post<Pessoa>("/api/pessoas", input)
        toast.success("Pessoa cadastrada com sucesso.")
        await listar()
        return true
      } catch (err) {
        const mensagem = err instanceof ApiError ? err.message : "Falha ao cadastrar pessoa."
        toast.error(mensagem)
        return false
      }
    },
    [listar]
  )

  const excluir = useCallback(
    async (id: number) => {
      try {
        await api.delete(`/api/pessoas/${id}`)
        toast.success("Pessoa excluída com sucesso.")
        await listar()
        return true
      } catch (err) {
        const mensagem = err instanceof ApiError ? err.message : "Falha ao excluir pessoa."
        toast.error(mensagem)
        return false
      }
    },
    [listar]
  )

  return { pessoas, loading, erro, listar, criar, excluir }
}
