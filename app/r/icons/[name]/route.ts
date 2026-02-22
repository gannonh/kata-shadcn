import { NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{
    name: string
  }>
}

const DEFAULT_SHADCN_REGISTRY_BASE = "https://ui.shadcn.com/r"

function getUpstreamBaseUrl() {
  return (
    process.env.SHADCN_FALLBACK_REGISTRY_URL ?? DEFAULT_SHADCN_REGISTRY_BASE
  ).replace(/\/+$/, "")
}

export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params
  const normalizedName = name.endsWith(".json") ? name : `${name}.json`
  const upstreamUrl = `${getUpstreamBaseUrl()}/icons/${encodeURIComponent(normalizedName)}`

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: 3600,
      },
    })
  } catch {
    return NextResponse.json(
      {
        error: "Bad Gateway",
        message: "Unable to reach shadcn fallback registry.",
      },
      { status: 502 }
    )
  }

  const body = await upstreamResponse.text()
  const contentType =
    upstreamResponse.headers.get("content-type") ??
    "application/json; charset=utf-8"

  return new NextResponse(body, {
    status: upstreamResponse.status,
    headers: {
      "content-type": contentType,
      "cache-control": upstreamResponse.ok
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : "no-store",
    },
  })
}
