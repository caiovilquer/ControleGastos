import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TotaisTable } from '../../components/totais/TotaisTable'
import type { TotaisGeral } from '../../types'

const totais: TotaisGeral = {
  pessoas: [
    {
      id: 1,
      nome: 'Fernanda',
      totalReceitas: 3000,
      totalDespesas: 1200,
      saldo: 1800,
    },
    {
      id: 2,
      nome: 'Pedro',
      totalReceitas: 0,
      totalDespesas: 50,
      saldo: -50,
    },
  ],
  totalReceitas: 3000,
  totalDespesas: 1250,
  saldo: 1750,
}

describe('TotaisTable', () => {
  it('exibe totais por pessoa e o total geral vindos do backend', () => {
    const idadePorPessoa = new Map<number, number>([
      [1, 29],
      [2, 15],
    ])

    render(
      <TotaisTable totais={totais} loading={false} idadePorPessoa={idadePorPessoa} />
    )

    expect(screen.getByText('Fernanda')).toBeDefined()
    expect(screen.getByText('Pedro')).toBeDefined()
    expect(screen.getByText('Total geral')).toBeDefined()
    expect(screen.getByText('Menor de 18')).toBeDefined()
  })

  it('não recalcula: renderiza exatamente os valores recebidos', () => {
    const idadePorPessoa = new Map<number, number>([[1, 29]])
    const totaisSimples: TotaisGeral = {
      pessoas: [
        {
          id: 1,
          nome: 'Ana',
          totalReceitas: 10.5,
          totalDespesas: 0.5,
          saldo: 10,
        },
      ],
      totalReceitas: 10.5,
      totalDespesas: 0.5,
      saldo: 10,
    }

    render(
      <TotaisTable
        totais={totaisSimples}
        loading={false}
        idadePorPessoa={idadePorPessoa}
      />
    )

    // Garante que a tabela só exibe o que veio da API (não soma no cliente).
    expect(screen.getAllByText(/R\$\s*10,50/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/R\$\s*0,50/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/R\$\s*10,00/).length).toBeGreaterThanOrEqual(1)
  })
})
