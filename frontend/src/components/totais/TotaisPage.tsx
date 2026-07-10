import { lazy, Suspense } from "react"
import { BarChart3 } from "lucide-react"

import { AnimatedSaldo } from "@/components/shared/AnimatedSaldo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePessoas } from "@/hooks/usePessoas"
import { useTotais } from "@/hooks/useTotais"
import { useTransacoes } from "@/hooks/useTransacoes"
import { formatarMoeda } from "@/lib/format"
import { gerarInsights } from "@/lib/insights"

import { ReceitaDespesaBar } from "./ReceitaDespesaBar"
import { TotaisInsights } from "./TotaisInsights"
import { TotaisTable } from "./TotaisTable"

// Recharts é pesado: carrega só quando a aba Totais monta.
const TotaisChart = lazy(() =>
  import("./TotaisChart").then((m) => ({ default: m.TotaisChart }))
)

interface TotaisPageProps {
  onNavegarParaTransacoes: () => void
}

export function TotaisPage({ onNavegarParaTransacoes }: TotaisPageProps) {
  const { totais, loading } = useTotais()
  // Reutilizado só para exibir "{N} lançamentos" no hero; TotaisGeralResponse
  // não traz essa contagem, e a aba Transações já busca esses dados do
  // mesmo jeito.
  const { transacoes, loading: transacoesCarregando } = useTransacoes()
  // Reutilizado só para saber a idade de cada pessoa (badge "Menor de 18"):
  // TotaisPessoaResponse não expõe idade, então cruzamos por id aqui, sem
  // alterar o contrato da API.
  const { pessoas } = usePessoas()
  const idadePorPessoa = new Map(pessoas.map((p) => [p.id, p.idade]))

  const carregando = loading || transacoesCarregando
  const semDados = !carregando && (!totais || totais.pessoas.length === 0)
  const insights =
    totais && !carregando
      ? gerarInsights(totais, idadePorPessoa, transacoes.length)
      : []

  return (
    <div className="flex w-full flex-col gap-5">
      {!semDados && (
        <div className="animate-fade-up rounded-2xl bg-hero-bg p-8 text-hero-fg shadow-[0_14px_44px_rgba(11,46,42,.32)]">
          {carregando || !totais ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3.5 w-56 bg-white/10" />
              <Skeleton className="h-14 w-85 bg-white/10" />
              <Skeleton className="h-3.5 w-72 bg-white/10" />
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-7">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold tracking-wider text-hero-muted uppercase">
                  Saldo geral acumulado
                </span>
                <div
                  className={`mt-3 font-mono text-[48px] leading-none font-bold tracking-tight sm:text-[64px] ${
                    totais.saldo >= 0 ? "text-hero-pos" : "text-hero-neg"
                  }`}
                >
                  <AnimatedSaldo valor={totais.saldo} />
                </div>
                <p className="mt-2.5 text-sm text-hero-muted">
                  {totais.pessoas.length} pessoas · {transacoes.length} lançamentos
                </p>
                <ReceitaDespesaBar
                  receitas={totais.totalReceitas}
                  despesas={totais.totalDespesas}
                />
              </div>

              <div className="flex flex-wrap gap-3.5">
                <div className="min-w-[160px] rounded-xl border border-hero-line bg-white/5 px-5 py-4">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-hero-muted">
                    <span className="size-2 rounded-full bg-hero-pos" />
                    Receitas
                  </span>
                  <div className="mt-2 font-mono text-[23px] font-semibold tabular-nums text-hero-fg">
                    {formatarMoeda(totais.totalReceitas)}
                  </div>
                </div>
                <div className="min-w-[160px] rounded-xl border border-hero-line bg-white/5 px-5 py-4">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-hero-muted">
                    <span className="size-2 rounded-full bg-hero-neg" />
                    Despesas
                  </span>
                  <div className="mt-2 font-mono text-[23px] font-semibold tabular-nums text-hero-fg">
                    {formatarMoeda(totais.totalDespesas)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!semDados && insights.length > 0 && <TotaisInsights insights={insights} />}

      {/* Em telas largas: gráfico e tabela lado a lado para ocupar a
          largura útil em vez de empilhar tudo numa coluna estreita. */}
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        {!semDados && totais && totais.pessoas.length > 0 && (
          <Card className="animate-fade-up overflow-hidden rounded-2xl shadow-sm">
            <CardHeader className="border-b border-border px-5 py-4.5">
              <CardTitle className="font-display text-base font-semibold">
                Receitas e despesas por pessoa
              </CardTitle>
              <CardDescription className="text-sm">
                Comparativo visual dos totais
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-3">
              {carregando ? (
                <div className="flex h-[280px] items-center justify-center px-5">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="flex h-[280px] items-center justify-center px-5">
                      <Skeleton className="h-[200px] w-full" />
                    </div>
                  }
                >
                  <TotaisChart pessoas={totais.pessoas} />
                </Suspense>
              )}
            </CardContent>
          </Card>
        )}

        <Card
          className={`overflow-hidden rounded-2xl shadow-sm ${
            semDados || !totais || totais.pessoas.length === 0 ? "xl:col-span-2" : ""
          }`}
        >
          <CardHeader className="border-b border-border px-5 py-4.5">
            <CardTitle className="font-display text-base font-semibold">
              Detalhamento por pessoa
            </CardTitle>
            <CardDescription className="text-sm">
              Receitas, despesas e saldo individual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {semDados ? (
              <div className="flex flex-col items-center px-6 py-13 text-center">
                <div className="flex size-13 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <BarChart3 className="size-[22px]" />
                </div>
                <p className="mt-4 font-display text-base font-semibold">Nenhum lançamento ainda</p>
                <p className="mt-1.5 max-w-[340px] text-sm leading-relaxed text-muted-foreground">
                  Cadastre as pessoas da casa e registre a primeira transação para ver os totais
                  aqui.
                </p>
                <Button className="mt-4.5" onClick={onNavegarParaTransacoes}>
                  Registrar transação
                </Button>
              </div>
            ) : (
              <TotaisTable totais={totais} loading={carregando} idadePorPessoa={idadePorPessoa} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
