interface ReceitaDespesaBarProps {
  receitas: number
  despesas: number
}

export function ReceitaDespesaBar({ receitas, despesas }: ReceitaDespesaBarProps) {
  // Percentual sobre receitas+despesas (fluxo), não sobre saldo.
  const total = receitas + despesas
  if (total <= 0) return null

  const pctReceitas = (receitas / total) * 100
  const pctDespesas = (despesas / total) * 100

  return (
    <div className="mt-4 w-full max-w-md sm:mt-5">
      <div className="mb-2 flex flex-col gap-0.5 text-xs font-semibold text-hero-muted sm:flex-row sm:justify-between sm:gap-2">
        <span>Composição do fluxo</span>
        <span className="tabular-nums">
          {pctReceitas.toFixed(0)}% receitas · {pctDespesas.toFixed(0)}% despesas
        </span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-hero-line">
        <div
          className="h-full bg-hero-pos transition-[width] duration-700 ease-out"
          style={{ width: `${pctReceitas}%` }}
        />
        <div
          className="h-full bg-hero-neg transition-[width] duration-700 ease-out"
          style={{ width: `${pctDespesas}%` }}
        />
      </div>
    </div>
  )
}
