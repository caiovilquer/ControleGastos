import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePessoas } from "@/hooks/usePessoas"
import { useTransacoes } from "@/hooks/useTransacoes"

import { TransacaoForm } from "./TransacaoForm"
import { TransacoesTable } from "./TransacoesTable"

export function TransacoesPage() {
  // Reutiliza usePessoas só para popular o select do formulário; a aba
  // Pessoas tem sua própria instância independente do hook.
  const { pessoas, loading: pessoasCarregando } = usePessoas()
  const { transacoes, loading, criar } = useTransacoes()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <TransacaoForm pessoas={pessoas} pessoasCarregando={pessoasCarregando} onSubmit={criar} />
        <TransacoesTable transacoes={transacoes} loading={loading} />
      </CardContent>
    </Card>
  )
}
