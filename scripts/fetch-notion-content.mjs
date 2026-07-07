#!/usr/bin/env node
/**
 * Build-time Notion content fetch (SSG approach).
 *
 * Runs BEFORE `vite build` (wired as the "prebuild" npm script) so the
 * Notion API key never ships to the browser and the static site has no
 * runtime dependency on Notion being reachable.
 *
 * To see content updates, re-run the build — this is the tradeoff of
 * baking content in at build time vs. fetching client-side on every load.
 *
 * Requires in .env (see .env.example):
 *   NOTION_TOKEN
 *   NOTION_CONTENT_SOURCE_ID   (a Notion database ID, shared with the integration)
 *
 * If those aren't set, this script no-ops and leaves src/content/site.json
 * (the placeholder) untouched, so `npm run build` still works without Notion
 * configured yet.
 */

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'content', 'site.json')

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_CONTENT_SOURCE_ID = process.env.NOTION_CONTENT_SOURCE_ID
const NOTION_VERSION = '2022-06-28'

async function main() {
  if (!NOTION_TOKEN || !NOTION_CONTENT_SOURCE_ID) {
    console.log(
      '[notion:fetch] NOTION_TOKEN / NOTION_CONTENT_SOURCE_ID not set — skipping, using existing src/content/site.json placeholder.',
    )
    return
  }

  console.log('[notion:fetch] Querying Notion database...')

  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_CONTENT_SOURCE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    },
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[notion:fetch] Notion API error ${res.status}: ${body}`)
  }

  const data = await res.json()

  // TODO: map Notion's page/property shape to the site.json schema your
  // components expect (see src/content/site.json for that shape). The exact
  // mapping depends on how you structure the Notion database (property
  // names, page-per-section vs one big table, etc.) — this is intentionally
  // left as a stub until that structure is decided.
  const content = {
    _note: 'Fetched from Notion at build time.',
    _raw: data.results,
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(content, null, 2))
  console.log(`[notion:fetch] Wrote ${data.results.length} records to src/content/site.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
