import { ArrowLeftRight } from "lucide-react"

import { Avatar } from "@/components/shared/Avatar"
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
import { cn } from "@/lib/utils"
import type { Transacao } from "@/types"

interface TransacoesTableProps {
  transacoes: Transacao[]
  loading: boolean
}

export function TransacoesTable({ transacoes, loading }: TransacoesTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (transacoes.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-13 text-center">
        <div className="flex size-13 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ArrowLeftRight className="size-[22px]" />
        </div>
        <p className="mt-4 font-display text-base font-semibold">Nenhum lançamento registrado</p>
        <p className="mt-1.5 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
          Registre a primeira receita ou despesa usando o formulário ao lado.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Pessoa
          </TableHead>
          <TableHead className="px-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Descrição
          </TableHead>
          <TableHead className="px-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Tipo
          </TableHead>
          <TableHead className="px-5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Valor
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transacoes.map((transacao) => {
          const receita = transacao.tipo === "Receita"
          return (
            <TableRow key={transacao.id}>
              <TableCell className="max-w-0 px-5 py-[13px]">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar nome={transacao.pessoaNome} size={28} />
                  <span className="truncate text-sm font-semibold whitespace-nowrap">
                    {transacao.pessoaNome}
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-0 truncate px-5 py-[13px] text-sm whitespace-nowrap">
                {transacao.descricao}
              </TableCell>
              <TableCell className="px-5 py-[13px]">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75 text-xs font-semibold",
                    receita ? "bg-success-weak text-success" : "bg-danger-weak text-danger"
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {transacao.tipo}
                </span>
              </TableCell>
              <TableCell
                className={cn(
                  "px-5 py-[13px] text-right font-mono text-[15px] font-semibold tabular-nums",
                  receita ? "text-success" : "text-danger"
                )}
              >
                {formatarMoeda(transacao.valor)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
