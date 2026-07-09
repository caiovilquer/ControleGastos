import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CriarPessoaInput } from "@/hooks/usePessoas"

interface PessoaFormProps {
  onSubmit: (input: CriarPessoaInput) => Promise<boolean>
}

// Validação de formato no cliente é só uma primeira barreira de UX; o
// backend (FluentValidation) continua sendo a fonte de verdade das regras.
function validar(nome: string, idade: string): string | null {
  if (nome.trim().length === 0) return "Informe o nome."
  if (nome.length > 100) return "Nome deve ter no máximo 100 caracteres."

  if (!/^\d+$/.test(idade)) return "Idade deve ser um número inteiro."
  const idadeNumero = Number(idade)
  if (idadeNumero < 0 || idadeNumero > 130) return "Idade deve estar entre 0 e 130."

  return null
}

export function PessoaForm({ onSubmit }: PessoaFormProps) {
  const [nome, setNome] = useState("")
  const [idade, setIdade] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const mensagemErro = validar(nome, idade)
    if (mensagemErro) {
      setErro(mensagemErro)
      return
    }

    setErro(null)
    setEnviando(true)
    const sucesso = await onSubmit({ nome: nome.trim(), idade: Number(idade) })
    setEnviando(false)

    if (sucesso) {
      setNome("")
      setIdade("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="pessoa-nome">Nome</Label>
        <Input
          id="pessoa-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da pessoa"
          disabled={enviando}
        />
      </div>

      <div className="flex w-32 flex-col gap-2">
        <Label htmlFor="pessoa-idade">Idade</Label>
        <Input
          id="pessoa-idade"
          inputMode="numeric"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
          disabled={enviando}
        />
      </div>

      <Button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Adicionar"}
      </Button>

      {erro && <p className="text-sm text-destructive sm:basis-full">{erro}</p>}
    </form>
  )
}
