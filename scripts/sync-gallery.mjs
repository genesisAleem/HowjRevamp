#!/usr/bin/env node
/**
 * Build-time gallery manifest sync.
 *
 * Walks public/gallery/ and regenerates src/content/gallery.json from the
 * filenames. The tags live in the filename (no hidden EXIF metadata), using
 * the convention:
 *
 *     {country}-{category}-{number}.{ext}
 *     e.g.  ghana-ministration-01.jpg,  south-korea-charity-02.jpg
 *
 * Country may contain hyphens (south-korea); the LAST segment is the number
 * and the second-to-last is the category, so everything before that is the
 * country. From each match the script derives { src, country, category, alt }.
 *
 * Files that don't match the pattern are NOT dropped — they stay in the
 * manifest with country/category = null and a placeholder alt, and are listed
 * as warnings so you can see what still needs renaming. This means the gallery
 * keeps working while a rename is only half-done.
 *
 * Optional overrides: scripts/gallery-overrides.json, a map keyed by filename,
 * is merged over the derived entry — for a custom alt or a photo whose real
 * tag differs from its name. Example:
 *   { "ghana-ministration-01.jpg": { "alt": "Altar call, Accra crusade" } }
 *
 * Run directly (`npm run gallery:sync`) or as part of `npm run prebuild`.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GALLERY_DIR = path.join(__dirname, '..', 'public', 'gallery')
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'content', 'gallery.json')
const OVERRIDES_PATH = path.join(__dirname, 'gallery-overrides.json')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

// The fixed category vocabulary. Names outside this set are still accepted
// (so you're never blocked) but are warned about, to catch typos early.
const KNOWN_CATEGORIES = new Set(['ministration', 'charity'])

// Alt-text templates per category; {country} is filled with the display name.
const ALT_TEMPLATES = {
  ministration: 'HOWJ ministration in {country}',
  charity: 'HOWJ charity event in {country}',
}

// "south-korea" -> "South Korea"
function titleCase(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function parseName(filename) {
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  const parts = base.split('-')
  if (parts.length < 3) return null

  const number = parts.pop()
  const category = parts.pop()
  const country = parts.join('-')
  if (!country || !/^\d+$/.test(number)) return null

  const countryName = titleCase(country)
  const alt = (ALT_TEMPLATES[category] ?? `HOWJ ${category} in {country}`).replace(
    '{country}',
    countryName,
  )
  return { country: countryName, category, alt }
}

async function loadOverrides() {
  try {
    return JSON.parse(await readFile(OVERRIDES_PATH, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return {}
    throw new Error(`[gallery:sync] Failed to parse ${OVERRIDES_PATH}: ${err.message}`)
  }
}

async function main() {
  let files
  try {
    files = await readdir(GALLERY_DIR)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`[gallery:sync] ${GALLERY_DIR} does not exist — nothing to sync.`)
      process.exit(1)
    }
    throw err
  }

  const images = files
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const overrides = await loadOverrides()
  const unmatched = []
  const unknownCategory = []

  const entries = images.map((filename) => {
    const parsed = parseName(filename)
    const base = {
      src: `/gallery/${filename}`,
      country: null,
      category: null,
      alt: 'HOWJ — untagged photo (rename to country-category-##.jpg)',
    }

    if (parsed) {
      base.country = parsed.country
      base.category = parsed.category
      base.alt = parsed.alt
      if (!KNOWN_CATEGORIES.has(parsed.category)) unknownCategory.push(filename)
    } else {
      unmatched.push(filename)
    }

    // Manual overrides win over anything derived from the filename.
    return { ...base, ...overrides[filename] }
  })

  // Sort: tagged photos first, grouped by country then category then filename;
  // untagged ones sink to the end so they're easy to spot in the manifest.
  entries.sort((a, b) => {
    if (!!a.country !== !!b.country) return a.country ? -1 : 1
    return (
      (a.country ?? '').localeCompare(b.country ?? '') ||
      (a.category ?? '').localeCompare(b.category ?? '') ||
      a.src.localeCompare(b.src, undefined, { numeric: true })
    )
  })

  await writeFile(OUTPUT_PATH, JSON.stringify(entries, null, 2) + '\n')

  const tagged = entries.length - unmatched.length
  console.log(
    `[gallery:sync] Wrote ${entries.length} entries to src/content/gallery.json (${tagged} tagged, ${unmatched.length} untagged).`,
  )
  if (unknownCategory.length) {
    console.warn(
      `[gallery:sync] ⚠ ${unknownCategory.length} file(s) use a category outside {${[...KNOWN_CATEGORIES].join(', ')}} — check for typos:\n  ` +
        unknownCategory.join('\n  '),
    )
  }
  if (unmatched.length) {
    console.warn(
      `[gallery:sync] ⚠ ${unmatched.length} file(s) don't match country-category-##.ext and still need renaming:\n  ` +
        unmatched.join('\n  '),
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
