import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import type { Transacao, TipoTransacao } from "@/types"

export interface CriarTransacaoInput {
  pessoaId: number
  descricao: string
  valor: number
  tipo: TipoTransacao
}

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const listar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const dados = await api.get<Transacao[]>("/api/transacoes")
      setTransacoes(dados)
    } catch (err) {
      const mensagem = err instanceof ApiError ? err.message : "Falha ao carregar transações."
      setErro(mensagem)
      toast.error(mensagem)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    listar()
  }, [listar])

  // A regra de menor de idade fica só no backend: um 422 aqui é apenas
  // repassado ao usuário via toast com a mensagem do ProblemDetails.
  const criar = useCallback(
    async (input: CriarTransacaoInput) => {
      try {
        await api.post<Transacao>("/api/transacoes", input)
        toast.success("Transação cadastrada com sucesso.")
        await listar()
        return true
      } catch (err) {
        const mensagem = err instanceof ApiError ? err.message : "Falha ao cadastrar transação."
        toast.error(mensagem)
        return false
      }
    },
    [listar]
  )

  return { transacoes, loading, erro, listar, criar }
}
