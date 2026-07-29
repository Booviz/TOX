"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams } from "next/navigation"
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { DirectMessageTab } from "@/components/dashboard/welcome/DirectMessageTab"
import { GoodbyeMessageTab } from "@/components/dashboard/welcome/GoodbyeMessageTab"
import { SettingsTab } from "@/components/dashboard/welcome/SettingsTab"
import { TestWelcomeDialog } from "@/components/dashboard/welcome/TestWelcomeDialog"
import { WelcomeMessageTab } from "@/components/dashboard/welcome/WelcomeMessageTab"
import { WelcomePreview } from "@/components/dashboard/welcome/WelcomePreview"
import { WelcomeSidebar } from "@/components/dashboard/welcome/WelcomeSidebar"
import { WelcomeToolbar } from "@/components/dashboard/welcome/WelcomeToolbar"
import { WelcomeVariables } from "@/components/dashboard/welcome/WelcomeVariables"

import {
  DEFAULT_WELCOME_SETTINGS,
} from "@/components/dashboard/welcome/types"

import type {
  TestWelcomePayload,
  WelcomeApiResponse,
  WelcomePreviewData,
  WelcomeSettings,
  WelcomeTab,
} from "@/components/dashboard/welcome/types"

const FALLBACK_PREVIEW: WelcomePreviewData = {
  member: {
    id: "1",
    username: "Mohammed",
    displayName: "Mohammed",
    mention: "@Mohammed",
    avatarUrl:
      "https://cdn.discordapp.com/embed/avatars/0.png",
    joinedAt: new Date().toISOString(),
  },
  server: {
    id: "1",
    name: "TOX Community",
    iconUrl: "",
    memberCount: 1523,
  },
  channelName: "#welcome",
}

