import { useEffect, useState, type FormEvent } from "react"

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
import { cn } from "@/lib/utils"
import type { Pessoa, TipoTransacao } from "@/types"

interface TransacaoFormProps {
  pessoas: Pessoa[]
  pessoasCarregando: boolean
  onSubmit: (input: CriarTransacaoInput) => Promise<boolean>
}

// Normaliza o valor digitado para o formato "1234.56" aceito por Number().
// Ambiguidade proposital: na dúvida, ponto é decimal. Milhar (pt-BR) só é
// reconhecido quando há uma vírgula decimal presente — ex.: "1.234" sem
// vírgula é tratado como 1.234 (ponto decimal), não como 1234; já
// "1.234,56" tem vírgula, então o ponto é removido como separador de milhar.
function normalizarValor(valor: string): string {
  if (valor.includes(",")) {
    return valor.replace(/\./g, "").replace(",", ".")
  }
  return valor
}

// Validação de formato no cliente; regra de menor só despesa fica no backend.
function validar(pessoaId: string, descricao: string, valor: string): string | null {
  if (!pessoaId) return "Selecione uma pessoa."
  if (descricao.trim().length === 0) return "Informe a descrição."
  if (descricao.length > 200) return "Descrição deve ter no máximo 200 caracteres."

  const valorNormalizado = normalizarValor(valor)
  if (!/^\d+(\.\d{1,2})?$/.test(valorNormalizado)) {
    return "Valor inválido. Use por exemplo 10,50 ou 1.234,56."
  }
  const valorNumero = Number(valorNormalizado)
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

  const pessoaSelecionada = pessoas.find((p) => String(p.id) === pessoaId)
  const pessoaMenorDeIdade = (pessoaSelecionada?.idade ?? 0) < 18 && pessoaSelecionada !== undefined

  // Se trocar para menor com Receita marcada, volta para Despesa.
  useEffect(() => {
    if (pessoaMenorDeIdade && tipo === "Receita") {
      setTipo("Despesa")
    }
  }, [pessoaMenorDeIdade, tipo])

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
      valor: Number(normalizarValor(valor)),
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
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
      {semPessoas && (
        <p className="text-sm text-muted-foreground">
          Cadastre uma pessoa na aba Pessoas antes de lançar transações.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="transacao-pessoa" className="text-sm font-semibold">
          Pessoa
        </Label>
        <Select value={pessoaId} onValueChange={setPessoaId} disabled={enviando || semPessoas}>
          <SelectTrigger id="transacao-pessoa" className="w-full">
            <SelectValue placeholder="Selecione a pessoa" />
          </SelectTrigger>
          <SelectContent>
            {pessoas.map((pessoa) => (
              <SelectItem key={pessoa.id} value={String(pessoa.id)}>
                {pessoa.nome}
                {pessoa.idade < 18 ? ` (${pessoa.idade} anos)` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="transacao-descricao" className="text-sm font-semibold">
          Descrição
        </Label>
        <Input
          id="transacao-descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex.: Conta de água"
          disabled={enviando || semPessoas}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="transacao-valor" className="text-sm font-semibold">
          Valor
        </Label>
        <div className="flex h-9 items-center overflow-hidden rounded-md border border-input bg-transparent focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30">
          <span className="flex h-full items-center border-r border-input px-3 text-sm font-semibold text-muted-foreground">
            R$
          </span>
          <Input
            id="transacao-valor"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            disabled={enviando || semPessoas}
            className="h-full flex-1 border-0 font-mono shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold">Tipo</Label>
        <div className="flex gap-2.5">
          <button
            type="button"
            disabled={enviando || semPessoas}
            onClick={() => setTipo("Despesa")}
            className={cn(
              "h-10 flex-1 rounded-lg border text-sm font-semibold transition-colors",
              tipo === "Despesa"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:bg-muted",
              (enviando || semPessoas) && "cursor-not-allowed opacity-55"
            )}
          >
            Despesa
          </button>
          <button
            type="button"
            disabled={enviando || semPessoas || pessoaMenorDeIdade}
            onClick={() => setTipo("Receita")}
            title={pessoaMenorDeIdade ? "Menores de 18 anos podem registrar apenas despesas" : undefined}
            className={cn(
              "h-10 flex-1 rounded-lg border text-sm font-semibold transition-colors",
              tipo === "Receita"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:bg-muted",
              (enviando || semPessoas || pessoaMenorDeIdade) &&
                "cursor-not-allowed text-muted-foreground opacity-55"
            )}
          >
            Receita
          </button>
        </div>

        {pessoaMenorDeIdade && (
          <div className="flex gap-2.5 rounded-[10px] border border-warn-weak bg-warn-weak p-3">
            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-warn text-xs font-bold text-card">
              !
            </span>
            <span className="text-sm leading-relaxed font-medium text-warn">
              {pessoaSelecionada?.nome} tem {pessoaSelecionada?.idade} anos. Só pode registrar
              despesas.
            </span>
          </div>
        )}
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <Button
        type="submit"
        disabled={enviando || semPessoas}
        className="h-11 w-full rounded-[9px] font-semibold"
      >
        {enviando ? "Salvando..." : "Registrar transação"}
      </Button>
    </form>
  )
}
