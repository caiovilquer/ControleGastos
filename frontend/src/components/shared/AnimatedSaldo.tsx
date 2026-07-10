import { useEffect, useRef, useState } from "react"

import { formatarSaldo } from "@/lib/format"
import { cn } from "@/lib/utils"

interface AnimatedSaldoProps {
  valor: number
  className?: string
  durationMs?: number
}

// Contagem rápida do saldo ao montar / mudar o valor — presença sem
// distrair. Usa ease-out para desacelerar no final.
export function AnimatedSaldo({ valor, className, durationMs = 700 }: AnimatedSaldoProps) {
  const [exibido, setExibido] = useState(0)
  const inicioRef = useRef<number | null>(null)
  const deRef = useRef(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const de = deRef.current
    const para = valor
    inicioRef.current = null

    const tick = (agora: number) => {
      if (inicioRef.current === null) inicioRef.current = agora
      const t = Math.min(1, (agora - inicioRef.current) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const atual = de + (para - de) * eased
      setExibido(atual)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        deRef.current = para
        setExibido(para)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [valor, durationMs])

  return (
    <span className={cn("tabular-nums", className)}>{formatarSaldo(exibido)}</span>
  )
}