export default function WelcomePage() {
  const params = useParams<{
    guildId: string
  }>()

  const guildId = params.guildId

  const [activeTab, setActiveTab] =
    useState<WelcomeTab>("welcome")

  const [settings, setSettings] =
    useState<WelcomeSettings>({
      ...DEFAULT_WELCOME_SETTINGS,
      guildId,
    })

  const [savedSettings, setSavedSettings] =
    useState<WelcomeSettings>({
      ...DEFAULT_WELCOME_SETTINGS,
      guildId,
    })

  const [channels, setChannels] =
    useState<
      NonNullable<
        WelcomeApiResponse["channels"]
      >
    >([])

  const [roles, setRoles] =
    useState<
      NonNullable<
        WelcomeApiResponse["roles"]
      >
    >([])

  const [preview, setPreview] =
    useState<WelcomePreviewData>(
      FALLBACK_PREVIEW
    )

  const [guildName, setGuildName] =
    useState("Discord server")

  const [loading, setLoading] =
    useState(true)
  const [saving, setSaving] =
    useState(false)
  const [testing, setTesting] =
    useState(false)
  const [testOpen, setTestOpen] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)
  const [success, setSuccess] =
    useState<string | null>(null)

  const loadWelcome =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/dashboard/${guildId}/welcome`,
          {
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        )

        const data =
          (await response.json()) as WelcomeApiResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ??
              data.message ??
              "Failed to load welcome settings."
          )
        }

        const incomingSettings =
          data.settings ?? null

        const nextSettings = {
          ...DEFAULT_WELCOME_SETTINGS,
          ...(incomingSettings ?? {}),
          guildId,

          welcome: {
            ...DEFAULT_WELCOME_SETTINGS.welcome,
            ...(incomingSettings?.welcome ?? {}),

            embed: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.embed,
              ...(incomingSettings?.welcome?.embed ?? {}),
            },

            text: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.text,
              ...(incomingSettings?.welcome?.text ?? {}),
            },

            image: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.image,
              ...(incomingSettings?.welcome?.image ?? {}),
            },

            canvas: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.canvas,
              ...(incomingSettings?.welcome?.canvas ?? {}),

              avatar: {
                ...DEFAULT_WELCOME_SETTINGS.welcome.canvas.avatar,
                ...(incomingSettings?.welcome?.canvas?.avatar ?? {}),
              },

              texts:
                incomingSettings?.welcome?.canvas?.texts?.length
                  ? incomingSettings.welcome.canvas.texts.map(
                      (item) => ({
                        ...item,
                      })
                    )
                  : DEFAULT_WELCOME_SETTINGS.welcome.canvas.texts.map(
                      (item) => ({
                        ...item,
                      })
                    ),
            },

            reaction: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.reaction,
              ...(incomingSettings?.welcome?.reaction ?? {}),
            },

            delete: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.delete,
              ...(incomingSettings?.welcome?.delete ?? {}),
            },

            delay: {
              ...DEFAULT_WELCOME_SETTINGS.welcome.delay,
              ...(incomingSettings?.welcome?.delay ?? {}),
            },

            allowedRoleIds:
              incomingSettings?.welcome?.allowedRoleIds ?? [],
          },

          goodbye: {
            ...DEFAULT_WELCOME_SETTINGS.goodbye,
            ...(incomingSettings?.goodbye ?? {}),

            embed: {
              ...DEFAULT_WELCOME_SETTINGS.goodbye.embed,
              ...(incomingSettings?.goodbye?.embed ?? {}),
            },

            text: {
              ...DEFAULT_WELCOME_SETTINGS.goodbye.text,
              ...(incomingSettings?.goodbye?.text ?? {}),
            },

            image: {
              ...DEFAULT_WELCOME_SETTINGS.goodbye.image,
              ...(incomingSettings?.goodbye?.image ?? {}),
            },

            delete: {
              ...DEFAULT_WELCOME_SETTINGS.goodbye.delete,
              ...(incomingSettings?.goodbye?.delete ?? {}),
            },

            allowedRoleIds:
              incomingSettings?.goodbye?.allowedRoleIds ?? [],
          },

          dm: {
            ...DEFAULT_WELCOME_SETTINGS.dm,
            ...(incomingSettings?.dm ?? {}),

            embed: {
              ...DEFAULT_WELCOME_SETTINGS.dm.embed,
              ...(incomingSettings?.dm?.embed ?? {}),
            },

            text: {
              ...DEFAULT_WELCOME_SETTINGS.dm.text,
              ...(incomingSettings?.dm?.text ?? {}),
            },

            image: {
              ...DEFAULT_WELCOME_SETTINGS.dm.image,
              ...(incomingSettings?.dm?.image ?? {}),
            },

            delay: {
              ...DEFAULT_WELCOME_SETTINGS.dm.delay,
              ...(incomingSettings?.dm?.delay ?? {}),
            },
          },

          settings: {
            ...DEFAULT_WELCOME_SETTINGS.settings,
            ...(incomingSettings?.settings ?? {}),
          },
        }

        setSettings(nextSettings)
        setSavedSettings(nextSettings)
        setChannels(data.channels ?? [])
        setRoles(data.roles ?? [])

        if (data.preview) {
          setPreview(data.preview)
        }

        if (data.guild?.name) {
          setGuildName(data.guild.name)
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load welcome settings."
        )
      } finally {
        setLoading(false)
      }
    }, [guildId])

  useEffect(() => {
    void loadWelcome()
  }, [loadWelcome])

  const hasChanges = useMemo(
    () =>
      JSON.stringify(settings) !==
      JSON.stringify(savedSettings),
    [settings, savedSettings]
  )

  async function saveSettings() {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/welcome`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            settings,
          }),
        }
      )

      const data =
        (await response.json()) as WelcomeApiResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to save welcome settings."
        )
      }

      const nextSettings =
        data.settings ?? settings

      setSettings(nextSettings)
      setSavedSettings(nextSettings)
      setSuccess(
        data.message ??
          "Welcome settings saved."
      )
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save welcome settings."
      )
    } finally {
      setSaving(false)
    }
  }

  async function sendTest(
    payload: TestWelcomePayload
  ) {
    try {
      setTesting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(
        `/api/dashboard/${guildId}/welcome`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...payload,
            settings,
          }),
        }
      )

      const data =
        (await response.json()) as WelcomeApiResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            data.message ??
            "Failed to send test message."
        )
      }

      setSuccess(
        data.message ??
          "Test message sent."
      )
      setTestOpen(false)
    } catch (testError) {
      setError(
        testError instanceof Error
          ? testError.message
          : "Failed to send test message."
      )
    } finally {
      setTesting(false)
    }
  }

  function insertVariable(
    token: string
  ) {
    if (activeTab === "welcome") {
      setSettings((current) => ({
        ...current,
        welcome: {
          ...current.welcome,
          embed: {
            ...current.welcome.embed,
            description:
              current.welcome.embed
                .description + token,
          },
        },
      }))
      return
    }

    if (activeTab === "goodbye") {
      setSettings((current) => ({
        ...current,
        goodbye: {
          ...current.goodbye,
          embed: {
            ...current.goodbye.embed,
            description:
              current.goodbye.embed
                .description + token,
          },
        },
      }))
      return
    }

    if (activeTab === "dm") {
      setSettings((current) => ({
        ...current,
        dm: {
          ...current.dm,
          embed: {
            ...current.dm.embed,
            description:
              current.dm.embed
                .description + token,
          },
        },
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading welcome settings...
          </p>
        </div>
      </div>
    )
  }

  if (error && !channels.length) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 text-center">
          <AlertTriangle className="mx-auto size-10 text-red-400" />
          <h2 className="mt-4 text-lg font-semibold">
            Failed to load Welcome
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
          <Button
            type="button"
            className="mt-5 gap-2"
            onClick={() =>
              void loadWelcome()
            }
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <WelcomeToolbar
          guildName={guildName}
          saving={saving}
          testing={testing}
          hasChanges={hasChanges}
          onSave={() =>
            void saveSettings()
          }
          onTest={() =>
            setTestOpen(true)
          }
        />

        <div className="mt-7">
          <WelcomeSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-5 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <main className="min-w-0">
              {activeTab === "welcome" && (
                <WelcomeMessageTab
                  value={settings.welcome}
                  channels={channels}
                  roles={roles}
                  preview={preview}
                  onChange={(welcome) =>
                    setSettings(
                      (current) => ({
                        ...current,
                        welcome,
                      })
                    )
                  }
                />
              )}

              {activeTab === "goodbye" && (
                <GoodbyeMessageTab
                  value={settings.goodbye}
                  channels={channels}
                  roles={roles}
                  onChange={(goodbye) =>
                    setSettings(
                      (current) => ({
                        ...current,
                        goodbye,
                      })
                    )
                  }
                />
              )}

              {activeTab === "dm" && (
                <DirectMessageTab
                  value={settings.dm}
                  onChange={(dm) =>
                    setSettings(
                      (current) => ({
                        ...current,
                        dm,
                      })
                    )
                  }
                />
              )}

              {activeTab === "settings" && (
                <SettingsTab
                  value={settings.settings}
                  channels={channels}
                  onChange={(
                    generalSettings
                  ) =>
                    setSettings(
                      (current) => ({
                        ...current,
                        settings:
                          generalSettings,
                      })
                    )
                  }
                />
              )}

              {error && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300">
                  {success}
                </div>
              )}
            </main>

            <aside className="space-y-5">
              <WelcomePreview
                activeTab={activeTab}
                settings={settings}
                preview={preview}
              />

              {activeTab !==
                "settings" && (
                <WelcomeVariables
                  onInsert={
                    insertVariable
                  }
                />
              )}
            </aside>
          </div>
        </div>
      </div>

      <TestWelcomeDialog
        open={testOpen}
        testing={testing}
        channels={channels}
        onClose={() =>
          setTestOpen(false)
        }
        onSubmit={(payload) =>
          void sendTest(payload)
        }
      />
    </div>
  )
}