import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CriarTransacaoInput } from "@/hooks/useTransacoes"
import type { Pessoa, TipoTransacao } from "@/types"

interface TransacaoFormProps {
  pessoas: Pessoa[]
  pessoasCarregando: boolean
  onSubmit: (input: CriarTransacaoInput) => Promise<boolean>
}

// Validação de formato no cliente. A regra de negócio (menor de idade só
// pode despesa) fica só no backend nesta tarefa — aqui só checamos que os
// campos estão preenchidos e a forma do valor é válida.
function validar(pessoaId: string, descricao: string, valor: string): string | null {
  if (!pessoaId) return "Selecione uma pessoa."
  if (descricao.trim().length === 0) return "Informe a descrição."
  if (descricao.length > 200) return "Descrição deve ter no máximo 200 caracteres."

  if (!/^\d+([.,]\d{1,2})?$/.test(valor)) return "Valor inválido. Use números e centavos (ex.: 10,50)."
  const valorNumero = Number(valor.replace(",", "."))
  if (valorNumero <= 0) return "Valor deve ser maior que zero."

  return null
}

export function TransacaoForm({ pessoas, pessoasCarregando, onSubmit }: TransacaoFormProps) {
  const [pessoaId, setPessoaId] = useState("")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa")
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const semPessoas = !pessoasCarregando && pessoas.length === 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const mensagemErro = validar(pessoaId, descricao, valor)
    if (mensagemErro) {
      setErro(mensagemErro)
      return
    }

    setErro(null)
    setEnviando(true)
    const sucesso = await onSubmit({
      pessoaId: Number(pessoaId),
      descricao: descricao.trim(),
      valor: Number(valor.replace(",", ".")),
      tipo,
    })
    setEnviando(false)

    if (sucesso) {
      setDescricao("")
      setValor("")
      setTipo("Despesa")
      // Mantém a pessoa selecionada: é comum lançar várias transações
      // seguidas para a mesma pessoa.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {semPessoas && (
        <p className="text-sm text-muted-foreground">
          Cadastre uma pessoa na aba Pessoas antes de lançar transações.
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="transacao-pessoa">Pessoa</Label>
          <Select
            value={pessoaId}
            onValueChange={setPessoaId}
            disabled={enviando || semPessoas}
          >
            <SelectTrigger id="transacao-pessoa" className="w-full">
              <SelectValue placeholder="Selecione uma pessoa" />
            </SelectTrigger>
            <SelectContent>
              {pessoas.map((pessoa) => (
                <SelectItem key={pessoa.id} value={String(pessoa.id)}>
                  {pessoa.nome} ({pessoa.idade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="transacao-descricao">Descrição</Label>
          <Input
            id="transacao-descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            disabled={enviando || semPessoas}
          />
        </div>

        <div className="flex w-32 flex-col gap-2">
          <Label htmlFor="transacao-valor">Valor</Label>
          <Input
            id="transacao-valor"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            disabled={enviando || semPessoas}
          />
        </div>

        <div className="flex w-36 flex-col gap-2">
          <Label htmlFor="transacao-tipo">Tipo</Label>
          <Select
            value={tipo}
            onValueChange={(v) => setTipo(v as TipoTransacao)}
            disabled={enviando || semPessoas}
          >
            <SelectTrigger id="transacao-tipo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Despesa">Despesa</SelectItem>
              <SelectItem value="Receita">Receita</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={enviando || semPessoas}>
          {enviando ? "Salvando..." : "Adicionar"}
        </Button>
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}
    </form>
  )
}
