"use client"

import { useState, useMemo } from "react"
import componentIndex from "@/lib/component-index.json"
import type { ComponentIndexEntry } from "@/lib/registry-types"

const components = componentIndex as ComponentIndexEntry[]

const categories = Array.from(
  new Set(components.map((c) => c.category))
).sort()

export default function Home() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return components.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      const matchesCategory =
        !activeCategory || c.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Component Registry</h1>
        <p className="text-muted-foreground">
          {components.length} components · Private registry
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <input
          type="search"
          aria-label="Search components by name, description, or category"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            aria-pressed={!activeCategory}
            aria-label="All categories"
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({components.length})
          </button>
          {categories.map((cat) => {
            const count = components.filter((c) => c.category === cat).length
            return (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                aria-pressed={activeCategory === cat}
                aria-label={`Filter by ${cat} category`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((component) => (
          <ComponentCard key={component.name} component={component} />
        ))}
      </div>
    </div>
  )
}

function ComponentCard({ component }: { component: ComponentIndexEntry }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(component.installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const previewUrl = "#"

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{component.name}</span>
          <span className="text-xs capitalize text-muted-foreground">
            {component.category}
          </span>
        </div>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Preview ${component.name} (opens in new tab)`}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline shrink-0"
        >
          Preview <span aria-hidden="true">↗</span>
        </a>
      </div>

      {component.description && (
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {component.description}
        </p>
      )}

      <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5">
        <code className="flex-1 truncate text-xs">{component.installCommand}</code>
        <button
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : `Copy install command for ${component.name}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  )
}
