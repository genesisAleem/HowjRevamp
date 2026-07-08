# Registration function

Handles the name/email/phone registration form and writes each signup into a Notion database. Deployed separately from the Hostinger static site (see the note at the top of `register.js` for why).

## Setup (Cloudflare Workers — free tier is enough for this)

1. In Notion, create a "Registrations" database with columns: `Name` (title), `Email` (email), `Phone` (phone), `Submitted at` (date).
2. Share that database with your Notion integration (the same one used for content, or a separate one — separate is cleaner since this one needs write access).
3. `cd functions && npm init -y && npm i -D wrangler`
4. `npx wrangler secret put NOTION_TOKEN`
5. `npx wrangler secret put NOTION_REGISTRATIONS_DB_ID`
6. `npx wrangler deploy`
7. Copy the deployed `*.workers.dev` URL (or your custom domain) into the site's `.env` as `VITE_REGISTER_ENDPOINT=https://.../register`
8. Rebuild the site (`npm run build`) so the frontend picks up the endpoint.

## Alternatives considered

- **Third-party form service** (Formspree/Getform): less setup, but another vendor and less control over the Notion write.
- **PHP on Hostinger**: viable if you're on shared hosting and want everything in one place, but you'd be calling the Notion API from PHP and managing the secret in Hostinger's file manager/env instead of a proper secrets store.
