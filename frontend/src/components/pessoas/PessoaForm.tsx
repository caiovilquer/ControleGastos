import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CriarPessoaInput } from "@/hooks/usePessoas"

interface PessoaFormProps {
  onSubmit: (input: CriarPessoaInput) => Promise<boolean>
}

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
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="pessoa-nome" className="text-sm font-semibold">
          Nome
        </Label>
        <Input
          id="pessoa-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Fernanda Alves"
          disabled={enviando}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pessoa-idade" className="text-sm font-semibold">
          Idade
        </Label>
        <Input
          id="pessoa-idade"
          inputMode="numeric"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Ex.: 29"
          disabled={enviando}
        />
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <Button type="submit" disabled={enviando} className="h-11 w-full rounded-[9px] font-semibold">
        {enviando ? "Salvando..." : "Adicionar pessoa"}
      </Button>
    </form>
  )
}
