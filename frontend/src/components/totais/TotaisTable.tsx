import { Avatar } from "@/components/shared/Avatar"
import { MenorDeIdadeBadge } from "@/components/shared/MenorDeIdadeBadge"
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
import { formatarMoeda, formatarSaldo } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { TotaisGeral } from "@/types"

interface TotaisTableProps {
  totais: TotaisGeral | null
  loading: boolean
  idadePorPessoa: Map<number, number>
}

// success (saldo positivo) / danger (negativo) / foreground (zero) — não é
// erro, só reflete se a pessoa gastou mais do que recebeu.
function corSaldo(saldo: number): string {
  if (saldo > 0) return "text-success"
  if (saldo < 0) return "text-danger"
  return "text-foreground"
}

export function TotaisTable({ totais, loading, idadePorPessoa }: TotaisTableProps) {
  if (loading || !totais) {
    return (
      <div className="flex flex-col gap-2 px-5 py-4">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
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
          <TableHead className="px-5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Receitas
          </TableHead>
          <TableHead className="px-5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Despesas
          </TableHead>
          <TableHead className="px-5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Saldo
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {totais.pessoas.map((pessoa) => {
          const menorDeIdade = (idadePorPessoa.get(pessoa.id) ?? 18) < 18
          return (
            <TableRow key={pessoa.id}>
              <TableCell className="px-5 py-[13px]">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar nome={pessoa.nome} />
                  <span className="truncate text-sm font-semibold whitespace-nowrap">
                    {pessoa.nome}
                  </span>
                  {menorDeIdade && <MenorDeIdadeBadge />}
                </div>
              </TableCell>
              <TableCell className="px-5 py-[13px] text-right font-mono text-[15px] font-semibold tabular-nums text-success">
                {formatarMoeda(pessoa.totalReceitas)}
              </TableCell>
              <TableCell className="px-5 py-[13px] text-right font-mono text-[15px] font-semibold tabular-nums text-danger">
                {formatarMoeda(pessoa.totalDespesas)}
              </TableCell>
              <TableCell
                className={cn(
                  "px-5 py-[13px] text-right font-mono text-[15px] font-bold tabular-nums",
                  corSaldo(pessoa.saldo)
                )}
              >
                {formatarSaldo(pessoa.saldo)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      {/*
        Os totais gerais vêm prontos do backend (TotaisGeralResponse) e são
        apenas exibidos aqui — o cálculo é responsabilidade da API, nunca
        recalculado no frontend, para não haver dois lugares divergentes
        somando os mesmos números.
      */}
      <TableFooter className="border-t-2 border-border bg-muted">
        <TableRow className="hover:bg-transparent">
          <TableCell className="px-5 py-[13px] text-sm font-bold">Total geral</TableCell>
          <TableCell className="px-5 py-[13px] text-right font-mono text-[15px] font-semibold tabular-nums text-success">
            {formatarMoeda(totais.totalReceitas)}
          </TableCell>
          <TableCell className="px-5 py-[13px] text-right font-mono text-[15px] font-semibold tabular-nums text-danger">
            {formatarMoeda(totais.totalDespesas)}
          </TableCell>
          <TableCell
            className={cn(
              "px-5 py-[13px] text-right font-mono text-base font-bold tabular-nums",
              corSaldo(totais.saldo)
            )}
          >
            {formatarSaldo(totais.saldo)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
