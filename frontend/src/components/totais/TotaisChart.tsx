import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { formatarMoeda } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { TotaisPessoa } from "@/types"

interface TotaisChartProps {
  pessoas: TotaisPessoa[]
}

type Ordenacao = "saldo" | "despesas" | "receitas" | "nome"

const LIMITE_HORIZONTAL = 7
const ALTURA_POR_PESSOA = 44
const ALTURA_MIN_VERTICAL = 260
const ALTURA_MAX_VISIVEL = 420
const MARGEM_CHART = 56

const OPCOES_ORDENACAO: Array<{ id: Ordenacao; label: string }> = [
  { id: "saldo", label: "Maior saldo" },
  { id: "despesas", label: "Maior despesa" },
  { id: "receitas", label: "Maior receita" },
  { id: "nome", label: "Nome" },
]

type PontoGrafico = {
  id: number
  nomeEixo: string
  nomeCompleto: string
  Receitas: number
  Despesas: number
  saldo: number
}

function truncarNome(nome: string, max = 16): string {
  const limpo = nome.trim()
  if (limpo.length <= max) return limpo
  return `${limpo.slice(0, max - 1)}…`
}

function ordenarPessoas(pessoas: TotaisPessoa[], ordenacao: Ordenacao): TotaisPessoa[] {
  const copia = [...pessoas]
  switch (ordenacao) {
    case "saldo":
      return copia.sort((a, b) => b.saldo - a.saldo || a.nome.localeCompare(b.nome, "pt-BR"))
    case "despesas":
      return copia.sort(
        (a, b) => b.totalDespesas - a.totalDespesas || a.nome.localeCompare(b.nome, "pt-BR")
      )
    case "receitas":
      return copia.sort(
        (a, b) => b.totalReceitas - a.totalReceitas || a.nome.localeCompare(b.nome, "pt-BR")
      )
    case "nome":
      return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
  }
}

function formatarEixoValor(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
  return String(v)
}

function TooltipConteudo({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload?: PontoGrafico
  }>
}) {
  if (!active || !payload?.length) return null

  const ponto = payload[0]?.payload
  const nome = ponto?.nomeCompleto ?? ""
  const saldo = ponto?.saldo

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="mb-1.5 text-xs font-semibold">{nome}</p>
      {payload.map((item) => (
        <p key={item.name} className="font-mono text-xs tabular-nums" style={{ color: item.color }}>
          {item.name}: {formatarMoeda(item.value)}
        </p>
      ))}
      {saldo !== undefined && (
        <p className="mt-1 border-t border-border pt-1 font-mono text-xs font-semibold tabular-nums text-foreground">
          Saldo: {formatarMoeda(saldo)}
        </p>
      )}
    </div>
  )
}

export function TotaisChart({ pessoas }: TotaisChartProps) {
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("saldo")

  const horizontal = pessoas.length >= LIMITE_HORIZONTAL

  const data = useMemo<PontoGrafico[]>(() => {
    return ordenarPessoas(pessoas, ordenacao).map((p) => ({
      id: p.id,
      // Vertical: primeiro nome; horizontal: nome truncado (eixo Y apertado).
      nomeEixo: horizontal ? truncarNome(p.nome, 14) : truncarNome(p.nome.split(/\s+/)[0] ?? p.nome, 12),
      nomeCompleto: p.nome,
      Receitas: p.totalReceitas,
      Despesas: p.totalDespesas,
      saldo: p.saldo,
    }))
  }, [pessoas, ordenacao, horizontal])

  const alturaConteudo = horizontal
    ? Math.max(ALTURA_MIN_VERTICAL, data.length * ALTURA_POR_PESSOA + MARGEM_CHART)
    : ALTURA_MIN_VERTICAL

  const precisaScroll = horizontal && alturaConteudo > ALTURA_MAX_VISIVEL
  const alturaViewport = precisaScroll ? ALTURA_MAX_VISIVEL : alturaConteudo

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2 sm:px-3">
        <span className="mr-1 w-full text-xs font-medium text-muted-foreground sm:w-auto">
          Ordenar:
        </span>
        {OPCOES_ORDENACAO.map((opcao) => (
          <button
            key={opcao.id}
            type="button"
            onClick={() => setOrdenacao(opcao.id)}
            className={cn(
              "h-7 rounded-md border px-2 text-[11px] font-semibold transition-colors sm:px-2.5",
              ordenacao === opcao.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {opcao.label}
          </button>
        ))}
      </div>

      <div
        className={cn("w-full min-w-0 px-1 pt-1 pb-1 sm:px-2", precisaScroll && "overflow-y-auto")}
        style={{ height: alturaViewport }}
      >
        <div className="min-w-0" style={{ height: alturaConteudo, minHeight: alturaConteudo }}>
          <ResponsiveContainer width="100%" height="100%">
            {horizontal ? (
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={formatarEixoValor}
                />
                <YAxis
                  type="category"
                  dataKey="nomeEixo"
                  width={72}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  content={<TooltipConteudo />}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
                <Bar
                  dataKey="Receitas"
                  fill="hsl(var(--success))"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="Despesas"
                  fill="hsl(var(--danger))"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis
                  dataKey="nomeEixo"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={formatarEixoValor}
                />
                <Tooltip
                  content={<TooltipConteudo />}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
                <Bar
                  dataKey="Receitas"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="Despesas"
                  fill="hsl(var(--danger))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {precisaScroll && (
        <p className="px-3 pb-2 text-[11px] text-muted-foreground">
          Role para ver todas as {data.length} pessoas
        </p>
      )}
    </div>
  )
}

/** Helpers exportados para testes unitários. */
export { ordenarPessoas, truncarNome, LIMITE_HORIZONTAL }
