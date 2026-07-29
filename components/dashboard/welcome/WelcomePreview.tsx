"use client"

import {
  Bot,
  Image as ImageIcon,
  MessageSquare,
  User,
} from "lucide-react"

import { WelcomeImageCanvas } from "./WelcomeImageCanvas"

import type {
  WelcomeEmbedSettings,
  WelcomePreviewProps,
} from "./types"

export function WelcomePreview({
  activeTab,
  settings,
  preview,
}: WelcomePreviewProps) {
  const currentSettings =
    activeTab === "goodbye"
      ? settings.goodbye
      : activeTab === "dm"
        ? settings.dm
        : settings.welcome

  const embed = currentSettings.embed
  const messageType = currentSettings.type

  const variables: Record<string, string> = {
    "{username}": preview.member.username,
    "{displayName}": preview.member.displayName,
    "{mention}": preview.member.mention,
    "{userAvatar}": preview.member.avatarUrl,
    "{userId}": preview.member.id,
    "{server}": preview.server.name,
    "{serverIcon}": preview.server.iconUrl,
    "{serverId}": preview.server.id,
    "{memberCount}": String(preview.server.memberCount),
  }

  function replaceVariables(value?: string) {
    if (!value) return ""

    let output = value

    for (const [token, replacement] of Object.entries(variables)) {
      output = output.split(token).join(replacement)
    }

    return output
  }

  const authorName = replaceVariables(embed.authorName)
  const authorIcon = replaceVariables(embed.authorIconUrl)
  const thumbnailUrl = replaceVariables(embed.thumbnailUrl)
  const mainImageUrl = replaceVariables(embed.imageUrl)
  const footerText = replaceVariables(embed.footerText)
  const footerIcon = replaceVariables(embed.footerIconUrl)

  const textContent =
    messageType === "text"
      ? replaceVariables(currentSettings.text.content)
      : messageType === "image"
        ? replaceVariables(currentSettings.image.content)
        : ""

  const standaloneImage =
    messageType === "image"
      ? replaceVariables(currentSettings.image.imageUrl)
      : ""

  const mentionEnabled =
    activeTab === "welcome"
      ? Boolean(settings.welcome.mentionMember)
      : false

  const canvasEnabled =
    activeTab === "welcome"
      ? Boolean(settings.welcome.canvas?.enabled)
      : false

  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-primary" />
        <h3 className="font-semibold">Live Preview</h3>
      </div>

      <div className="mt-5 rounded-xl bg-[#313338] p-4">
        <div className="flex gap-3">
          <img
            src={getPreviewImageUrl(preview.server.iconUrl || "/logo.png")}
            alt=""
            className="size-10 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">
                {preview.server.name}
              </span>

              <span className="rounded bg-[#5865f2] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                APP
              </span>

              <span className="text-xs text-gray-400">
                Today
              </span>
            </div>

            {mentionEnabled && (
              <p className="mt-2 text-sm text-[#dbdee1]">
                {preview.member.mention}
              </p>
            )}

            {messageType === "embed" && (
              <DiscordEmbedPreview
                embed={embed}
                authorName={authorName}
                authorIcon={authorIcon}
                thumbnailUrl={thumbnailUrl}
                mainImageUrl={mainImageUrl}
                footerText={footerText}
                footerIcon={footerIcon}
                replaceVariables={replaceVariables}
                canvasEnabled={canvasEnabled}
                canvasSettings={settings.welcome.canvas}
                preview={preview}
              />
            )}

            {messageType === "text" && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#dbdee1]">
                {textContent || "Your text message will appear here."}
              </p>
            )}

            {messageType === "image" && (
              <div className="mt-2 space-y-3">
                {textContent && (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[#dbdee1]">
                    {textContent}
                  </p>
                )}

                {standaloneImage ? (
                  <img
                    src={getPreviewImageUrl(standaloneImage)}
                    alt="Message preview"
                    className="max-h-72 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/10 text-xs text-gray-400">
                    <ImageIcon className="mr-2 size-4" />
                    No image selected
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="size-4" />
          Test Member
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {preview.member.displayName}
        </p>

        <p className="text-xs text-muted-foreground">
          {preview.channelName}
        </p>
      </div>
    </aside>
  )
}

function DiscordEmbedPreview({
  embed,
  authorName,
  authorIcon,
  thumbnailUrl,
  mainImageUrl,
  footerText,
  footerIcon,
  replaceVariables,
  canvasEnabled,
  canvasSettings,
  preview,
}: {
  embed: WelcomeEmbedSettings
  authorName: string
  authorIcon: string
  thumbnailUrl: string
  mainImageUrl: string
  footerText: string
  footerIcon: string
  replaceVariables: (value?: string) => string
  canvasEnabled: boolean
  canvasSettings: WelcomePreviewProps["settings"]["welcome"]["canvas"]
  preview: WelcomePreviewProps["preview"]
}) {
  return (
    <div
      className="relative mt-3 overflow-hidden rounded bg-[#2b2d31] pl-4"
      style={{
        borderLeft: `4px solid ${embed.color || "#5865f2"}`,
      }}
    >
      <div className="p-4">
        {authorName && (
          <div className="mb-2 flex items-center gap-2">
            {authorIcon ? (
              <img
                src={getPreviewImageUrl(authorIcon)}
                alt=""
                className="size-6 rounded-full object-cover"
              />
            ) : (
              <Bot className="size-4 text-gray-400" />
            )}

            <span className="text-xs font-semibold text-white">
              {authorName}
            </span>
          </div>
        )}

        <div className={thumbnailUrl ? "pr-20" : ""}>
          {replaceVariables(embed.title) && (
            <h4 className="font-semibold leading-6 text-white">
              {replaceVariables(embed.title)}
            </h4>
          )}

          {replaceVariables(embed.description) && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
              {replaceVariables(embed.description)}
            </p>
          )}
        </div>

        {thumbnailUrl && (
          <img
            src={getPreviewImageUrl(thumbnailUrl)}
            alt=""
            className="absolute right-4 top-4 size-16 rounded object-cover"
          />
        )}

        {mainImageUrl && (
          <img
            src={getPreviewImageUrl(mainImageUrl)}
            alt="Embed preview"
            className="mt-4 max-h-72 w-full rounded object-cover"
          />
        )}

        {canvasEnabled && canvasSettings && (
          <div className="mt-4 overflow-hidden rounded-md bg-black/20">
            <WelcomeImageCanvas
              value={canvasSettings}
              preview={preview}
              disabled
              previewOnly
              onChange={() => undefined}
            />
          </div>
        )}

        {(footerText || footerIcon || embed.timestamp) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
            {footerIcon && (
              <img
                src={getPreviewImageUrl(footerIcon)}
                alt=""
                className="size-5 rounded-full object-cover"
              />
            )}

            {footerText && <span>{footerText}</span>}

            {footerText && embed.timestamp && <span>•</span>}

            {embed.timestamp && (
              <span>
                Today at{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function getPreviewImageUrl(source: string) {
  if (!source) return ""

  if (
    source.startsWith("/") ||
    source.startsWith("data:") ||
    source.startsWith("blob:")
  ) {
    return source
  }

  return `/api/image-proxy?url=${encodeURIComponent(source)}`
}