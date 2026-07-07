/**
 * Posts a registration (name, email, phone) to the serverless function
 * that writes into the Notion "Registrations" database.
 *
 * The endpoint is NOT this Hostinger-hosted static site — Hostinger shared
 * hosting can't run server code that holds a Notion API secret. Deploy the
 * function in /functions separately (Cloudflare Workers is the default
 * here — see functions/README.md) and point VITE_REGISTER_ENDPOINT at it.
 */
export async function submitRegistration({ name, email, phone }) {
  const endpoint = import.meta.env.VITE_REGISTER_ENDPOINT

  if (!endpoint) {
    throw new Error(
      'VITE_REGISTER_ENDPOINT is not set. Add it to .env once the registration function is deployed (see functions/README.md).',
    )
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Registration failed (${res.status})`)
  }

  return res.json()
}
