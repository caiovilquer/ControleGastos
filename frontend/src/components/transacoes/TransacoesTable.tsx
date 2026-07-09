import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatarMoeda } from "@/lib/format"
import type { Transacao } from "@/types"

interface TransacoesTableProps {
  transacoes: Transacao[]
  loading: boolean
}

export function TransacoesTable({ transacoes, loading }: TransacoesTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (transacoes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma transação cadastrada.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Pessoa</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transacoes.map((transacao) => (
          <TableRow key={transacao.id}>
            <TableCell>{transacao.id}</TableCell>
            <TableCell>{transacao.pessoaNome}</TableCell>
            <TableCell>{transacao.descricao}</TableCell>
            <TableCell>
              <Badge variant={transacao.tipo === "Receita" ? "default" : "destructive"}>
                {transacao.tipo}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{formatarMoeda(transacao.valor)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
