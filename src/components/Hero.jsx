import Reveal from './Reveal.jsx'
import HeroBackground from './HeroBackground.jsx'
import BoardingPassCard from './BoardingPassCard.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'

export default function Hero() {
  return (
    <section>
      {/* Negative top margin pulls the video under the sticky navbar so it runs
          edge-to-edge behind it; offsets match the navbar's height + top padding. */}
      <div className="relative -mt-[60px] sm:-mt-[64px] lg:-mt-[112px]">
        <HeroBackground />
        <div className="relative mx-auto flex min-h-svh max-w-7xl items-center px-6 pb-2xl pt-[84px] sm:pt-[88px] lg:px-2xl lg:pt-[136px]">
          <Reveal>
            <BoardingPassCard />
          </Reveal>
        </div>
      </div>
      <MarqueeBanner />
    </section>
  )
}
