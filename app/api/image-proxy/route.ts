import { NextRequest, NextResponse } from "next/server"
import dns from "node:dns/promises"
import net from "node:net"

export const dynamic = "force-dynamic"

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

function isPrivateIp(ip: string) {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number)

    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 172 &&
        parts[1] >= 16 &&
        parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 0
    )
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase()

    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:")
    )
  }

  return true
}

async function assertSafeUrl(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS image URLs are allowed.")
  }

  const addresses = await dns.lookup(url.hostname, {
    all: true,
  })

  if (
    addresses.length === 0 ||
    addresses.some((entry) =>
      isPrivateIp(entry.address)
    )
  ) {
    throw new Error("This image host is not allowed.")
  }
}

export async function GET(request: NextRequest) {
  const rawUrl =
    request.nextUrl.searchParams.get("url")

  if (!rawUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "Image URL is required.",
      },
      {
        status: 400,
      }
    )
  }

  let imageUrl: URL

  try {
    imageUrl = new URL(rawUrl)
    await assertSafeUrl(imageUrl)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Invalid image URL.",
      },
      {
        status: 400,
      }
    )
  }

  try {
    const response = await fetch(imageUrl, {
      cache: "no-store",
      redirect: "follow",
      headers: {
        Accept: "image/*",
        "User-Agent": "TOX-Image-Proxy/1.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Image host returned ${response.status}.`,
        },
        {
          status: 502,
        }
      )
    }

    const contentType =
      response.headers.get("content-type") ?? ""

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "The supplied URL did not return an image.",
        },
        {
          status: 415,
        }
      )
    }

    const buffer =
      await response.arrayBuffer()

    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Image is larger than 10 MB.",
        },
        {
          status: 413,
        }
      )
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Image proxy failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to download the image.",
      },
      {
        status: 502,
      }
    )
  }
}