import { BarChart3, Users, ArrowLeftRight, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { BrandMark } from "@/components/shared/BrandMark"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Pagina = "totais" | "pessoas" | "transacoes"

interface SidebarProps {
  paginaAtiva: Pagina
  onNavegar: (pagina: Pagina) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

const ITENS: Array<{ id: Pagina; label: string; Icon: typeof BarChart3 }> = [
  { id: "totais", label: "Totais", Icon: BarChart3 },
  { id: "pessoas", label: "Pessoas", Icon: Users },
  { id: "transacoes", label: "Transações", Icon: ArrowLeftRight },
]

export function Sidebar({
  paginaAtiva,
  onNavegar,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 ease-out",
        collapsed ? "w-[72px] px-3 py-5" : "w-[250px] p-5"
      )}
    >
      <div
        className={cn(
          "flex pb-6",
          collapsed ? "flex-col items-center gap-3" : "items-center gap-3"
        )}
      >
        <BrandMark size={collapsed ? "sm" : "md"} />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <span className="font-display block text-[15px] leading-tight font-bold tracking-tight">
              CasaConta
            </span>
            <span className="mt-0.5 block truncate text-[11px] font-medium text-muted-foreground">
              Gastos da casa
            </span>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className={cn(
            "size-8 shrink-0 text-muted-foreground hover:text-foreground",
            collapsed && "mt-0"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
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
              title={collapsed ? label : undefined}
              aria-label={label}
              className={cn(
                "h-10 rounded-[10px] text-sm transition-colors",
                collapsed ? "w-full justify-center px-0" : "w-full justify-start gap-3 px-3",
                ativo
                  ? "bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                  : "font-medium text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Button>
          )
        })}
      </nav>

      {!collapsed && (
        <p className="mt-auto pt-4 text-[11px] leading-relaxed text-muted-foreground">
          Controle de gastos residenciais
        </p>
      )}
    </aside>
  )
}
