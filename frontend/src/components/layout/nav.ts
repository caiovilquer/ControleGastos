import { BarChart3, Users, ArrowLeftRight, type LucideIcon } from "lucide-react"

import type { Pagina } from "@/components/layout/Sidebar"

export const NAV_ITENS: Array<{ id: Pagina; label: string; Icon: LucideIcon }> = [
  { id: "totais", label: "Totais", Icon: BarChart3 },
  { id: "pessoas", label: "Pessoas", Icon: Users },
  { id: "transacoes", label: "Transações", Icon: ArrowLeftRight },
]
