import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        // GOV.UK Tag Colors
        grey: "text-[var(--tag-grey-text)] bg-[var(--tag-grey-bg)]",
        green: "text-[var(--tag-green-text)] bg-[var(--tag-green-bg)]",
        turquoise: "text-[var(--tag-turquoise-text)] bg-[var(--tag-turquoise-bg)]",
        blue: "text-[var(--tag-blue-text)] bg-[var(--tag-blue-bg)]",
        "light-blue": "text-[var(--tag-light-blue-text)] bg-[var(--tag-light-blue-bg)]",
        purple: "text-[var(--tag-purple-text)] bg-[var(--tag-purple-bg)]",
        pink: "text-[var(--tag-pink-text)] bg-[var(--tag-pink-bg)]",
        red: "text-[var(--tag-red-text)] bg-[var(--tag-red-bg)]",
        orange: "text-[var(--tag-orange-text)] bg-[var(--tag-orange-bg)]",
        yellow: "text-[var(--tag-yellow-text)] bg-[var(--tag-yellow-bg)]",
        // Monotone variants
        white: "bg-background text-foreground",
        gray: "text-[var(--tag-grey-text)] bg-[var(--tag-grey-bg)]", // Alias for grey
        // Legacy variants
        black: "bg-background text-foreground",
        muted: "bg-muted text-foreground",
      },
      size: {
        default: "px-3 py-1 text-base",
        small: "px-2 py-0.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "muted",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
