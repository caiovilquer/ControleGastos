import { cn } from "@/lib/utils"
import type { Insight } from "@/lib/insights"

interface TotaisInsightsProps {
  insights: Insight[]
}

const TOM_CLASS: Record<Insight["tom"], string> = {
  neutro: "border-border bg-muted/60 text-muted-foreground",
  positivo: "border-success/25 bg-success-weak text-success",
  alerta: "border-danger/25 bg-danger-weak text-danger",
  info: "border-warn/30 bg-warn-weak text-warn",
}

export function TotaisInsights({ insights }: TotaisInsightsProps) {
  if (insights.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {insights.map((insight) => (
        <div
          key={insight.texto}
          className={cn(
            "animate-fade-up rounded-xl border px-4 py-3 text-sm leading-relaxed font-medium",
            TOM_CLASS[insight.tom]
          )}
        >
          {insight.texto}
        </div>
      ))}
    </div>
  )
}
