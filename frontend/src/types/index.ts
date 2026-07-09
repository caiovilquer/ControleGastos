// Tipos espelhando os DTOs de resposta do backend (ControleGastos.Api/DTOs).

export type TipoTransacao = "Despesa" | "Receita"

export interface Pessoa {
  id: number
  nome: string
  idade: number
}

export interface Transacao {
  id: number
  pessoaId: number
  pessoaNome: string
  descricao: string
  valor: number
  tipo: TipoTransacao
}

export interface TotaisPessoa {
  id: number
  nome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface TotaisGeral {
  pessoas: TotaisPessoa[]
  totalReceitas: number
  totalDespesas: number
  saldo: number
}
