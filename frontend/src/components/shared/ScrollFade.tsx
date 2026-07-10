import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ScrollFadeProps {
  children: ReactNode
  className?: string
}

// Fade na borda direita (e esquerda, se já rolou) para sinalizar que a
// tabela continua além da viewport — comum em mobile com colunas extras.
export function ScrollFade({ children, className }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [podeEsquerda, setPodeEsquerda] = useState(false)
  const [podeDireita, setPodeDireita] = useState(false)

  const atualizar = useCallback(() => {
    const el = ref.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const overflow = scrollWidth - clientWidth > 2
    setPodeEsquerda(overflow && scrollLeft > 2)
    setPodeDireita(overflow && scrollLeft + clientWidth < scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    atualizar()
    el.addEventListener("scroll", atualizar, { passive: true })

    const ro = new ResizeObserver(atualizar)
    ro.observe(el)
    // Recalcula quando o conteúdo interno muda de largura.
    if (el.firstElementChild) ro.observe(el.firstElementChild)

    return () => {
      el.removeEventListener("scroll", atualizar)
      ro.disconnect()
    }
  }, [atualizar])

  return (
    <div className={cn("relative min-w-0", className)}>
      <div ref={ref} className="w-full overflow-x-auto" data-slot="scroll-fade-viewport">
        {children}
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent transition-opacity duration-200",
          podeEsquerda ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card via-card/80 to-transparent transition-opacity duration-200",
          // Leve “blur” visual: camada extra semi-opaca reforça o corte.
          podeDireita ? "opacity-100" : "opacity-0"
        )}
      />
      {podeDireita && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-6 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_left,black,transparent)]"
        />
      )}
    </div>
  )
}
