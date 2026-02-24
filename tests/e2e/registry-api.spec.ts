import { test, expect } from "@playwright/test"

const registryToken = process.env.REGISTRY_TOKEN
const authHeaders = registryToken ? { "x-registry-token": registryToken } : {}

test.describe("Registry API /r/*", () => {
  test("GET /r/index returns 200 and full index has enriched item shape", async ({
    request,
  }) => {
    const res = await request.get("/r/index", { headers: authHeaders })

    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("application/json")

    const body = await res.json()
    expect(body).toHaveProperty("items")
    expect(Array.isArray(body.items)).toBe(true)
    if (body.items.length === 0) return

    const item = body.items[0]
    expect(item).toHaveProperty("name")
    expect(item).toHaveProperty("category")
    expect(item).toHaveProperty("url")
    expect(item).toHaveProperty("tags")
    expect(item).toHaveProperty("complexity")
    expect(item).toHaveProperty("contentHash")
    expect(item).toHaveProperty("peerComponents")
    expect(Array.isArray(item.tags)).toBe(true)
    expect(item.complexity).toMatchObject({
      files: expect.any(Number),
      lines: expect.any(Number),
      dependencies: expect.any(Number),
    })
    expect(typeof item.contentHash).toBe("string")
    expect(item.contentHash).toMatch(/^[a-f0-9]{64}$/)
    expect(Array.isArray(item.peerComponents)).toBe(true)
    expect(item.peerComponents.length).toBeLessThanOrEqual(5)
    if (item.lastModified != null) {
      expect(item.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    }
  })

  test("GET /r/index-compact returns 200 and compact index shape", async ({
    request,
  }) => {
    const res = await request.get("/r/index-compact", { headers: authHeaders })

    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("application/json")

    const body = await res.json()
    expect(body).toHaveProperty("total")
    expect(body).toHaveProperty("items")
    expect(typeof body.total).toBe("number")
    expect(Array.isArray(body.items)).toBe(true)
    expect(body.total).toBe(body.items.length)

    if (body.items.length > 0) {
      const sample = body.items.slice(0, 5)
      for (const item of sample) {
        expect(item).toHaveProperty("name")
        expect(item).toHaveProperty("category")
        expect(item).toHaveProperty("url")
        expect(typeof item.name).toBe("string")
        expect(typeof item.category).toBe("string")
        expect(item.url).toMatch(/^\/r\/[^/]+\.json$/)
        expect(Object.keys(item).sort()).toEqual(["category", "name", "url"])
      }
    }
  })

  test("GET /r/hero1 returns 200 and single component payload", async ({
    request,
  }) => {
    const res = await request.get("/r/hero1", { headers: authHeaders })

    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("application/json")

    const body = await res.json()
    expect(body).toHaveProperty("name", "hero1")
    expect(body).toHaveProperty("files")
    expect(Array.isArray(body.files)).toBe(true)
    expect(body.files.length).toBeGreaterThan(0)
  })

  test("GET /r/nonexistent returns 404", async ({ request }) => {
    const res = await request.get("/r/nonexistent-component-xyz", { headers: authHeaders })

    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body).toHaveProperty("error")
  })
})
