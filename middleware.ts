// middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.headers.get("x-registry-token")
  const expected = process.env.REGISTRY_TOKEN

  if (!expected) {
    // REGISTRY_TOKEN not set — allow all (local dev mode)
    return NextResponse.next()
  }

  if (token !== expected) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Valid x-registry-token header required." },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/r/:path*",
}
