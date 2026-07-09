import { BarChart3, Users, ArrowLeftRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Pagina = "totais" | "pessoas" | "transacoes"

interface SidebarProps {
  paginaAtiva: Pagina
  onNavegar: (pagina: Pagina) => void
}

const ITENS: Array<{ id: Pagina; label: string; Icon: typeof BarChart3 }> = [
  { id: "totais", label: "Totais", Icon: BarChart3 },
  { id: "pessoas", label: "Pessoas", Icon: Users },
  { id: "transacoes", label: "Transações", Icon: ArrowLeftRight },
]

export function Sidebar({ paginaAtiva, onNavegar }: SidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r border-border bg-card p-5">
      <div className="flex items-center gap-3 pb-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary">
          <div className="size-3 rotate-45 rounded-[2px] bg-primary-foreground" />
        </div>
        <span className="font-display text-sm leading-tight font-semibold">
          Gestão de gastos residenciais
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {ITENS.map(({ id, label, Icon }) => {
          const ativo = id === paginaAtiva
          return (
            <Button
              key={id}
              type="button"
              variant="ghost"
              onClick={() => onNavegar(id)}
              className={cn(
                "h-10 w-full justify-start gap-3 rounded-[10px] px-3 text-sm",
                ativo
                  ? "bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                  : "font-medium text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-[18px]" />
              {label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
