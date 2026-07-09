import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePessoas } from "@/hooks/usePessoas"

import { PessoaForm } from "./PessoaForm"
import { PessoasTable } from "./PessoasTable"

export function PessoasPage() {
  const { pessoas, loading, criar, excluir } = usePessoas()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pessoas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <PessoaForm onSubmit={criar} />
        <PessoasTable pessoas={pessoas} loading={loading} onExcluir={excluir} />
      </CardContent>
    </Card>
  )
}
