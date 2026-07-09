import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="flex max-w-[1120px] flex-wrap items-start gap-5">
      <Card className="min-w-[280px] flex-[0_1_360px] rounded-2xl p-5.5 shadow-sm">
        <CardTitle className="font-display text-base font-semibold">Nova transação</CardTitle>
        <CardDescription className="text-sm">Registre uma receita ou despesa</CardDescription>
        <TransacaoForm pessoas={pessoas} pessoasCarregando={pessoasCarregando} onSubmit={criar} />
      </Card>

      <Card className="min-w-0 flex-[1_1_480px] overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="flex items-center justify-between border-b border-border px-5 py-4.5">
          <CardTitle className="font-display text-base font-semibold">Lançamentos</CardTitle>
          <span className="text-sm font-semibold text-muted-foreground">
            {transacoes.length} registros
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <TransacoesTable transacoes={transacoes} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
