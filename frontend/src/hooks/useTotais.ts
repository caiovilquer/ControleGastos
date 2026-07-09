import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import type { TotaisGeral } from "@/types"

export function useTotais() {
  const [totais, setTotais] = useState<TotaisGeral | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const listar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const dados = await api.get<TotaisGeral>("/api/totais")
      setTotais(dados)
    } catch (err) {
      const mensagem = err instanceof ApiError ? err.message : "Falha ao carregar totais."
      setErro(mensagem)
      toast.error(mensagem)
    } finally {
      setLoading(false)
    }
  }, [])

  // A aba de Totais é desmontada pelo Radix Tabs quando não está ativa
  // (TabsContent sem forceMount), então este efeito de montagem já
  // recarrega os dados toda vez que o usuário reabre a aba — refletindo
  // mudanças feitas em Pessoas/Transações enquanto ela estava fechada.
  useEffect(() => {
    listar()
  }, [listar])

  return { totais, loading, erro, listar }
}
