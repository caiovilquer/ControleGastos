import { describe, expect, it } from "vitest"

import { gerarInsights, juntarNomes } from "@/lib/insights"
import type { TotaisGeral } from "@/types"

const base: TotaisGeral = {
  pessoas: [
    { id: 1, nome: "Ana", totalReceitas: 3000, totalDespesas: 1000, saldo: 2000 },
    { id: 2, nome: "Marina", totalReceitas: 0, totalDespesas: 100, saldo: -100 },
    { id: 3, nome: "Carlos", totalReceitas: 500, totalDespesas: 800, saldo: -300 },
  ],
  totalReceitas: 3500,
  totalDespesas: 1900,
  saldo: 1600,
}

describe("juntarNomes", () => {
  it("usa e antes do último nome", () => {
    expect(juntarNomes(["Marina Alves"])).toBe("Marina Alves")
    expect(juntarNomes(["Marina Alves", "Cain"])).toBe("Marina Alves e Cain")
    expect(juntarNomes(["Marina Alves", "Cain", "Pedro"])).toBe(
      "Marina Alves, Cain e Pedro"
    )
  })
})

describe("gerarInsights", () => {
  it("destaca menor de idade só com despesas", () => {
    const idade = new Map([
      [1, 30],
      [2, 16],
      [3, 35],
    ])

    const insights = gerarInsights(base, idade, 5)

    expect(insights.some((i) => i.texto.includes("Marina") && i.texto.includes("despesas"))).toBe(
      true
    )
  })

  it("liga dois menores com e", () => {
    const totais: TotaisGeral = {
      pessoas: [
        { id: 1, nome: "Marina Alves", totalReceitas: 0, totalDespesas: 50, saldo: -50 },
        { id: 2, nome: "Cain", totalReceitas: 0, totalDespesas: 20, saldo: -20 },
      ],
      totalReceitas: 0,
      totalDespesas: 70,
      saldo: -70,
    }
    const idade = new Map([
      [1, 16],
      [2, 15],
    ])

    const insights = gerarInsights(totais, idade, 2)
    const texto = insights.find((i) => i.tom === "info")?.texto ?? ""

    expect(texto).toContain("Marina Alves e Cain são menores de 18")
  })

  it("alerta quando há saldos negativos", () => {
    const idade = new Map([
      [1, 30],
      [2, 16],
      [3, 35],
    ])

    const insights = gerarInsights(base, idade, 5)

    expect(insights.some((i) => i.tom === "alerta" && i.texto.includes("Carlos"))).toBe(true)
  })

  it("retorna no máximo 2 insights", () => {
    const idade = new Map([
      [1, 30],
      [2, 16],
      [3, 35],
    ])

    expect(gerarInsights(base, idade, 5).length).toBeLessThanOrEqual(2)
  })

  it("retorna lista vazia sem pessoas", () => {
    expect(
      gerarInsights(
        { pessoas: [], totalReceitas: 0, totalDespesas: 0, saldo: 0 },
        new Map(),
        0
      )
    ).toEqual([])
  })
})
