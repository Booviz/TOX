import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center",
    "overflow-hidden whitespace-nowrap rounded-xl border text-sm font-semibold",
    "outline-none select-none transition-all duration-200",
    "focus-visible:ring-2 focus-visible:ring-violet-500/50",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg]:transition-transform [&_svg]:duration-200",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-violet-400/20",
          "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
          "text-white shadow-[0_8px_24px_rgba(124,58,237,0.28)]",
          "hover:-translate-y-0.5",
          "hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500",
          "hover:shadow-[0_12px_30px_rgba(124,58,237,0.40)]",
          "active:translate-y-0 active:scale-[0.98]",
          "[&_svg]:text-white",
          "group-hover/button:[&_svg]:scale-110",
        ].join(" "),

        outline: [
          "border-white/10 bg-white/[0.03] text-foreground",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm",
          "hover:-translate-y-0.5 hover:border-violet-500/40",
          "hover:bg-violet-500/10 hover:text-white",
          "hover:shadow-[0_8px_22px_rgba(124,58,237,0.15)]",
          "active:translate-y-0 active:scale-[0.98]",
          "[&_svg]:text-violet-400",
          "group-hover/button:[&_svg]:scale-110",
        ].join(" "),

        secondary: [
          "border-white/5 bg-secondary text-secondary-foreground",
          "hover:-translate-y-0.5 hover:bg-secondary/80 hover:text-white",
          "active:translate-y-0 active:scale-[0.98]",
        ].join(" "),

        ghost: [
          "border-transparent bg-transparent text-muted-foreground",
          "hover:bg-white/[0.05] hover:text-white",
          "active:scale-[0.98]",
        ].join(" "),

        destructive: [
          "border-red-500/20 bg-red-500/10 text-red-400",
          "hover:-translate-y-0.5 hover:border-red-500/35",
          "hover:bg-red-500/20 hover:text-red-300",
          "hover:shadow-[0_8px_22px_rgba(239,68,68,0.15)]",
          "active:translate-y-0 active:scale-[0.98]",
          "focus-visible:ring-red-500/40",
        ].join(" "),

        link: [
          "border-transparent bg-transparent px-0 text-violet-400",
          "shadow-none underline-offset-4",
          "hover:text-violet-300 hover:underline",
        ].join(" "),
      },

      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-7 gap-1.5 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 rounded-xl px-6 text-sm",
        xl: "h-14 gap-3 rounded-2xl px-8 text-base",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }