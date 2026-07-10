import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TransacoesTable } from "@/components/transacoes/TransacoesTable"
import type { Pessoa, Transacao } from "@/types"

const pessoas: Pessoa[] = [
  { id: 1, nome: "Ana", idade: 30 },
  { id: 2, nome: "Pedro", idade: 15 },
]

const transacoes: Transacao[] = [
  {
    id: 1,
    pessoaId: 1,
    pessoaNome: "Ana",
    descricao: "Salário",
    valor: 3000,
    tipo: "Receita",
  },
  {
    id: 2,
    pessoaId: 1,
    pessoaNome: "Ana",
    descricao: "Aluguel",
    valor: 1200,
    tipo: "Despesa",
  },
  {
    id: 3,
    pessoaId: 2,
    pessoaNome: "Pedro",
    descricao: "Lanche",
    valor: 20,
    tipo: "Despesa",
  },
]

describe("TransacoesTable filtros", () => {
  it("filtra por tipo Despesa", async () => {
    const user = userEvent.setup()
    const props = {
      transacoes,
      loading: false,
      pessoas,
      filtroPessoaId: "todas",
      filtroTipo: "Todos" as const,
      onFiltroPessoaChange: vi.fn(),
      onFiltroTipoChange: vi.fn(),
      onLimparFiltros: vi.fn(),
    }

    const { rerender } = render(<TransacoesTable {...props} />)

    expect(screen.getByText("Salário")).toBeInTheDocument()
    expect(screen.getByText("Lanche")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Despesa" }))
    expect(props.onFiltroTipoChange).toHaveBeenCalledWith("Despesa")

    rerender(<TransacoesTable {...props} filtroTipo="Despesa" />)

    expect(screen.queryByText("Salário")).not.toBeInTheDocument()
    expect(screen.getByText("Aluguel")).toBeInTheDocument()
    expect(screen.getByText("Lanche")).toBeInTheDocument()
  })

  it("filtra por pessoa", async () => {
    const user = userEvent.setup()
    const onFiltroPessoaChange = vi.fn()

    const { rerender } = render(
      <TransacoesTable
        transacoes={transacoes}
        loading={false}
        pessoas={pessoas}
        filtroPessoaId="todas"
        filtroTipo="Todos"
        onFiltroPessoaChange={onFiltroPessoaChange}
        onFiltroTipoChange={vi.fn()}
        onLimparFiltros={vi.fn()}
      />
    )

    await user.click(screen.getByRole("combobox", { name: "Filtrar por pessoa" }))
    const listbox = await screen.findByRole("listbox")
    await user.click(within(listbox).getByRole("option", { name: "Pedro" }))

    expect(onFiltroPessoaChange).toHaveBeenCalledWith("2")

    rerender(
      <TransacoesTable
        transacoes={transacoes}
        loading={false}
        pessoas={pessoas}
        filtroPessoaId="2"
        filtroTipo="Todos"
        onFiltroPessoaChange={onFiltroPessoaChange}
        onFiltroTipoChange={vi.fn()}
        onLimparFiltros={vi.fn()}
      />
    )

    expect(screen.getByText("Lanche")).toBeInTheDocument()
    expect(screen.queryByText("Salário")).not.toBeInTheDocument()
  })
})
