"use client"

import {
  FlaskConical,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import type {
  WelcomeToolbarProps,
} from "./types"

export function WelcomeToolbar({
  guildName,
  saving,
  testing,
  hasChanges,
  onSave,
  onTest,
}: WelcomeToolbarProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            Welcome
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure welcome, goodbye and direct messages for {guildName}.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={testing}
          onClick={onTest}
        >
          {testing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FlaskConical className="size-4" />
          )}
          Test welcome
        </Button>

        <Button
          type="button"
          className="gap-2"
          disabled={saving || !hasChanges}
          onClick={onSave}
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save changes
        </Button>
      </div>
    </header>
  )
}
