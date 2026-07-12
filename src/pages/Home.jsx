import Hero from '../components/Hero.jsx'
import Reveal from '../components/Reveal.jsx'
import StatsSection from '../components/StatsSection.jsx'
import RecapSection from '../components/RecapSection.jsx'
import MinistersSection from '../components/MinistersSection.jsx'
import MissionSection from '../components/MissionSection.jsx'
import CountryShowcase from '../components/CountryShowcase.jsx'
import site from '../content/site.json'

export default function Home() {
  return (
    <>
      <Hero />

      {/* Black master container so the gradient edges of the two sections blend
          into one another with no visible seam. */}
      <div className="bg-black">
        <StatsSection />
        <RecapSection />
      </div>

      <MinistersSection />

      <MissionSection />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal as="h2" className="font-heading text-3xl font-semibold">
          {site.about?.heading}
        </Reveal>
        <Reveal as="p" delay={100} className="mt-4 max-w-[42rem] text-neutral-black/70">
          {site.about?.body}
        </Reveal>
      </section>

      <CountryShowcase />
    </>
  )
}
