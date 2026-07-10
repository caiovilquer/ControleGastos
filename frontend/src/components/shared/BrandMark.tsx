import { cn } from "@/lib/utils"

interface BrandMarkProps {
  className?: string
  size?: "sm" | "md"
}

// Marca visual da CasaConta: casinha em teal, usada na sidebar e favicon.
export function BrandMark({ className, size = "md" }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-sm",
        size === "md" ? "size-9" : "size-8",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={size === "md" ? "size-5" : "size-4"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 11.5L12 5l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-7.5z"
          fill="currentColor"
          opacity="0.95"
        />
        <rect x="10" y="13.5" width="4" height="7" rx="0.8" className="fill-primary" />
      </svg>
    </div>
  )
}
