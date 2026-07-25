import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import CountryCard from '../components/CountryCard.jsx'
import site from '../content/site.json'
import expressions from '../content/expressions.json'

const base = import.meta.env.BASE_URL

// Curated real airport codes for the boarding-pass card — only added where the
// host city is confirmed, never guessed. Cards without an entry here simply
// omit the code line (CountryCard renders it conditionally).
const IATA_BY_SLUG = {
  brazil: 'BSB', // Brasília
  ghana: 'ACC', // Accra
}

// One card per expression synced from the HOWJ Global Notion database
// (src/content/expressions.json, written by scripts/fetch-expressions.mjs).
// Only Published rows with a real Slug make it into that file, so this list
// grows automatically as more expressions go live — no hardcoding here.
const cards = Object.values(expressions).sort((a, b) => a.slug.localeCompare(b.slug))

export default function Expressions() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        {site.expressions?.heading ?? 'Expressions'}
      </Reveal>

      {cards.length === 0 ? (
        <p className="mt-6 max-w-[32rem] text-neutral-black/70">
          No expressions published yet — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((exp, i) => (
            <Reveal key={exp.slug} delay={i * 80}>
              <Link to={`/expression/${exp.slug}`} className="block transition hover:opacity-90">
                <CountryCard
                  image={exp.heroImage ? base + exp.heroImage.replace(/^\//, '') : undefined}
                  country={exp.country}
                  church={exp.venue?.split('\n')[0].trim()}
                  city={exp.city}
                  code={IATA_BY_SLUG[exp.slug]}
                />
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
