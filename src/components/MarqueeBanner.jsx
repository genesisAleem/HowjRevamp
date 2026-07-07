import { Link } from 'react-router-dom'
import PlaneIcon from './PlaneIcon.jsx'

function MarqueeItem({ text }) {
  return (
    <div className="flex items-center gap-xl pr-xl sm:gap-2xl sm:pr-2xl">
      <p className="whitespace-nowrap font-heading text-2xl font-bold uppercase text-neutral-black sm:text-4xl">
        {text}
      </p>
      <PlaneIcon className="w-16 shrink-0 text-brand-secondary sm:w-24" />
      <Link
        to="/register"
        className="flex shrink-0 items-center justify-center rounded-sm bg-brand-secondary px-2xl py-xs font-heading text-2xl text-neutral-black transition hover:brightness-95 sm:px-3xl sm:py-sm sm:text-3xl"
      >
        REGISTER
      </Link>
    </div>
  )
}

// Infinite right-to-left scroll, pure CSS (keyframes in index.css), pauses on hover.
// The track holds two identical halves so translateX(-50%) loops seamlessly; each
// half repeats the item enough times to cover ultrawide viewports.
export default function MarqueeBanner({ text = 'HANGOUT WITH JESUS JAMAICA MONTEGO BAY' }) {
  return (
    <div className="marquee bg-brand-primary py-xs sm:py-sm">
      <div className="marquee-track">
        {[false, true].map((clone) => (
          <div key={clone ? 'clone' : 'original'} className="flex" aria-hidden={clone || undefined}>
            {[0, 1, 2].map((i) => (
              <MarqueeItem key={i} text={text} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
