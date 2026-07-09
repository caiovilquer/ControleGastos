import { Moon, Sun } from "lucide-react"

import { Switch } from "@/components/ui/switch"

interface HeaderProps {
  titulo: string
  subtitulo: string
  dark: boolean
  onToggleDark: () => void
}

export function Header({ titulo, subtitulo, dark, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background px-8 py-4.5">
      <div>
        <h1 className="font-display text-[22px] font-semibold">{titulo}</h1>
        <p className="text-sm text-muted-foreground">{subtitulo}</p>
      </div>

      <div className="flex items-center gap-2.5">
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
    </header>
  )
}
