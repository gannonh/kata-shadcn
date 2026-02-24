import { test, expect } from "@playwright/test"

const registryToken = process.env.REGISTRY_TOKEN

test.describe("Registry API /r/*", () => {
  test("GET /r/index-compact returns 200 and compact index shape", async ({
    request,
  }) => {
    const headers = registryToken
      ? { "x-registry-token": registryToken }
      : {}
    const res = await request.get("/r/index-compact", { headers })

    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("application/json")

    const body = await res.json()
    expect(body).toHaveProperty("total")
    expect(body).toHaveProperty("items")
    expect(typeof body.total).toBe("number")
    expect(Array.isArray(body.items)).toBe(true)
    expect(body.total).toBe(body.items.length)

    if (body.items.length > 0) {
      const item = body.items[0]
      expect(item).toHaveProperty("name")
      expect(item).toHaveProperty("category")
      expect(item).toHaveProperty("url")
      expect(typeof item.name).toBe("string")
      expect(typeof item.category).toBe("string")
      expect(item.url).toMatch(/^\/r\/[^/]+\.json$/)
    }
  })

  test("GET /r/hero1 returns 200 and single component payload", async ({
    request,
  }) => {
    const headers = registryToken
      ? { "x-registry-token": registryToken }
      : {}
    const res = await request.get("/r/hero1", { headers })

    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("application/json")

    const body = await res.json()
    expect(body).toHaveProperty("name", "hero1")
    expect(body).toHaveProperty("files")
    expect(Array.isArray(body.files)).toBe(true)
    expect(body.files.length).toBeGreaterThan(0)
  })

  test("GET /r/nonexistent returns 404", async ({ request }) => {
    const headers = registryToken
      ? { "x-registry-token": registryToken }
      : {}
    const res = await request.get("/r/nonexistent-component-xyz", { headers })

    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body).toHaveProperty("error")
  })
})
