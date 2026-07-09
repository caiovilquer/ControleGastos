import { useState } from "react"

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
}

export function PessoasTable({ pessoas, loading, onExcluir }: PessoasTableProps) {
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
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (pessoas.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma pessoa cadastrada.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Idade</TableHead>
          <TableHead className="text-right">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pessoas.map((pessoa) => (
          <TableRow key={pessoa.id}>
            <TableCell>{pessoa.id}</TableCell>
            <TableCell>{pessoa.nome}</TableCell>
            <TableCell>{pessoa.idade}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                disabled={excluindoId === pessoa.id}
                onClick={() => handleExcluir(pessoa.id)}
              >
                {excluindoId === pessoa.id ? "Excluindo..." : "Excluir"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
