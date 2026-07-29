"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type {
  WelcomeCanvasSettings,
  WelcomeCanvasTextItem,
  WelcomeImageCanvasProps,
} from "./types"

type DragTarget =
  | {
      type: "avatar"
      offsetX: number
      offsetY: number
    }
  | {
      type: "text"
      textId: string
      offsetX: number
      offsetY: number
    }
  | null

export function WelcomeImageCanvas({
  value,
  preview,
  disabled = false,
  previewOnly = false,
  onChange,
}: WelcomeImageCanvasProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    )

  const [dragTarget, setDragTarget] =
    useState<DragTarget>(null)

  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(
      null
    )

  const [avatarImage, setAvatarImage] =
    useState<HTMLImageElement | null>(
      null
    )

  const variables = useMemo(
    () => ({
      "{username}":
        preview.member.username,
      "{displayName}":
        preview.member.displayName,
      "{mention}":
        preview.member.mention,
      "{userAvatar}":
        preview.member.avatarUrl,
      "{server}":
        preview.server.name,
      "{serverIcon}":
        preview.server.iconUrl,
      "{memberCount}": String(
        preview.server.memberCount
      ),
      "{userId}":
        preview.member.id,
      "{serverId}":
        preview.server.id,
    }),
    [preview]
  )

  useEffect(() => {
    let cancelled = false

    if (!value.backgroundUrl) {
      setBackgroundImage(null)
      return
    }

    const image = new Image()
    image.crossOrigin = "anonymous"

    image.onload = () => {
      if (!cancelled) {
        setBackgroundImage(image)
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setBackgroundImage(null)
      }
    }

    image.src = getProxiedImageUrl(
      value.backgroundUrl
    )

    return () => {
      cancelled = true
    }
  }, [value.backgroundUrl])

  useEffect(() => {
    let cancelled = false

    if (!preview.member.avatarUrl) {
      setAvatarImage(null)
      return
    }

    const image = new Image()
    image.crossOrigin = "anonymous"

    image.onload = () => {
      if (!cancelled) {
        setAvatarImage(image)
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setAvatarImage(null)
      }
    }

    image.src =
      getProxiedImageUrl(
        preview.member.avatarUrl
      )

    return () => {
      cancelled = true
    }
  }, [preview.member.avatarUrl])

  useEffect(() => {
    drawCanvas()
  }, [
    value,
    backgroundImage,
    avatarImage,
    variables,
  ])

  function drawCanvas() {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context =
      canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = value.width
    canvas.height = value.height

    context.clearRect(
      0,
      0,
      value.width,
      value.height
    )

    context.fillStyle =
      value.backgroundColor

    context.fillRect(
      0,
      0,
      value.width,
      value.height
    )

    if (backgroundImage) {
      drawCoverImage(
        context,
        backgroundImage,
        0,
        0,
        value.width,
        value.height
      )
    }

    drawAvatar(context)

    for (const textItem of value.texts) {
      if (!textItem.enabled) {
        continue
      }

      drawTextItem(
        context,
        textItem
      )
    }
  }

  function drawAvatar(
    context: CanvasRenderingContext2D
  ) {
    const avatar =
      value.avatar

    const left =
      avatar.x - avatar.size / 2

    const top =
      avatar.y - avatar.size / 2

    context.save()

    if (avatar.shadow) {
      context.shadowColor =
        "rgba(0, 0, 0, 0.45)"
      context.shadowBlur = 22
      context.shadowOffsetY = 8
    }

    createAvatarPath(
      context,
      avatar.x,
      avatar.y,
      avatar.size,
      avatar.shape
    )

    context.clip()

    if (avatarImage) {
      drawCoverImage(
        context,
        avatarImage,
        left,
        top,
        avatar.size,
        avatar.size
      )
    } else {
      const gradient =
        context.createLinearGradient(
          left,
          top,
          left + avatar.size,
          top + avatar.size
        )

      gradient.addColorStop(
        0,
        "#7c3aed"
      )

      gradient.addColorStop(
        1,
        "#2563eb"
      )

      context.fillStyle = gradient
      context.fillRect(
        left,
        top,
        avatar.size,
        avatar.size
      )

      context.fillStyle =
        "#ffffff"

      context.font = `700 ${Math.max(
        24,
        Math.floor(
          avatar.size * 0.3
        )
      )}px Arial`

      context.textAlign = "center"
      context.textBaseline = "middle"

      context.fillText(
        preview.member.username
          .slice(0, 2)
          .toUpperCase(),
        avatar.x,
        avatar.y
      )
    }

    context.restore()

    if (avatar.borderWidth > 0) {
      context.save()

      context.strokeStyle =
        avatar.borderColor

      context.lineWidth =
        avatar.borderWidth

      createAvatarPath(
        context,
        avatar.x,
        avatar.y,
        avatar.size,
        avatar.shape
      )

      context.stroke()
      context.restore()
    }
  }

  function drawTextItem(
    context: CanvasRenderingContext2D,
    item: WelcomeCanvasTextItem
  ) {
    const content =
      replaceVariables(
        item.content,
        variables
      )

    context.save()

    context.font = `${item.fontWeight} ${item.fontSize}px Arial`

    context.textAlign =
      item.align

    context.textBaseline = "top"

    const lines = wrapText(
      context,
      content,
      item.maxWidth
    )

    let currentY = item.y

    for (const line of lines) {
      if (item.strokeWidth > 0) {
        context.lineWidth =
          item.strokeWidth

        context.strokeStyle =
          item.strokeColor

        context.strokeText(
          line,
          item.x,
          currentY,
          item.maxWidth
        )
      }

      context.fillStyle =
        item.color

      context.fillText(
        line,
        item.x,
        currentY,
        item.maxWidth
      )

      currentY +=
        item.fontSize * 1.2
    }

    context.restore()
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    if (disabled) {
      return
    }

    const point =
      getCanvasPoint(event)

    const avatar =
      value.avatar

    const avatarLeft =
      avatar.x - avatar.size / 2

    const avatarTop =
      avatar.y - avatar.size / 2

    const insideAvatar =
      point.x >= avatarLeft &&
      point.x <=
        avatarLeft + avatar.size &&
      point.y >= avatarTop &&
      point.y <=
        avatarTop + avatar.size

    if (insideAvatar) {
      setDragTarget({
        type: "avatar",
        offsetX:
          point.x - avatar.x,
        offsetY:
          point.y - avatar.y,
      })

      event.currentTarget.setPointerCapture(
        event.pointerId
      )

      return
    }

    const hitText = [
      ...value.texts,
    ]
      .reverse()
      .find((item) =>
        isPointInsideText(
          point.x,
          point.y,
          item
        )
      )

    if (hitText) {
      setDragTarget({
        type: "text",
        textId: hitText.id,
        offsetX:
          point.x - hitText.x,
        offsetY:
          point.y - hitText.y,
      })

      event.currentTarget.setPointerCapture(
        event.pointerId
      )
    }
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    if (
      disabled ||
      !dragTarget
    ) {
      return
    }

    const point =
      getCanvasPoint(event)

    if (
      dragTarget.type ===
      "avatar"
    ) {
      const half =
        value.avatar.size / 2

      onChange({
        ...value,
        avatar: {
          ...value.avatar,
          x: clamp(
            point.x -
              dragTarget.offsetX,
            half,
            value.width - half
          ),
          y: clamp(
            point.y -
              dragTarget.offsetY,
            half,
            value.height - half
          ),
        },
      })

      return
    }

    onChange({
      ...value,
      texts: value.texts.map(
        (item) =>
          item.id ===
          dragTarget.textId
            ? {
                ...item,
                x: clamp(
                  point.x -
                    dragTarget.offsetX,
                  0,
                  value.width
                ),
                y: clamp(
                  point.y -
                    dragTarget.offsetY,
                  0,
                  value.height
                ),
              }
            : item
      ),
    })
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    setDragTarget(null)

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      )
    }
  }

  function getCanvasPoint(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      }
    }

    const rect =
      canvas.getBoundingClientRect()

    return {
      x:
        ((event.clientX -
          rect.left) /
          rect.width) *
        value.width,
      y:
        ((event.clientY -
          rect.top) /
          rect.height) *
        value.height,
    }
  }

  if (previewOnly) {
    return (
      <canvas
        ref={canvasRef}
        className="block h-auto w-full rounded-md"
        aria-label="Welcome image preview"
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-[#060913] p-3">
        <canvas
          ref={canvasRef}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerUp
          }
          className="block w-full touch-none rounded-xl border border-white/10"
          style={{
            cursor: disabled
              ? "default"
              : dragTarget
                ? "grabbing"
                : "grab",
          }}
        />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        اسحب صورة العضو أو النصوص
        مباشرة داخل المعاينة لتغيير
        مكانها.
      </p>
    </div>
  )
}

