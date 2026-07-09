import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePessoas } from "@/hooks/usePessoas"
import { useTransacoes } from "@/hooks/useTransacoes"

import { PessoaForm } from "./PessoaForm"
import { PessoasTable } from "./PessoasTable"

export function PessoasPage() {
  const { pessoas, loading, criar, excluir } = usePessoas()
  // Reutilizado só para contar quantas transações cada pessoa tem, exibido
  // no dialog de confirmação de exclusão (peso visual da regra de cascade).
  const { transacoes } = useTransacoes()

  function contarTransacoes(pessoaId: number) {
    return transacoes.filter((t) => t.pessoaId === pessoaId).length
  }

  return (
    <div className="flex max-w-[1120px] flex-wrap items-start gap-5">
      <Card className="min-w-[280px] flex-[0_1_340px] rounded-2xl p-5.5 shadow-sm">
        <CardTitle className="font-display text-base font-semibold">Adicionar pessoa</CardTitle>
        <CardDescription className="text-sm">Cadastre um membro da residência</CardDescription>
        <PessoaForm onSubmit={criar} />
      </Card>

      <Card className="min-w-0 flex-[1_1_480px] overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="flex items-center justify-between border-b border-border px-5 py-4.5">
          <CardTitle className="font-display text-base font-semibold">Membros</CardTitle>
          <span className="text-sm font-semibold text-muted-foreground">
            {pessoas.length} cadastrados
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <PessoasTable
            pessoas={pessoas}
            loading={loading}
            onExcluir={excluir}
            contarTransacoes={contarTransacoes}
          />
        </CardContent>
      </Card>
    </div>
  )
}
