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
    <div className="flex w-full min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-5">
      <Card className="w-full min-w-0 rounded-2xl p-4 shadow-sm sm:min-w-[280px] sm:flex-[0_1_340px] sm:p-5.5">
        <CardTitle className="font-display text-base font-semibold">Adicionar pessoa</CardTitle>
        <CardDescription className="text-sm">Cadastre um membro da residência</CardDescription>
        <PessoaForm onSubmit={criar} />
      </Card>

      <Card className="w-full min-w-0 overflow-hidden rounded-2xl shadow-sm sm:flex-[1_1_480px]">
        <CardHeader className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5 sm:py-4.5">
          <CardTitle className="font-display text-base font-semibold">Membros</CardTitle>
          <span className="text-sm font-semibold text-muted-foreground">
            {pessoas.length} cadastrados
          </span>
        </CardHeader>
        <CardContent className="min-w-0 p-0">
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
