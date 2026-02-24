/**
 * Category collapse map loader and segment derivation.
 * Used by build-registry.ts; tested in build-registry.test.mjs for coverage.
 */
import fs from "node:fs"

export function deriveSegment(name) {
  const beforeHyphen = name.split("-")[0] ?? name
  return beforeHyphen.replace(/\d+$/, "").replace(/-+$/, "") || beforeHyphen
}

/**
 * Load and validate category collapse map from path. Throws if missing or invalid.
 * @param {string} filePath - Path to JSON file (object of string -> string)
 * @returns {Record<string, string>}
 */
export function loadCollapseMap(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `${filePath} not found. Run scripts/bootstrap-category-collapse.ts or add the file.`
    )
  }
  let raw
  try {
    raw = JSON.parse(fs.readFileSync(filePath, "utf8"))
  } catch (err) {
    throw new Error(`${filePath} invalid: ${err.message}`)
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(`${filePath} must be a JSON object.`)
  }
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v !== "string") {
      throw new Error(
        `${filePath} values must be strings; key "${k}" has ${typeof v}.`
      )
    }
  }
  return raw
}