function createAvatarPath(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
  shape:
    | "circle"
    | "rounded"
    | "square"
) {
  const left =
    centerX - size / 2

  const top =
    centerY - size / 2

  context.beginPath()

  if (shape === "circle") {
    context.arc(
      centerX,
      centerY,
      size / 2,
      0,
      Math.PI * 2
    )

    context.closePath()
    return
  }

  if (shape === "rounded") {
    context.roundRect(
      left,
      top,
      size,
      size,
      Math.max(
        12,
        size * 0.12
      )
    )

    context.closePath()
    return
  }

  context.rect(
    left,
    top,
    size,
    size
  )

  context.closePath()
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const imageRatio =
    image.width / image.height

  const targetRatio =
    width / height

  let sourceX = 0
  let sourceY = 0
  let sourceWidth =
    image.width
  let sourceHeight =
    image.height

  if (imageRatio > targetRatio) {
    sourceWidth =
      image.height * targetRatio

    sourceX =
      (image.width -
        sourceWidth) /
      2
  } else {
    sourceHeight =
      image.width /
      targetRatio

    sourceY =
      (image.height -
        sourceHeight) /
      2
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  )
}

function replaceVariables(
  value: string,
  variables: Record<
    string,
    string
  >
) {
  let output = value

  for (const [
    token,
    replacement,
  ] of Object.entries(variables)) {
    output = output
      .split(token)
      .join(replacement)
  }

  return output
}

