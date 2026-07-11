import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import Reveal from '../components/Reveal.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import StatsSection from '../components/StatsSection.jsx'
import RecapSection from '../components/RecapSection.jsx'
import MinistersSection from '../components/MinistersSection.jsx'
import MissionSection from '../components/MissionSection.jsx'
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

      <section className="bg-neutral-black/5 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal as="h2" className="font-heading text-3xl font-semibold">
            A taste of what's ahead
          </Reveal>
          <div className="mt-8">
            <GalleryGrid />
          </div>
          <Reveal delay={200} className="mt-8">
            <Link to="/gallery" className="font-semibold text-brand-secondary hover:underline">
              See the full gallery →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
