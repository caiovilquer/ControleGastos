import type { TotaisGeral, TotaisPessoa } from "@/types"

export interface Insight {
  tom: "neutro" | "positivo" | "alerta" | "info"
  texto: string
}

// Lista em português: "Ana", "Ana e Bruno", "Ana, Bruno e Cain".
export function juntarNomes(nomes: string[]): string {
  if (nomes.length === 0) return ""
  if (nomes.length === 1) return nomes[0]
  if (nomes.length === 2) return `${nomes[0]} e ${nomes[1]}`
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`
}

// Deriva frases curtas dos totais da API (sem recalcular no cliente).
export function gerarInsights(
  totais: TotaisGeral,
  idadePorPessoa: Map<number, number>,
  totalLancamentos: number
): Insight[] {
  if (totais.pessoas.length === 0) return []

  const insights: Insight[] = []

  // Sem idade no mapa (pessoas ainda carregando), assume adulto.
  const menores = totais.pessoas.filter((p) => (idadePorPessoa.get(p.id) ?? 18) < 18)
  if (menores.length > 0) {
    const nomes = juntarNomes(menores.map((p) => p.nome))
    const soDespesa = menores.every((p) => p.totalReceitas === 0)
    insights.push({
      tom: "info",
      texto: soDespesa
        ? `${nomes} ${menores.length === 1 ? "é menor" : "são menores"} de 18 e só registra${menores.length === 1 ? "" : "m"} despesas.`
        : `${nomes} ${menores.length === 1 ? "é menor" : "são menores"} de 18 — a API bloqueia receita para essa faixa.`,
    })
  }

  const negativos = totais.pessoas.filter((p) => p.saldo < 0)
  if (negativos.length > 0) {
    const pior = negativos.reduce((a, b) => (a.saldo < b.saldo ? a : b))
    insights.push({
      tom: "alerta",
      texto:
        negativos.length === 1
          ? `${pior.nome} está com saldo negativo.`
          : `${negativos.length} pessoas no vermelho; o menor saldo é de ${pior.nome}.`,
    })
  } else if (totais.saldo > 0 && totalLancamentos > 0) {
    const melhor = totais.pessoas.reduce((a, b) => (a.saldo > b.saldo ? a : b))
    insights.push({
      tom: "positivo",
      texto: `Casa no azul. Maior saldo individual: ${melhor.nome}.`,
    })
  }

  // No máximo 2 frases no card.
  return insights.slice(0, 2)
}

export function pessoaComMaiorSaldo(pessoas: TotaisPessoa[]): TotaisPessoa | null {
  if (pessoas.length === 0) return null
  return pessoas.reduce((a, b) => (a.saldo > b.saldo ? a : b))
}
