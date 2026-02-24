/**
 * Shared types for the component registry index (browser UI and agent API).
 * Source of truth for lib/component-index.json and GET /r/index.json shape.
 */

export interface Complexity {
  files: number
  lines: number
  dependencies: number
}

export interface ComponentIndexEntry {
  name: string
  title: string
  description: string
  category: string
  installCommand: string
  tags: string[]
  complexity: Complexity
  /** SHA-256 hex, 64 chars. */
  contentHash: string
  /** ISO 8601 date when present; omitted when not in a git repo. */
  lastModified?: string
  peerComponents: string[]
}
