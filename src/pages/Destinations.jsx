import Reveal from '../components/Reveal.jsx'
import CountryCard from '../components/CountryCard.jsx'
import site from '../content/site.json'

const base = import.meta.env.BASE_URL

// Demo line-up. church/city/code are placeholders for Ghana & India (real
// airport codes though) — replace with the actual host churches per destination.
const countryCards = [
  {
    country: 'Brazil',
    church: 'The Redeemer',
    city: 'Brasilia',
    code: 'BSB',
    image: `${base}gallery/brazil-charity-01.jpg`,
  },
  {
    country: 'Ghana',
    church: 'Host Church',
    city: 'Accra',
    code: 'ACC',
    image: `${base}gallery/ghana-charity-01.jpg`,
  },
  {
    country: 'India',
    church: 'Host Church',
    city: 'Kochi',
    code: 'COK',
    image: `${base}gallery/India-charity-01.jpg`,
  },
]

export default function Destinations() {
  const destinations = site.destinations ?? {}
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        {destinations.heading ?? 'Destinations'}
      </Reveal>

      <div className="mt-10 grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {countryCards.map((card, i) => (
          <Reveal key={card.country} delay={i * 80}>
            <CountryCard {...card} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
