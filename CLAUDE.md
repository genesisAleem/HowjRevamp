# HOWJ Website — project context

This site was scaffolded in a prior session (Cowork). Read this before making changes so you don't redo decisions or re-ask questions already answered. See also `README.md` for setup/deploy commands and `functions/README.md` for the registration function.

## Stack decisions (already made, don't re-litigate without reason)

- **Vite + React**, not Next.js — Hostinger is standard shared hosting (static files only), so the site ships as a static SPA.
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`, theme lives entirely in `src/index.css` under `@theme`.
- **No GSAP** — brief was "simple fades/reveals," handled by `src/hooks/useReveal.js` (IntersectionObserver) + `.reveal` CSS class. Only reach for GSAP/ScrollTrigger if the design calls for parallax/pinning/scrubbed timelines.
- **Notion as CMS**, build-time fetch only — `scripts/fetch-notion-content.mjs` runs as `prebuild`, writes `src/content/site.json`. No client-side Notion calls (keeps the token server-side, no runtime dependency on Notion).
- **Registrations** (name/email/phone) → `src/components/RegisterForm.jsx` → `src/lib/submitRegistration.js` → a Cloudflare Worker at `functions/register.js` (deployed separately, NOT on Hostinger — shared hosting can't run server code) → writes to a Notion database. See `functions/README.md` for deploy steps.

## Design tokens — current state

`design/figma/tokens.json` is the source of truth, pasted in from Figma exports. It's been updated once already (moved from a flat palette to a full primitive scale: `brand-primary-100..900`, `brand-secondary-100..900`, `neutral-gray-100..900`, `accent-{red,magenta,maroon}-100..900`, plus a fontSizes scale from `3xs` to `10xl`).

`src/index.css` mirrors it in three layers:
1. **Primitives** — direct from tokens.json (`--color-brand-primary-500`, etc.)
2. **Semantic aliases** — `--color-surface-brand`, `--color-text-primary`, `--color-border-default`, etc. **These are NOT in tokens.json** — they were inferred by convention so utility classes like `bg-surface-brand` work. If the Figma file has an actual semantic variable collection (separate from the primitive scale), pull that and replace the inferred mapping.
3. **Flat back-compat** — `--color-brand-primary`, `--color-brand-secondary` (aliased to the `-500` shade of each scale) because early components were written against these flat names before the scale existed.

**Tailwind v4 namespace-shadowing gotcha (bit us once, will bite again):** the custom `--spacing-{none,xs,sm,md,lg,xl,2xl,3xl,4xl}` tokens shadow Tailwind's built-in scales for any utility that also resolves from the spacing namespace. Concretely: `max-w-md` resolves to 24px (not 28rem) and `leading-none` resolves to line-height 0 (text collapses/overlaps). Use arbitrary values instead: `max-w-[28rem]`, `leading-[1]`. Existing `max-w-{xl,2xl,3xl}` usages in pages were already converted to arbitrary rem values.

**Open question, unresolved:** `brand.secondary` changed from deep green (`#008236`) to yellow/gold (`#FEDF00`) between token file versions. Existing components (Navbar active link, Register button, Hero CTA area, form focus states) all use `bg-brand-secondary`/`text-brand-secondary` and are now rendering yellow. Not confirmed with the user whether that's intentional or whether those spots should move to a different token (e.g. `text-brand` at the darker `-900` shade for readability). Check before doing more styling work on top of it.

## Content state — still placeholder

`src/content/site.json` has placeholder copy everywhere (`content/copy/` source folder is empty — real copy was never written). Don't treat any hero/about/destinations text as final.

`src/content/gallery.json` was generated from `public/gallery/` (34 photos copied from `assets/images/gallery/`). Two files were added to `assets/` after that sync and are **not yet copied over**: `assets/images/gallery/montegobay.png` and `assets/images/team/Victoria_Orenze.jpg`. Also `assets/icons/Howj Logo.png` exists but isn't wired into the Navbar (which currently uses `assets/icons/svg/plane.svg` as the mark).

## Figma components — hero pulled in, rest pending

The hero section (Figma node `87-5189` in file `Nc7E7NNfdkLjRlxD8eZB4x`) is implemented: `src/components/Hero.jsx` composes `HeroBackground.jsx` (Montego Bay image from `src/assets/hero/`; any `.mp4`/`.webm` dropped into `src/assets/hero/videos/` is auto-discovered via `import.meta.glob` and plays as a looping background playlist in filename order, double-buffered for seamless crossfades — the image stays as the no-video fallback), `BoardingPassCard.jsx` (ticket card with live countdown to 12 Dec 2026), and `MarqueeBanner.jsx` (pure-CSS infinite scroll, keyframes in `index.css`, pauses on hover). `PlaneIcon.jsx` is the brand jet inlined so it tints via `currentColor`; the Jamaica flag and calendar icons are inline SVGs in `BoardingPassCard.jsx`. Fonts (Barlow / Barlow Semi Condensed / Barlow Condensed) are now loaded via Google Fonts in `index.html` — they were declared in the theme but never actually loaded before.

The Navbar (node `86-4096`) is implemented: `src/components/Navbar.jsx` is the floating three-segment mint bar (logo | links | Register CTA) on `brand-primary-300`, 130px tall on desktop, with a hamburger dropdown below `lg` per the design's dev note. It uses the real routes from `site.json` nav — the design's placeholder labels (Give, Partner, FAQ) point to pages that don't exist. Logo is `src/assets/brand/howj-logo-grey.svg` (copied from `assets/icons/Howjlogo-grey.svg`).

Still hand-built (not yet from Figma): Footer, everything else. Same workflow: node-specific URL → `get_design_context`.

## Known non-issue from the prior environment

The prior session hit file-corruption issues (null-byte padding) when overwriting pre-existing files through its sandboxed file-mount tooling — worked around by writing files via shell heredoc instead. This was specific to that sandbox's fuse-mount setup and does not apply here; normal file writes are fine.

## Other loose ends

- `assets/icons/svg/WORLDMAP.svg` (3.7MB) is no longer imported — the hero rewrite dropped it, so it's out of the bundle. `src/assets/brand/worldmap.svg` is now an unused leftover.
- `src/assets/hero/montegobay.png` (2.4MB, copied from `assets/images/gallery/`) is the hero background and should be compressed/resized (or replaced by the background video) before launch. It's still NOT in `public/gallery/` for the gallery page.
- `code/` at the project root is a leftover empty placeholder folder from before the Vite scaffold existed — superseded by `src/`, safe to ignore/remove.
- `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `src/App.css` are unused leftovers from the initial `create-vite` template — harmless, not imported anywhere.
