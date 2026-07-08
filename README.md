# HOWJ Website

Vite + React + Tailwind CSS. Content is sourced from Notion (build-time fetch), registrations (name/email/phone) are written to a separate Notion database via a small serverless function. Deployed as static files to Hostinger.

## Stack & architecture decisions

- **Vite + React**, not Next.js — the site ships as a static SPA (`dist/`), which is what a standard Hostinger shared-hosting plan can serve. Next.js SSR would need a Hostinger VPS/Cloud plan with Node.js.
- **Tailwind CSS v4**, wired via the `@tailwindcss/vite` plugin (no separate `tailwind.config.js`/PostCSS setup needed — brand tokens live in `src/index.css` under `@theme`).
- **No GSAP** — animation brief was "simple fades/reveals," which `src/hooks/useReveal.js` (IntersectionObserver) + `.reveal` CSS in `src/index.css` handle without adding a dependency. If the design later calls for parallax/pinning/scroll-scrubbed timelines, that's the point to add GSAP + ScrollTrigger.
- **Notion as CMS, build-time fetch** — `scripts/fetch-notion-content.mjs` runs as the `prebuild` npm script, pulls from Notion, and writes `src/content/site.json`. Keeps the Notion token off the client and means no runtime dependency on Notion being up. Tradeoff: content changes need a rebuild to go live.
- **Registrations → separate serverless function → Notion DB** — see `functions/README.md`. This piece can't live on Hostinger shared hosting (no server-side code execution), so it's deployed independently (Cloudflare Workers assumed) and the frontend calls it via `VITE_REGISTER_ENDPOINT`.

## Project layout

```
src/
  components/   Navbar, Footer, Hero, GalleryGrid, RegisterForm, Reveal
  pages/        Home, About, Destinations, Gallery, Register, Contact, NotFound
  hooks/        useReveal.js — scroll-reveal IntersectionObserver hook
  lib/          submitRegistration.js — calls the registration function
  content/      site.json (Notion-sourced), gallery.json (generated from assets)
  assets/brand/ logo mark, plane icon, world map (from assets/icons/svg)
public/gallery/ 34 photos copied from assets/images/gallery
scripts/        fetch-notion-content.mjs — build-time Notion pull
functions/      register.js — Cloudflare Worker, writes signups to Notion
assets/ content/ design/ exports/   original source-material folders (unchanged)
```

Everything under `src/`, `public/`, plus `package.json`/`vite.config.js`/`index.html` is new. The original `assets/`, `content/`, `design/`, `exports/` folders (your source materials — Canva/Figma files, raw photos) are untouched; the site pulls copies of what it needs from them.

## Current state — placeholder content

There's no real copy yet (the `content/copy` folder was empty). `src/content/site.json` has placeholder text everywhere so the site builds and is navigable. Replace it either by:

- Editing `src/content/site.json` directly, or
- Setting up the Notion content database and running `npm run notion:fetch` (see below)

The gallery already uses your 34 real photos from `assets/images/gallery`.

## Local development

```bash
npm install
npm run dev
```

## Setting up Notion content

1. Create a Notion integration (notion.so/my-integrations), copy the token.
2. Create/choose the Notion database or page that will hold site content, share it with the integration.
3. Copy `.env.example` to `.env`, fill in `NOTION_TOKEN` and `NOTION_CONTENT_SOURCE_ID`.
4. `npm run notion:fetch` — check `src/content/site.json` got overwritten.
5. `scripts/fetch-notion-content.mjs` has a `TODO` where the Notion response needs mapping to the `site.json` shape — fill that in once the Notion database's columns/structure are decided.

## Setting up registrations

See `functions/README.md` — deploy the Cloudflare Worker, then set `VITE_REGISTER_ENDPOINT` in `.env`.

## Building & deploying to Hostinger

```bash
npm run build
```

This runs `notion:fetch` first, then outputs static files to `dist/`.

To deploy:
1. Log into Hostinger's hPanel → File Manager (or use FTP).
2. Upload the **contents** of `dist/` (not the folder itself) into `public_html/` (or the relevant domain's document root).
3. Because this is a single-page app with client-side routing (React Router), add a rewrite so all paths fall back to `index.html`. On Hostinger (Apache), create `public_html/.htaccess`:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Open decisions / things to bring over from Canva & Figma

- Real brand colors/fonts (currently placeholder tokens in `src/index.css` `@theme`)
- Real copy for hero, about, destinations, footer
- Figma-based component styling refinements once that design is ready
- Final Notion database schema for both content and registrations
