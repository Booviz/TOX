"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Check, Copy, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { ServerRole } from "./types"

type CloneRoleDialogProps = {
  guildId: string
  role: ServerRole | null
  open: boolean
  onClose: () => void
  onCloned: (role: ServerRole) => void
}

type RoleActionResponse = {
  success: boolean
  error?: string
  message?: string
  role?: ServerRole
}

export function CloneRoleDialog({
  guildId,
  role,
  open,
  onClose,
  onCloned,
}: CloneRoleDialogProps) {
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !role) return

    setName(`${role.name} Copy`)
    setSubmitting(false)
    setError(null)
    setSuccess(null)
  }, [open, role])

  async function submit() {
    if (!role || !name.trim()) {
      setError("Role name is required.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/roles`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            roleId: role.id,
            action: "clone",
            name: name.trim(),
            color: role.color,
            hoist: role.hoist,
            mentionable: role.mentionable,
            permissions: role.permissions,
            reason: "Role cloned from TOX dashboard",
          }),
        }
      )

      const data = (await response.json()) as RoleActionResponse

      if (!response.ok || !data.success || !data.role) {
        throw new Error(
          data.error ?? data.message ?? "Failed to clone role."
        )
      }

      setSuccess(data.message ?? "Role cloned successfully.")
      onCloned(data.role)

      window.setTimeout(onClose, 700)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to clone role."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !role) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Copy className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Clone Role</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a copy with the same permissions and display settings.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={submitting}
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="space-y-4 p-6">
          <label className="block">
            <span className="text-xs font-medium">New role name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, 100))}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="rounded-xl border border-border bg-background/40 p-4 text-sm">
            <p className="font-medium">Copying from {role.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {role.permissions.length} permissions will be copied.
            </p>
          </div>

          {error && (
            <div className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3 text-sm text-emerald-300">
              <Check className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="gap-2"
            onClick={() => void submit()}
            disabled={submitting || !name.trim()}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Clone role
          </Button>
        </footer>
      </section>
    </div>
  )
}