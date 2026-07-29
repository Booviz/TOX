"use client"

import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers3,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import {
  useMemo,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { WelcomeImageCanvas } from "./WelcomeImageCanvas"
import WelcomeImageControls from "./WelcomeImageControls"

import {
  DEFAULT_WELCOME_CANVAS_SETTINGS,
} from "./types"

import type {
  WelcomeImageBuilderProps,
} from "./types"

export function WelcomeImageBuilder({
  value,
  preview,
  disabled = false,
  onChange,
}: WelcomeImageBuilderProps) {
  const [
    selectedTextId,
    setSelectedTextId,
  ] = useState<string | null>(
    value.texts[0]?.id ?? null
  )

  const [zoom, setZoom] =
    useState(100)

  const [fullscreen, setFullscreen] =
    useState(false)

  const enabledTextCount = useMemo(
    () =>
      value.texts.filter(
        (item) => item.enabled
      ).length,
    [value.texts]
  )

  function resetDesigner() {
    onChange({
      ...DEFAULT_WELCOME_CANVAS_SETTINGS,
      enabled: value.enabled,
      avatar: {
        ...DEFAULT_WELCOME_CANVAS_SETTINGS.avatar,
      },
      texts:
        DEFAULT_WELCOME_CANVAS_SETTINGS.texts.map(
          (item) => ({
            ...item,
          })
        ),
    })

    setSelectedTextId(
      DEFAULT_WELCOME_CANVAS_SETTINGS
        .texts[0]?.id ?? null
    )

    setZoom(100)
  }

  function toggleEnabled() {
    onChange({
      ...value,
      enabled: !value.enabled,
    })
  }

  function updateZoom(
    nextZoom: number
  ) {
    setZoom(
      Math.min(
        200,
        Math.max(25, nextZoom)
      )
    )
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card",
        fullscreen &&
          "fixed inset-4 z-[100] flex flex-col shadow-2xl"
      )}
    >
      <header className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ImageIcon className="size-5" />
          </span>

          <div>
            <h3 className="font-semibold">
              Welcome Image Designer
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Build a dynamic welcome image
              using the new member avatar,
              background and custom text
              layers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={disabled}
            onClick={resetDesigner}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              setFullscreen(
                (current) => !current
              )
            }
          >
            {fullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}

            {fullscreen
              ? "Exit"
              : "Fullscreen"}
          </Button>

          <Button
            type="button"
            size="sm"
            className="gap-2"
            disabled={disabled}
            onClick={toggleEnabled}
          >
            {value.enabled ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}

            {value.enabled
              ? "Enabled"
              : "Disabled"}
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="min-h-0 border-b border-border bg-[#070a12] p-4 xl:border-b-0 xl:border-r">
          <div className="flex h-full min-h-[520px] flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Layers3 className="size-4 text-primary" />
                <span>
                  {enabledTextCount} text layers
                </span>
                <span>•</span>
                <span>
                  {value.width} × {value.height}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1">
                <button
                  type="button"
                  onClick={() =>
                    updateZoom(zoom - 25)
                  }
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setZoom(100)
                  }
                  className="min-w-14 rounded-lg px-2 py-1 text-xs font-medium transition hover:bg-muted"
                >
                  {zoom}%
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateZoom(zoom + 25)
                  }
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl border border-white/5 bg-black/20 p-4">
              <div
                className="w-full max-w-5xl origin-center transition-transform"
                style={{
                  transform: `scale(${zoom / 100})`,
                }}
              >
                <WelcomeImageCanvas
                  value={value}
                  preview={preview}
                  disabled={
                    disabled || !value.enabled
                  }
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </main>

        <aside className="min-h-0 overflow-y-auto p-4">
          <WelcomeImageControls
            value={value}
            disabled={
              disabled || !value.enabled
            }
            selectedTextId={selectedTextId}
            onSelectedTextIdChange={
              setSelectedTextId
            }
            onChange={onChange}
          />
        </aside>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border bg-card/95 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          {value.enabled
            ? "The generated image will be attached to the welcome message."
            : "Enable the designer to include a dynamic image in welcome messages."}
        </div>

        <Button
          type="button"
          className="gap-2"
          disabled={
            disabled || !value.enabled
          }
          onClick={() => {
            onChange({
              ...value,
            })
          }}
        >
          <Save className="size-4" />
          Apply design
        </Button>
      </footer>
    </section>
  )
}

export default WelcomeImageBuilder