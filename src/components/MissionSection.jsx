import Reveal from './Reveal.jsx'
import CountryCard from './CountryCard.jsx'
import watermark from '../assets/brand/howj-logo-grey.svg'

const base = import.meta.env.BASE_URL

// Cities covered over the past 4 years — scroll left→right in the top marquee.
const cities = [
  'BRASILIA', 'NEW YORK', 'KERALA', 'CHICAGO', 'ATLANTA', 'LAGOS',
  'SEOUL', 'ACCRA', 'LONDON', 'NAIROBI', 'DHAKA',
]

// Mission headline, split into words so each can reveal on a stagger; `c` colours
// the highlighted word (magenta / green / gold, echoing the floating card accents).
const lines = [
  [{ t: 'Jesus' }, { t: 'Christ' }, { t: 'Revealed', c: 'text-accent-magenta-500' }],
  [{ t: 'Disciples' }, { t: 'Made', c: 'text-brand-primary-700' }],
  [{ t: 'Souls' }, { t: 'Saved', c: 'text-brand-secondary-500' }],
]

function CityMarquee() {
  return (
    <div className="marquee border-y border-neutral-black/10 py-5">
      <div className="marquee-track">
        {[false, true].map((clone) => (
          <div key={clone ? 'clone' : 'original'} className="flex" aria-hidden={clone || undefined}>
            {cities.map((city) => (
              <span key={city} className="flex items-center whitespace-nowrap">
                <span className="px-8 font-heading text-xl font-semibold uppercase tracking-wide text-neutral-black sm:px-12 sm:text-2xl">
                  {city}
                </span>
                <span className="size-1.5 rounded-full bg-brand-secondary" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MissionSection() {
  let word = 0 // running index across all words, for the stagger delay
  return (
    <section className="bg-surface-page">
      <CityMarquee />

      <div className="relative overflow-hidden">
        {/* faint brand watermark bleeding off the bottom-left, behind everything */}
        <img
          src={watermark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 z-0 w-[34rem] max-w-[70%] opacity-[0.06]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-2xl lg:min-h-[46rem] lg:py-3xl">
          {/* intro + divider */}
          <Reveal className="max-w-[34rem]">
            <p className="text-2xl text-neutral-black sm:text-3xl">Our mission is to see</p>
            <div className="mt-5 h-px w-full bg-neutral-black/25" />
          </Reveal>

          {/* split-text headline */}
          <h2 className="mt-2xl max-w-[46rem] font-heading text-6xl font-bold leading-[1.02] text-neutral-black sm:text-7xl lg:max-w-none lg:text-8xl">
            {lines.map((line, li) => (
              <span key={li} className="block lg:whitespace-nowrap">
                {line.map(({ t, c }) => {
                  const delay = word++ * 90
                  return (
                    <Reveal
                      key={t}
                      as="span"
                      delay={delay}
                      className={`inline-block ${c ?? ''}`}
                    >
                      {t}
                      {' '}
                    </Reveal>
                  )
                })}
              </span>
            ))}
          </h2>

          {/* floating destination cards — stacked on mobile, absolute on lg+ */}
          <div className="mt-2xl flex flex-col items-center gap-10 lg:mt-0 lg:block">
            <div className="float-y w-[9.5rem] lg:absolute lg:right-0 lg:top-8">
              <CountryCard
                compact
                accent="#d81b60"
                country="Korea"
                church="The Amen"
                city="Seoul"
                code="ICN"
                image={`${base}gallery/korea-outreach-01.jpg`}
              />
            </div>
            <div className="float-y-slow w-[9.5rem] lg:absolute lg:bottom-10 lg:right-24">
              <CountryCard
                compact
                accent="#880e4f"
                country="Bangladesh"
                church="The Lord of Lords"
                city="Bangladesh"
                code="CGP"
                image={`${base}gallery/India-charity-02.jpg`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
