import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePessoas } from "@/hooks/usePessoas"
import { useTransacoes } from "@/hooks/useTransacoes"

import { TransacaoForm } from "./TransacaoForm"
import { TransacoesTable, type FiltroTipo } from "./TransacoesTable"

export function TransacoesPage() {
  const { pessoas, loading: pessoasCarregando } = usePessoas()
  const { transacoes, loading, criar } = useTransacoes()

  const [filtroPessoaId, setFiltroPessoaId] = useState("todas")
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("Todos")

  function limparFiltros() {
    setFiltroPessoaId("todas")
    setFiltroTipo("Todos")
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-5">
      <Card className="w-full min-w-0 rounded-2xl p-4 shadow-sm sm:min-w-[280px] sm:flex-[0_1_360px] sm:p-5.5">
        <CardTitle className="font-display text-base font-semibold">Nova transação</CardTitle>
        <CardDescription className="text-sm">Registre uma receita ou despesa</CardDescription>
        <TransacaoForm pessoas={pessoas} pessoasCarregando={pessoasCarregando} onSubmit={criar} />
      </Card>

      <Card className="w-full min-w-0 overflow-hidden rounded-2xl shadow-sm sm:flex-[1_1_480px]">
        <CardHeader className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5 sm:py-4.5">
          <CardTitle className="font-display text-base font-semibold">Lançamentos</CardTitle>
          <span className="text-sm font-semibold text-muted-foreground">
            {transacoes.length} registros
          </span>
        </CardHeader>
        <CardContent className="min-w-0 p-0">
          <TransacoesTable
            transacoes={transacoes}
            loading={loading}
            pessoas={pessoas}
            filtroPessoaId={filtroPessoaId}
            filtroTipo={filtroTipo}
            onFiltroPessoaChange={setFiltroPessoaId}
            onFiltroTipoChange={setFiltroTipo}
            onLimparFiltros={limparFiltros}
          />
        </CardContent>
      </Card>
    </div>
  )
}
