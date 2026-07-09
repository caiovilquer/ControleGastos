import { iniciais } from "@/lib/format"
import { cn } from "@/lib/utils"

interface AvatarProps {
  nome: string
  size?: 28 | 32
}

export function Avatar({ nome, size = 32 }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[9px] bg-primary/10 font-display font-bold text-primary",
        size === 32 ? "size-8 text-xs" : "size-7 text-[11px]"
      )}
    >
      {iniciais(nome)}
    </div>
  )
}
