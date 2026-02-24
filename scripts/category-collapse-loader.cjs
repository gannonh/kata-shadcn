/**
 * Category collapse map loader and segment derivation (CJS for sync require from build-registry).
 * ESM version .mjs is used by tests for coverage.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs")

function deriveSegment(name) {
  const beforeHyphen = name.split("-")[0] ?? name
  return beforeHyphen.replace(/\d+$/, "").replace(/-+$/, "") || beforeHyphen
}

function loadCollapseMap(filePath) {
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

module.exports = { deriveSegment, loadCollapseMap }
