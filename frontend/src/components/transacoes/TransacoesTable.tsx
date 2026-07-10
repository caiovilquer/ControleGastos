import { useMemo } from "react"
import { ArrowLeftRight } from "lucide-react"

import { Avatar } from "@/components/shared/Avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { Pessoa, TipoTransacao, Transacao } from "@/types"

export type FiltroTipo = "Todos" | TipoTransacao

interface TransacoesTableProps {
  transacoes: Transacao[]
  loading: boolean
  pessoas: Pessoa[]
  filtroPessoaId: string
  filtroTipo: FiltroTipo
  onFiltroPessoaChange: (value: string) => void
  onFiltroTipoChange: (value: FiltroTipo) => void
  onLimparFiltros: () => void
}

const TIPOS: FiltroTipo[] = ["Todos", "Receita", "Despesa"]

export function TransacoesTable({
  transacoes,
  loading,
  pessoas,
  filtroPessoaId,
  filtroTipo,
  onFiltroPessoaChange,
  onFiltroTipoChange,
  onLimparFiltros,
}: TransacoesTableProps) {
  const filtradas = useMemo(() => {
    return transacoes.filter((t) => {
      const pessoaOk = filtroPessoaId === "todas" || String(t.pessoaId) === filtroPessoaId
      const tipoOk = filtroTipo === "Todos" || t.tipo === filtroTipo
      return pessoaOk && tipoOk
    })
  }, [transacoes, filtroPessoaId, filtroTipo])

  const filtrosAtivos = filtroPessoaId !== "todas" || filtroTipo !== "Todos"

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-5 py-3.5">
        <Select value={filtroPessoaId} onValueChange={onFiltroPessoaChange}>
          <SelectTrigger className="h-9 w-[180px]" aria-label="Filtrar por pessoa">
            <SelectValue placeholder="Todas as pessoas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as pessoas</SelectItem>
            {pessoas.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1.5">
          {TIPOS.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => onFiltroTipoChange(tipo)}
              className={cn(
                "h-9 rounded-lg border px-3 text-xs font-semibold transition-colors",
                filtroTipo === tipo
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {tipo}
            </button>
          ))}
        </div>

        {filtrosAtivos && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onLimparFiltros}
            className="ml-auto text-muted-foreground"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 px-5 py-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-13 text-center">
          <div className="flex size-13 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ArrowLeftRight className="size-[22px]" />
          </div>
          <p className="mt-4 font-display text-base font-semibold">
            {transacoes.length === 0
              ? "Nenhum lançamento registrado"
              : "Nenhum lançamento com esses filtros"}
          </p>
          <p className="mt-1.5 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
            {transacoes.length === 0
              ? "Registre a primeira receita ou despesa usando o formulário ao lado."
              : "Ajuste pessoa ou tipo, ou limpe os filtros para ver todos os lançamentos."}
          </p>
          {filtrosAtivos && (
            <Button type="button" variant="outline" className="mt-4" onClick={onLimparFiltros}>
              Limpar filtros
            </Button>
          )}
        </div>
      ) : (
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
            {filtradas.map((transacao) => {
              const receita = transacao.tipo === "Receita"
              return (
                <TableRow key={transacao.id} className="animate-page-in">
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
      )}
    </div>
  )
}
