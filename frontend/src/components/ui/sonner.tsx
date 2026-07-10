"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

// theme="system": sem next-themes neste projeto Vite.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <div
      // Clique em qualquer área do toast fecha (útil no mobile, sem depender do X).
      onClick={(event) => {
        const alvo = event.target as HTMLElement | null
        if (!alvo?.closest("[data-sonner-toast]")) return
        toast.dismiss()
      }}
    >
      <Sonner
        theme="system"
        className="toaster group"
        closeButton
        // Acima da MobileNav (~4.5rem) para o toast não ficar escondido atrás dela.
        mobileOffset={{ bottom: 80 }}
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
          closeButtonAriaLabel: "Fechar",
          // !important: o CSS do sonner redefine "border" com mesma especificidade.
          classNames: {
            toast: "cursor-pointer",
            title: "font-bold text-sm",
            description: "text-sm text-muted-foreground mt-0.5",
            success: "border-l-4! border-l-success!",
            error: "border-l-4! border-l-destructive!",
          },
        }}
        {...props}
      />
    </div>
  )
}

export { Toaster }
