"use client"

import { Copy, Sparkles } from "lucide-react"

import type {
  WelcomeVariablesProps,
  WelcomeVariable,
} from "./types"

const VARIABLES: WelcomeVariable[] = [
  { token:"{username}", label:"Username", description:"Member username", example:"Mohammed"},
  { token:"{mention}", label:"Mention", description:"Mention the member", example:"@Mohammed"},
  { token:"{server}", label:"Server", description:"Server name", example:"TOX Community"},
  { token:"{memberCount}", label:"Member Count", description:"Current member count", example:"1523"},
  { token:"{userAvatar}", label:"User Avatar", description:"Member avatar URL", example:"https://..."},
  { token:"{serverIcon}", label:"Server Icon", description:"Server icon URL", example:"https://..."},
]

export function WelcomeVariables({
  onInsert,
}: WelcomeVariablesProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary"/>
        <h3 className="font-semibold">Variables</h3>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Click any variable to insert it into your welcome message.
      </p>

      <div className="mt-5 space-y-3">
        {VARIABLES.map((item)=>(
          <button
            key={item.token}
            type="button"
            onClick={()=>onInsert(item.token)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 text-left transition hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
              <code className="mt-2 inline-block rounded bg-muted px-2 py-1 text-[11px]">
                {item.token}
              </code>
            </div>

            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Copy className="size-3.5"/>
              Insert
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}