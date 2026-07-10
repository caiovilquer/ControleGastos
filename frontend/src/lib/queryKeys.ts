// Chaves centralizadas: mutações invalidam por prefixo (ex.: ["pessoas"]).
export const queryKeys = {
  pessoas: ["pessoas"] as const,
  transacoes: ["transacoes"] as const,
  totais: ["totais"] as const,
}
