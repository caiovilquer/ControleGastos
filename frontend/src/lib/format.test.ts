import { describe, expect, it } from 'vitest'

import { formatarMoeda, formatarSaldo, iniciais } from '@/lib/format'

describe('formatarMoeda', () => {
  it('formata valores em BRL', () => {
    expect(formatarMoeda(1234.56)).toMatch(/R\$\s*1\.234,56/)
  })

  it('formata zero', () => {
    expect(formatarMoeda(0)).toMatch(/R\$\s*0,00/)
  })
})

describe('formatarSaldo', () => {
  it('não altera saldo positivo', () => {
    expect(formatarSaldo(100)).toBe(formatarMoeda(100))
  })

  it('usa sinal tipográfico para saldo negativo', () => {
    expect(formatarSaldo(-50)).toBe(`− ${formatarMoeda(50)}`)
  })
})

describe('iniciais', () => {
  it('usa primeira e última palavra', () => {
    expect(iniciais('Fernanda Alves')).toBe('FA')
  })

  it('usa uma letra quando há só um nome', () => {
    expect(iniciais('Ana')).toBe('A')
  })

  it('retorna ? para nome vazio', () => {
    expect(iniciais('   ')).toBe('?')
  })
})
