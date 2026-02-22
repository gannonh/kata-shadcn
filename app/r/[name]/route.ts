import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{
    name: string
  }>
}

// Backward compatibility for registries configured with /r/{name}
// instead of /r/{name}.json.
export async function GET(_request: Request, context: RouteContext) {
  const { name } = await context.params
  const filePath = path.join(process.cwd(), "public", "r", `${name}.json`)

  try {
    const body = await fs.readFile(filePath, "utf8")
    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    })
  } catch {
    return NextResponse.json(
      {
        error: "Not Found",
        message: `Registry item "${name}" was not found.`,
      },
      { status: 404 }
    )
  }
}
