import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PessoaForm } from '@/components/pessoas/PessoaForm'

describe('PessoaForm', () => {
  it('valida nome vazio sem chamar onSubmit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<PessoaForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Idade'), '25')
    await user.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    expect(screen.getByText('Informe o nome.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('valida idade inválida', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<PessoaForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Idade'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    expect(screen.getByText('Idade deve ser um número inteiro.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia dados válidos e limpa o formulário em sucesso', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(true)

    render(<PessoaForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), '  Fernanda Alves  ')
    await user.type(screen.getByLabelText('Idade'), '29')
    await user.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    expect(onSubmit).toHaveBeenCalledWith({ nome: 'Fernanda Alves', idade: 29 })
    expect(screen.getByLabelText('Nome')).toHaveValue('')
    expect(screen.getByLabelText('Idade')).toHaveValue('')
  })

  it('mantém os campos quando onSubmit falha', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(false)

    render(<PessoaForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Idade'), '25')
    await user.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    expect(screen.getByLabelText('Nome')).toHaveValue('Ana')
    expect(screen.getByLabelText('Idade')).toHaveValue('25')
  })
})
