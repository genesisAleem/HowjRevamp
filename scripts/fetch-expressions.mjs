#!/usr/bin/env node
/**
 * Build-time fetch of the HOWJ expression/destination pages from Notion.
 *
 * Runs as part of `prebuild` (see package.json). Queries the two Notion
 * databases, downloads every referenced image into public/expressions/<slug>/
 * (Notion file URLs are signed and expire, so we can NEVER hot-link them), and
 * writes src/content/expressions.json keyed by slug. The Expression page reads
 * that JSON; if it's missing/empty it falls back to the mock, so the site always
 * builds even before Notion is wired.
 *
 * Requires NOTION_TOKEN in .env (a Notion internal integration token, with both
 * databases shared to the integration). Without it, this script no-ops.
 *
 * Notion IDs (overridable via env):
 *   HOWJ_GLOBAL_DB_ID    — the expressions database
 *   HOWJ_MINISTERS_DB_ID — the guest-ministers database
 */

import { mkdir, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import https from 'node:https'
import http from 'node:http'

// Minimal fetch replacement over node:https. The global fetch (undici) gets its
// TLS connection reset on some networks (VPN/proxy/security software) where the
// OpenSSL stack curl/https use is fine — this keeps the build working there.
function httpFetch(url, options = {}, redirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = new URL(url).protocol === 'http:' ? http : https
    const req = lib.request(
      url,
      { method: options.method || 'GET', headers: options.headers || {} },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects) {
          res.resume()
          resolve(httpFetch(new URL(res.headers.location, url).toString(), options, redirects - 1))
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const buf = Buffer.concat(chunks)
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: { get: (h) => res.headers[h.toLowerCase()] ?? null },
            json: async () => JSON.parse(buf.toString('utf8')),
            text: async () => buf.toString('utf8'),
            arrayBuffer: async () => buf,
          })
        })
      },
    )
    req.on('error', reject)
    if (options.body) req.write(options.body)
    req.end()
  })
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUTPUT_PATH = path.join(ROOT, 'src', 'content', 'expressions.json')
const IMAGE_DIR = path.join(ROOT, 'public', 'expressions')

const NOTION_TOKEN = process.env.NOTION_TOKEN
const GLOBAL_DB = process.env.HOWJ_GLOBAL_DB_ID || '38122766-9e5a-8070-9529-dc983312f28f'
const MINISTERS_DB = process.env.HOWJ_MINISTERS_DB_ID || '08933c065e38462bbebb5dbbac06bc03'
const NOTION_VERSION = '2022-06-28'

// hero-timeline tag -> section anchor id (matches Expression.jsx)
const TAG_TARGETS = {
  Revival: 'revival',
  Documentary: 'documentary',
  Minister: 'minister',
  Charity: 'charity',
  Gallery: 'gallery',
}

// ---- Notion property readers -------------------------------------------------
const plain = (rich) => (rich ?? []).map((t) => t.plain_text).join('')
// strip stray markdown emphasis + Notion <br> so copy renders cleanly as text
const clean = (s) => (s || '').replace(/\*([^*]+)\*/g, '$1').replace(/<br\s*\/?>/gi, ' ').trim()

function prop(page, name) {
  return page.properties?.[name]
}
function readText(page, name) {
  const p = prop(page, name)
  if (!p) return ''
  if (p.type === 'rich_text') return clean(plain(p.rich_text))
  if (p.type === 'title') return clean(plain(p.title))
  if (p.type === 'url') return p.url || ''
  return ''
}
function readNumber(page, name) {
  const p = prop(page, name)
  return p?.type === 'number' ? p.number : null
}
function readCheckbox(page, name) {
  const p = prop(page, name)
  return p?.type === 'checkbox' ? p.checkbox : false
}
function readDate(page, name) {
  const p = prop(page, name)
  return p?.type === 'date' ? (p.date?.start ?? '') : ''
}
function readMultiSelect(page, name) {
  const p = prop(page, name)
  return p?.type === 'multi_select' ? p.multi_select.map((o) => o.name) : []
}
function readFileUrls(page, name) {
  const p = prop(page, name)
  if (p?.type !== 'files') return []
  return p.files
    .map((f) => (f.type === 'file' ? f.file?.url : f.external?.url))
    .filter(Boolean)
}
function readRelationIds(page, name) {
  const p = prop(page, name)
  return p?.type === 'relation' ? p.relation.map((r) => r.id) : []
}

// ---- Notion API --------------------------------------------------------------
async function notion(url, options = {}) {
  const res = await httpFetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Notion API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function queryAll(databaseId, body = {}) {
  const results = []
  let cursor
  do {
    const data = await notion(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(cursor ? { ...body, start_cursor: cursor } : body),
    })
    results.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

// youtube.com/watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID -> ID
function ytVideoId(url) {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  )
  return m ? m[1] : null
}

// download a signed Notion URL into public/expressions/<slug>/ and return the
// site-root path. Rejects non-image responses (e.g. a video/link pasted into an
// image field downloads the page HTML, not a picture) so we never ship garbage.
async function downloadImage(url, slug, seen) {
  if (!url) return null
  const res = await httpFetch(url)
  if (!res.ok) throw new Error(`download ${res.status} for ${url}`)
  const type = (res.headers.get('content-type') || '').split(';')[0]
  if (!type.startsWith('image/')) {
    console.warn(`[expressions:fetch] ⚠ skipped non-image field (got ${type || 'unknown'})`)
    return null
  }
  const dir = path.join(IMAGE_DIR, slug)
  const raw = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'image')
  let name = raw.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  if (!path.extname(name)) name += '.' + (type.split('/')[1] || 'jpg') // ext from content-type
  for (let i = 1; seen.has(name); i++) {
    const ext = path.extname(name)
    name = `${path.basename(name, ext)}-${i}${ext}`
  }
  seen.add(name)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), Buffer.from(await res.arrayBuffer()))
  return `/expressions/${slug}/${name}`
}

