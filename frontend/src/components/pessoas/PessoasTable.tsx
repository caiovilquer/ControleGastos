import { useState } from "react"
import { Users } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar } from "@/components/shared/Avatar"
import { MenorDeIdadeBadge } from "@/components/shared/MenorDeIdadeBadge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Pessoa } from "@/types"

interface PessoasTableProps {
  pessoas: Pessoa[]
  loading: boolean
  onExcluir: (id: number) => Promise<boolean>
  contarTransacoes: (pessoaId: number) => number
}

export function PessoasTable({ pessoas, loading, onExcluir, contarTransacoes }: PessoasTableProps) {
  // Guarda o id em exclusão para desabilitar só o botão daquela linha,
  // não a tabela inteira, enquanto a requisição de DELETE está em voo.
  const [excluindoId, setExcluindoId] = useState<number | null>(null)

  async function handleExcluir(id: number) {
    setExcluindoId(id)
    await onExcluir(id)
    setExcluindoId(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    )
  }

  if (pessoas.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-13 text-center">
        <div className="flex size-13 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Users className="size-[22px]" />
        </div>
        <p className="mt-4 font-display text-base font-semibold">Nenhuma pessoa cadastrada</p>
        <p className="mt-1.5 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
          Use o formulário ao lado para adicionar o primeiro membro da casa.
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
          <TableHead className="w-[110px] px-5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Idade
          </TableHead>
          <TableHead className="w-24 px-5 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pessoas.map((pessoa) => {
          const totalTransacoes = contarTransacoes(pessoa.id)
          return (
            <TableRow key={pessoa.id}>
              <TableCell className="px-5 py-[13px]">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar nome={pessoa.nome} />
                  <span className="truncate text-sm font-semibold whitespace-nowrap">
                    {pessoa.nome}
                  </span>
                  {pessoa.idade < 18 && <MenorDeIdadeBadge />}
                </div>
              </TableCell>
              <TableCell className="px-5 py-[13px] text-right font-mono text-sm text-muted-foreground">
                {pessoa.idade} anos
              </TableCell>
              <TableCell className="px-5 py-[13px] text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={excluindoId === pessoa.id}
                      className="border-border text-danger"
                    >
                      {excluindoId === pessoa.id ? "Excluindo..." : "Excluir"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[452px] overflow-hidden rounded-2xl p-0">
                    <div className="flex gap-4 p-6.5 pb-5.5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-danger-weak font-display text-xl font-bold text-danger">
                        !
                      </div>
                      <div>
                        <AlertDialogTitle className="font-display text-lg font-semibold">
                          Excluir {pessoa.nome}?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          Esta ação também removerá{" "}
                          <strong className="text-danger">
                            {totalTransacoes} transação(ões)
                          </strong>{" "}
                          vinculada(s) a essa pessoa. Não é possível desfazer.
                        </AlertDialogDescription>
                      </div>
                    </div>
                    <AlertDialogFooter className="flex justify-end gap-2.5 border-t border-border bg-muted px-6.5 py-4">
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleExcluir(pessoa.id)}
                        variant="destructive"
                        className="font-semibold"
                      >
                        Excluir tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
