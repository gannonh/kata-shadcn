import { test, expect } from "@playwright/test"

test.describe("Component registry browser UI", () => {
  test("component cards show install command with @kata-shadcn scope", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: "Component Registry" })
    ).toBeVisible()

    const installCommands = page.locator("code").filter({
      hasText: "npx shadcn add",
    })
    await expect(installCommands.first()).toBeVisible({ timeout: 10000 })

    const count = await installCommands.count()
    expect(count).toBeGreaterThanOrEqual(3)

    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await installCommands.nth(i).textContent()
      expect(text).toContain("@kata-shadcn")
      expect(text).not.toContain("@ourorg")
    }
  })

  test("at least one card shows hero1 install command when searching", async ({
    page,
  }) => {
    await page.goto("/")

    const search = page.getByRole("searchbox", {
      name: "Search components by name, description, or category",
    })
    await search.fill("hero1")
    await expect(page.getByText("hero1").first()).toBeVisible({ timeout: 5000 })

    const heroCommand = page.getByText("npx shadcn add @kata-shadcn/hero1", {
      exact: true,
    })
    await expect(heroCommand).toBeVisible()
  })
})
