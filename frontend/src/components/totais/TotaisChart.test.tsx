import { describe, expect, it } from "vitest"

import { LIMITE_HORIZONTAL, ordenarPessoas, truncarNome } from "@/components/totais/TotaisChart"
import type { TotaisPessoa } from "@/types"

const pessoas: TotaisPessoa[] = [
  { id: 1, nome: "Ana Souza", totalReceitas: 1000, totalDespesas: 200, saldo: 800 },
  { id: 2, nome: "Bruno Lima", totalReceitas: 500, totalDespesas: 900, saldo: -400 },
  { id: 3, nome: "Carla Dias", totalReceitas: 2000, totalDespesas: 100, saldo: 1900 },
]

describe("TotaisChart helpers", () => {
  it("ordena por maior saldo", () => {
    expect(ordenarPessoas(pessoas, "saldo").map((p) => p.nome)).toEqual([
      "Carla Dias",
      "Ana Souza",
      "Bruno Lima",
    ])
  })

  it("ordena por maior despesa", () => {
    expect(ordenarPessoas(pessoas, "despesas").map((p) => p.nome)).toEqual([
      "Bruno Lima",
      "Ana Souza",
      "Carla Dias",
    ])
  })

  it("ordena por maior receita", () => {
    expect(ordenarPessoas(pessoas, "receitas").map((p) => p.nome)).toEqual([
      "Carla Dias",
      "Ana Souza",
      "Bruno Lima",
    ])
  })

  it("ordena por nome", () => {
    expect(ordenarPessoas(pessoas, "nome").map((p) => p.nome)).toEqual([
      "Ana Souza",
      "Bruno Lima",
      "Carla Dias",
    ])
  })

  it("trunca nomes longos", () => {
    expect(truncarNome("Marina Alves da Silva", 14)).toBe("Marina Alves …")
    expect(truncarNome("Ana", 14)).toBe("Ana")
  })

  it("define limiar de layout horizontal", () => {
    expect(LIMITE_HORIZONTAL).toBe(7)
  })
})
