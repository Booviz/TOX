"use client"

import { Check, Minus, Shield, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type PermissionState = "allow" | "deny" | "neutral"

export type PermissionCardProps = {
  title: string
  description?: string
  value: PermissionState
  disabled?: boolean
  onChange: (value: PermissionState) => void
}

export function PermissionCard({
  title,
  description,
  value,
  disabled = false,
  onChange,
}: PermissionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>

          <div>
            <h4 className="font-medium">{title}</h4>

            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <PermissionButton
            active={value === "allow"}
            color="green"
            disabled={disabled}
            onClick={() => onChange("allow")}
          >
            <Check className="h-4 w-4" />
          </PermissionButton>

          <PermissionButton
            active={value === "neutral"}
            color="gray"
            disabled={disabled}
            onClick={() => onChange("neutral")}
          >
            <Minus className="h-4 w-4" />
          </PermissionButton>

          <PermissionButton
            active={value === "deny"}
            color="red"
            disabled={disabled}
            onClick={() => onChange("deny")}
          >
            <X className="h-4 w-4" />
          </PermissionButton>
        </div>
      </div>
    </div>
  )
}

function PermissionButton({
  active,
  color,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  color: "green" | "red" | "gray"
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition",
        color === "green" &&
          (active
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-border hover:border-emerald-500"),
        color === "red" &&
          (active
            ? "border-red-500 bg-red-500 text-white"
            : "border-border hover:border-red-500"),
        color === "gray" &&
          (active
            ? "border-primary bg-primary text-white"
            : "border-border hover:border-primary"),
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  )
}