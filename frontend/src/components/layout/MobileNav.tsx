import { NAV_ITENS } from "@/components/layout/nav"
import type { Pagina } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  paginaAtiva: Pagina
  onNavegar: (pagina: Pagina) => void
}

export function MobileNav({ paginaAtiva, onNavegar }: MobileNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1.5">
        {NAV_ITENS.map(({ id, label, Icon }) => {
          const ativo = id === paginaAtiva
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavegar(id)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors",
                ativo ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl transition-colors",
                  ativo && "bg-primary/10"
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
