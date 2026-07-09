import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatarMoeda } from "@/lib/format"
import type { TotaisGeral } from "@/types"

interface TotaisTableProps {
  totais: TotaisGeral | null
  loading: boolean
}

// Verde para saldo positivo, vermelho para negativo, cor neutra em zero —
// não é erro, só reflete se a pessoa gastou mais do que recebeu.
function corSaldo(saldo: number): string {
  if (saldo > 0) return "text-emerald-600 dark:text-emerald-500"
  if (saldo < 0) return "text-destructive"
  return "text-foreground"
}

export function TotaisTable({ totais, loading }: TotaisTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (!totais || totais.pessoas.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma pessoa cadastrada. Cadastre pessoas e transações nas outras
        abas para ver os totais aqui.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Total de Receitas</TableHead>
          <TableHead className="text-right">Total de Despesas</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {totais.pessoas.map((pessoa) => (
          <TableRow key={pessoa.id}>
            <TableCell>{pessoa.nome}</TableCell>
            <TableCell className="text-right">{formatarMoeda(pessoa.totalReceitas)}</TableCell>
            <TableCell className="text-right">{formatarMoeda(pessoa.totalDespesas)}</TableCell>
            <TableCell className={cn("text-right font-medium", corSaldo(pessoa.saldo))}>
              {formatarMoeda(pessoa.saldo)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/*
        Os totais gerais vêm prontos do backend (TotaisGeralResponse) e são
        apenas exibidos aqui — o cálculo é responsabilidade da API, nunca
        recalculado no frontend, para não haver dois lugares divergentes
        somando os mesmos números.
      */}
      <TableFooter>
        <TableRow>
          <TableCell className="font-semibold">TOTAL GERAL</TableCell>
          <TableCell className="text-right font-semibold">
            {formatarMoeda(totais.totalReceitas)}
          </TableCell>
          <TableCell className="text-right font-semibold">
            {formatarMoeda(totais.totalDespesas)}
          </TableCell>
          <TableCell className={cn("text-right font-semibold", corSaldo(totais.saldo))}>
            {formatarMoeda(totais.saldo)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
