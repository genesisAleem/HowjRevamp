import Reveal from './Reveal.jsx'
import HeroBackground from './HeroBackground.jsx'
import BoardingPassCard from './BoardingPassCard.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'

export default function Hero() {
  return (
    <section>
      <div className="relative">
        <HeroBackground />
        <div className="relative mx-auto max-w-7xl px-6 py-2xl sm:py-3xl lg:px-2xl">
          <Reveal>
            <BoardingPassCard />
          </Reveal>
        </div>
      </div>
      <MarqueeBanner />
    </section>
  )
}
