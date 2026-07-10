import { afterEach, describe, expect, it, vi } from 'vitest'

import { api, ApiError } from '@/lib/api'

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('get retorna o JSON em sucesso', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ id: 1, nome: 'Ana', idade: 25 }],
      })
    )

    const dados = await api.get<{ id: number; nome: string; idade: number }[]>('/api/pessoas')

    expect(dados).toEqual([{ id: 1, nome: 'Ana', idade: 25 }])
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/pessoas'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })

  it('delete trata 204 sem corpo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('não deve ler corpo em 204')
        },
      })
    )

    await expect(api.delete('/api/pessoas/1')).resolves.toBeUndefined()
  })

  it('lança ApiError com detail do ProblemDetails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          title: 'Violação de regra de negócio',
          detail: 'Menores de 18 anos só podem cadastrar despesas.',
        }),
      })
    )

    const erro = await api.post('/api/transacoes', {}).catch((e) => e)

    expect(erro).toBeInstanceOf(ApiError)
    expect(erro.status).toBe(422)
    expect(erro.message).toBe('Menores de 18 anos só podem cadastrar despesas.')
  })

  it('prioriza erros de validação do FluentValidation quando não há detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          title: 'One or more validation errors occurred.',
          errors: {
            Nome: ['Nome é obrigatório.'],
            Idade: ['Idade deve estar entre 0 e 130.'],
          },
        }),
      })
    )

    const erro = await api.post('/api/pessoas', {}).catch((e) => e)

    expect(erro).toBeInstanceOf(ApiError)
    expect(erro.status).toBe(400)
    expect(erro.message).toContain('Nome é obrigatório.')
    expect(erro.message).toContain('Idade deve estar entre 0 e 130.')
  })
})
