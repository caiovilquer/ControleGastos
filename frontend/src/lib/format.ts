const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatarMoeda(valor: number): string {
  return currencyFormatter.format(valor)
}

// Formatação específica para saldo: usa o sinal de menos tipográfico
// ("−", não o hífen "-") separado por espaço, só quando negativo. Valores
// de receita/despesa nunca passam por aqui — são sempre magnitude, sem sinal.
export function formatarSaldo(valor: number): string {
  if (valor < 0) {
    return `− ${formatarMoeda(Math.abs(valor))}`
  }
  return formatarMoeda(valor)
}

// Iniciais para avatar: primeira letra do primeiro e do último nome.
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return "?"
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase()
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase()
}
