import { BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePessoas } from "@/hooks/usePessoas"
import { useTotais } from "@/hooks/useTotais"
import { useTransacoes } from "@/hooks/useTransacoes"
import { formatarMoeda, formatarSaldo } from "@/lib/format"

import { TotaisTable } from "./TotaisTable"

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

  return (
    <div className="flex max-w-[1120px] flex-col gap-5">
      {!semDados && (
        <div className="rounded-2xl bg-hero-bg p-8 text-hero-fg shadow-[0_14px_44px_rgba(14,27,51,.26)]">
          {carregando || !totais ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3.5 w-56 bg-white/10" />
              <Skeleton className="h-14 w-85 bg-white/10" />
              <Skeleton className="h-3.5 w-72 bg-white/10" />
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-7">
              <div>
                <span className="text-xs font-semibold tracking-wider text-hero-muted uppercase">
                  Saldo geral acumulado
                </span>
                <div
                  className={`mt-3 font-mono text-[64px] leading-none font-bold tracking-tight tabular-nums ${
                    totais.saldo >= 0 ? "text-hero-pos" : "text-hero-neg"
                  }`}
                >
                  {formatarSaldo(totais.saldo)}
                </div>
                <p className="mt-2.5 text-sm text-hero-muted">
                  {totais.pessoas.length} pessoas · {transacoes.length} lançamentos
                </p>
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

      <Card className="overflow-hidden rounded-2xl shadow-sm">
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
  )
}
