"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// Sem next-themes (projeto não usa Next.js): o tema segue a preferência do
// sistema via prefers-color-scheme.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        // Barra lateral de 4px: verde no sucesso, vermelha no erro — reforça
        // visualmente o resultado da ação sem precisar ler o texto. O "!"
        // (important) é necessário porque o CSS interno do sonner define
        // "border" (shorthand) com a mesma especificidade e ordem posterior.
        classNames: {
          title: "font-bold text-sm",
          description: "text-sm text-muted-foreground mt-0.5",
          success: "border-l-4! border-l-success!",
          error: "border-l-4! border-l-destructive!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
