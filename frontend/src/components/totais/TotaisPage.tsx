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
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      {!semDados && (
        <div className="animate-fade-up overflow-hidden rounded-2xl bg-hero-bg p-5 text-hero-fg shadow-[0_14px_44px_rgba(11,46,42,.32)] sm:p-8">
          {carregando || !totais ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3.5 w-56 bg-white/10" />
              <Skeleton className="h-14 w-full max-w-85 bg-white/10" />
              <Skeleton className="h-3.5 w-72 max-w-full bg-white/10" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-7">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold tracking-wider text-hero-muted uppercase">
                  Saldo geral acumulado
                </span>
                <div
                  className={`mt-2 break-all font-mono text-[36px] leading-none font-bold tracking-tight sm:mt-3 sm:text-[64px] ${
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

              <div className="grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:gap-3.5">
                <div className="min-w-0 rounded-xl border border-hero-line bg-white/5 px-3.5 py-3 sm:min-w-[160px] sm:px-5 sm:py-4">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-hero-muted sm:text-sm">
                    <span className="size-2 shrink-0 rounded-full bg-hero-pos" />
                    Receitas
                  </span>
                  <div className="mt-1.5 truncate font-mono text-base font-semibold tabular-nums text-hero-fg sm:mt-2 sm:text-[23px]">
                    {formatarMoeda(totais.totalReceitas)}
                  </div>
                </div>
                <div className="min-w-0 rounded-xl border border-hero-line bg-white/5 px-3.5 py-3 sm:min-w-[160px] sm:px-5 sm:py-4">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-hero-muted sm:text-sm">
                    <span className="size-2 shrink-0 rounded-full bg-hero-neg" />
                    Despesas
                  </span>
                  <div className="mt-1.5 truncate font-mono text-base font-semibold tabular-nums text-hero-neg sm:mt-2 sm:text-[23px]">
                    {formatarMoeda(totais.totalDespesas)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!semDados && insights.length > 0 && <TotaisInsights insights={insights} />}

      {!semDados && totais && totais.pessoas.length > 0 && (
        <Card className="animate-fade-up min-w-0 overflow-hidden rounded-2xl shadow-sm">
          <CardHeader className="border-b border-border px-4 py-4 sm:px-5 sm:py-4.5">
            <CardTitle className="font-display text-base font-semibold">
              Receitas e despesas por pessoa
            </CardTitle>
            <CardDescription className="text-sm">
              Comparativo visual dos totais
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 px-1 pt-2 pb-3 sm:px-2">
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

      <Card className="min-w-0 overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="border-b border-border px-4 py-4 sm:px-5 sm:py-4.5">
          <CardTitle className="font-display text-base font-semibold">
            Detalhamento por pessoa
          </CardTitle>
          <CardDescription className="text-sm">
            Receitas, despesas e saldo individual
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0 p-0">
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
  )
}