// ---- mapping -----------------------------------------------------------------
async function buildExpression(page, ministersByExpr, slug) {
  const seen = new Set()
  const dl = (url) => downloadImage(url, slug, seen)
  const firstFile = async (name) => (await Promise.all(readFileUrls(page, name).map(dl)))[0] ?? null
  const allFiles = async (name) => (await Promise.all(readFileUrls(page, name).map(dl))).filter(Boolean)

  const country = readText(page, 'Country')
  const plus = (n) => (n == null ? '' : `${n}+`)

  const [logo, heroImage, featureImage1, featureImage2, docImage, charityImages, partnerLogos, highlightImages] =
    await Promise.all([
      firstFile('Logo'),
      firstFile('Hero Image'),
      firstFile('Feature Image 1'),
      firstFile('Feature Image 2'),
      firstFile('Documentary Image'),
      allFiles('Charity Images'),
      allFiles('Partner Logos'),
      allFiles('Charity Highlight Images'),
    ])

  // documentary thumbnail: a real uploaded image, else the YouTube thumbnail
  // derived from the video URL, else the hero image
  const videoUrl = readText(page, 'Documentary URL')
  let documentaryImage = docImage
  if (!documentaryImage && ytVideoId(videoUrl)) {
    documentaryImage = await downloadImage(
      `https://img.youtube.com/vi/${ytVideoId(videoUrl)}/maxresdefault.jpg`,
      slug,
      seen,
    )
  }

  const ministers = (ministersByExpr[page.id] || [])
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map(async (m) => ({ name: m.name, image: await downloadImage(m.photo, slug, seen) }))

  return {
    slug,
    logo,
    heroImage,
    country,
    city: readText(page, 'City'),
    venue: readText(page, 'Venue'),
    date: readDate(page, 'Event Date'),
    tags: readMultiSelect(page, 'Sections')
      .filter((t) => TAG_TARGETS[t])
      .map((t) => ({ label: t, target: TAG_TARGETS[t] })),
    theme: readText(page, 'Theme'),
    verse: readText(page, 'Bible Verse'),
    overview: readText(page, 'Description'),
    featureStats: [
      { value: plus(readNumber(page, 'Souls Impacted')), label: 'Total souls impacted', image: featureImage1 },
      { value: plus(readNumber(page, 'In Attendance')), label: 'In attendance', image: featureImage2 },
    ],
    numbers: [
      { value: plus(readNumber(page, 'Miracles Documented')), label: 'miracles documented' },
      { value: plus(readNumber(page, 'Charity Impacted')), label: 'Impacted charity' },
      { value: plus(readNumber(page, 'Souls Through Charity')), label: 'Souls impacted through charity' },
    ],
    documentary: { image: documentaryImage || heroImage, videoUrl: videoUrl || '#' },
    ministers: await Promise.all(ministers),
    charity: {
      title: readText(page, 'Charity Title'),
      overview: readText(page, 'Charity Overview'),
      images: charityImages,
    },
    partners: {
      label: readText(page, 'Partners Label') || (country ? `Our Partners in ${country}` : 'Our Partners'),
      logos: partnerLogos.map((image) => ({ image })),
    },
    charityHighlight: { title: 'Charity Highlight', images: highlightImages },
  }
}

async function main() {
  if (!NOTION_TOKEN) {
    console.log('[expressions:fetch] NOTION_TOKEN not set — skipping (Expression page uses the mock).')
    return
  }

  console.log('[expressions:fetch] Querying Notion…')
  const [expressions, ministers] = await Promise.all([
    queryAll(GLOBAL_DB, { filter: { property: 'Published', checkbox: { equals: true } } }),
    queryAll(MINISTERS_DB),
  ])

  // group ministers by the expression they relate to
  const ministersByExpr = {}
  for (const m of ministers) {
    const rec = {
      name: readText(m, 'Name'),
      photo: readFileUrls(m, 'Photo')[0] ?? null,
      order: readNumber(m, 'Order'),
    }
    for (const exprId of readRelationIds(m, 'Expression')) {
      ;(ministersByExpr[exprId] ||= []).push(rec)
    }
  }

  // fresh image dir each run so removed images don't linger
  await rm(IMAGE_DIR, { recursive: true, force: true })

  const out = {}
  for (const page of expressions) {
    const slug = readText(page, 'Slug').toLowerCase()
    if (!slug || slug === 'x') {
      console.warn(`[expressions:fetch] ⚠ skipping "${readText(page, 'Name')}" — set a real Slug.`)
      continue
    }
    out[slug] = await buildExpression(page, ministersByExpr, slug)
    console.log(`[expressions:fetch]   ✓ ${slug}`)
  }

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2) + '\n')
  console.log(`[expressions:fetch] Wrote ${Object.keys(out).length} expression(s) to src/content/expressions.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