function wrapText(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number
) {
  const paragraphs =
    value.split("\n")

  const lines: string[] = []

  for (const paragraph of paragraphs) {
    const words =
      paragraph.split(/\s+/)

    let currentLine = ""

    for (const word of words) {
      const candidate =
        currentLine
          ? `${currentLine} ${word}`
          : word

      if (
        context.measureText(
          candidate
        ).width >
          maxWidth &&
        currentLine
      ) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = candidate
      }
    }

    lines.push(currentLine)
  }

  return lines
}

function isPointInsideText(
  x: number,
  y: number,
  item: WelcomeCanvasTextItem
) {
  if (!item.enabled) {
    return false
  }

  const left =
    item.align === "center"
      ? item.x -
        item.maxWidth / 2
      : item.align === "right"
        ? item.x - item.maxWidth
        : item.x

  const estimatedHeight =
    item.fontSize * 2.4

  return (
    x >= left &&
    x <= left + item.maxWidth &&
    y >= item.y &&
    y <= item.y + estimatedHeight
  )
}


function getProxiedImageUrl(
  source: string
) {
  if (!source) {
    return ""
  }

  if (
    source.startsWith("/") ||
    source.startsWith("data:") ||
    source.startsWith("blob:")
  ) {
    return source
  }

  return `/api/image-proxy?url=${encodeURIComponent(
    source
  )}`
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    max,
    Math.max(min, value)
  )
}