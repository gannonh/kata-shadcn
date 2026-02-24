import { defineConfig, devices } from "@playwright/test"
import { readFileSync, existsSync } from "fs"
import path from "path"

// Load REGISTRY_TOKEN from .env.local for local E2E when server requires auth
if (!process.env.REGISTRY_TOKEN) {
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf8")
      const m = content.match(/REGISTRY_TOKEN=(.+)/m)
      if (m) process.env.REGISTRY_TOKEN = m[1].trim().replace(/^["']|["']$/g, "")
    }
  } catch {}
}

const baseURL = process.env.BASE_URL ?? "http://localhost:3000"
const useExternalServer = !!process.env.BASE_URL

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: process.env.CI ? "pnpm start" : "pnpm dev",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
      }),
})
