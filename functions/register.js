/**
 * Cloudflare Worker — receives registration POSTs from the frontend and
 * writes a new row into a Notion "Registrations" database.
 *
 * WHY THIS LIVES OUTSIDE THE HOSTINGER SITE:
 * Hostinger shared/business hosting serves static files only — it has no
 * way to run server code that holds your Notion API secret. This function
 * is deployed separately (Cloudflare Workers free tier is the default
 * assumption) and the static site calls it over HTTPS via
 * VITE_REGISTER_ENDPOINT. If you later move to a Hostinger VPS/Cloud plan
 * with Node.js, this same logic could move into an Express route instead.
 *
 * Deploy (from inside this functions/ folder, after `npm init -y` and
 * `npm i -D wrangler`):
 *   npx wrangler secret put NOTION_TOKEN
 *   npx wrangler secret put NOTION_REGISTRATIONS_DB_ID
 *   npx wrangler deploy
 *
 * Then set VITE_REGISTER_ENDPOINT in the site's .env to the deployed URL.
 */

const NOTION_VERSION = '2022-06-28'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400, origin)
    }

    const name = (body.name || '').trim()
    const email = (body.email || '').trim()
    const phone = (body.phone || '').trim()

    if (!name || !email || !phone) {
      return json({ error: 'name, email, and phone are all required.' }, 400, origin)
    }
    if (!EMAIL_RE.test(email)) {
      return json({ error: 'Invalid email address.' }, 400, origin)
    }

    if (!env.NOTION_TOKEN || !env.NOTION_REGISTRATIONS_DB_ID) {
      return json({ error: 'Server misconfigured: Notion secrets not set.' }, 500, origin)
    }

    // Adjust these property names to match your Notion database's columns exactly.
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: env.NOTION_REGISTRATIONS_DB_ID },
        properties: {
          Name: { title: [{ text: { content: name } }] },
          Email: { email },
          Phone: { phone_number: phone },
          'Submitted at': { date: { start: new Date().toISOString() } },
        },
      }),
    })

    if (!notionRes.ok) {
      const errBody = await notionRes.text()
      console.error('Notion API error:', errBody)
      return json({ error: 'Failed to save registration.' }, 502, origin)
    }

    return json({ ok: true }, 200, origin)
  },
}
