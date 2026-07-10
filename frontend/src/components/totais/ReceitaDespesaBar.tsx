interface ReceitaDespesaBarProps {
  receitas: number
  despesas: number
}

// Barra proporcional receita vs despesa no hero — sem lib de chart.
export function ReceitaDespesaBar({ receitas, despesas }: ReceitaDespesaBarProps) {
  const total = receitas + despesas
  if (total <= 0) return null

  const pctReceitas = (receitas / total) * 100
  const pctDespesas = (despesas / total) * 100

  return (
    <div className="mt-5 w-full max-w-md">
      <div className="mb-2 flex justify-between text-xs font-semibold text-hero-muted">
        <span>Composição do fluxo</span>
        <span>
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
