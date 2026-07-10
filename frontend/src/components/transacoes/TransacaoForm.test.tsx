import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TransacaoForm } from '@/components/transacoes/TransacaoForm'
import type { Pessoa } from '@/types'

const adulta: Pessoa = { id: 1, nome: 'Fernanda', idade: 29 }
const menor: Pessoa = { id: 2, nome: 'Pedro', idade: 15 }

async function selecionarPessoa(user: ReturnType<typeof userEvent.setup>, nome: RegExp | string) {
  await user.click(screen.getByRole('combobox'))
  const listbox = await screen.findByRole('listbox')
  await user.click(within(listbox).getByRole('option', { name: nome }))
}

describe('TransacaoForm', () => {
  it('mostra aviso e desabilita Receita quando a pessoa é menor de idade', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(true)

    render(
      <TransacaoForm
        pessoas={[adulta, menor]}
        pessoasCarregando={false}
        onSubmit={onSubmit}
      />
    )

    await selecionarPessoa(user, /Pedro \(15 anos\)/)

    expect(
      screen.getByText(/Pedro tem 15 anos\. Só pode registrar despesas\./)
    ).toBeInTheDocument()

    const botaoReceita = screen.getByRole('button', { name: 'Receita' })
    expect(botaoReceita).toBeDisabled()
  })

  it('volta automaticamente para Despesa se Receita estava selecionada e a pessoa muda para menor', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(true)

    render(
      <TransacaoForm
        pessoas={[adulta, menor]}
        pessoasCarregando={false}
        onSubmit={onSubmit}
      />
    )

    await selecionarPessoa(user, 'Fernanda')
    await user.click(screen.getByRole('button', { name: 'Receita' }))

    await selecionarPessoa(user, /Pedro \(15 anos\)/)

    expect(screen.getByRole('button', { name: 'Receita' })).toBeDisabled()
    expect(screen.getByText(/Só pode registrar despesas/)).toBeInTheDocument()
  })

  it('envia despesa de menor com sucesso', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(true)

    render(
      <TransacaoForm
        pessoas={[menor]}
        pessoasCarregando={false}
        onSubmit={onSubmit}
      />
    )

    await selecionarPessoa(user, /Pedro \(15 anos\)/)
    await user.type(screen.getByLabelText('Descrição'), 'Lanche')
    await user.type(screen.getByLabelText('Valor'), '15,50')
    await user.click(screen.getByRole('button', { name: 'Registrar transação' }))

    expect(onSubmit).toHaveBeenCalledWith({
      pessoaId: 2,
      descricao: 'Lanche',
      valor: 15.5,
      tipo: 'Despesa',
    })
  })

  it('bloqueia envio sem pessoa selecionada', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <TransacaoForm
        pessoas={[adulta]}
        pessoasCarregando={false}
        onSubmit={onSubmit}
      />
    )

    await user.type(screen.getByLabelText('Descrição'), 'Conta')
    await user.type(screen.getByLabelText('Valor'), '10')
    await user.click(screen.getByRole('button', { name: 'Registrar transação' }))

    expect(screen.getByText('Selecione uma pessoa.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('mostra orientação quando não há pessoas cadastradas', () => {
    render(
      <TransacaoForm pessoas={[]} pessoasCarregando={false} onSubmit={vi.fn()} />
    )

    expect(
      screen.getByText('Cadastre uma pessoa na aba Pessoas antes de lançar transações.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar transação' })).toBeDisabled()
  })
})
