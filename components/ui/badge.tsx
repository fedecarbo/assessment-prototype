import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      variant: {
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
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
