import { Moon, Sun } from "lucide-react"

import { BrandMark } from "@/components/shared/BrandMark"
import { Switch } from "@/components/ui/switch"

interface HeaderProps {
  titulo: string
  subtitulo: string
  dark: boolean
  onToggleDark: () => void
}

export function Header({ titulo, subtitulo, dark, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4.5 xl:max-w-[1480px] xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark size="sm" className="md:hidden" />
          <div className="min-w-0">
            <h1 className="font-display truncate text-lg font-semibold sm:text-[22px]">
              {titulo}
            </h1>
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{subtitulo}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {dark ? (
            <Moon className="size-4 text-muted-foreground" />
          ) : (
            <Sun className="size-4 text-muted-foreground" />
          )}
          <Switch
            checked={dark}
            onCheckedChange={onToggleDark}
            aria-label="Alternar tema claro/escuro"
          />
        </div>
      </div>
    </header>
  )
}
