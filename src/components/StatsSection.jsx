import { Fragment, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import StatBlock from './StatBlock.jsx'
import photos from '../content/gallery.json'
import logo from '../assets/brand/howj-logo-white.svg'

// Charity photos drive the background slideshow, pulled from the tagged gallery
// manifest so new charity images join automatically once synced. BASE_URL prefix
// keeps the /gallery/ paths correct under the GitHub Pages subpath.
const charitySlides = photos
  .filter((p) => p.category === 'charity')
  .map((p) => import.meta.env.BASE_URL + p.src.replace(/^\//, ''))

// Symmetric grid from Figma (node 158:5433): left / center-logo / right columns,
// three rows. The logo sits in the middle cell; "In 4 years" is an eyebrow above.
//   12+            18
//   13+   [logo]   Countless
//   450k           1500+
const leftColumn = [
  { number: '12+', label: 'countries sent to' },
  { number: '13+', label: 'Mission Completed' },
  { number: '450k', label: 'souls documented for christ in person' },
]
const rightColumn = [
  { number: '18', label: 'Charity welfare outreaches to the poor and forgotten' },
  { text: 'Countless healings, testimonies and deliverance' },
  { number: '1500+', label: 'people combined have assembled to experience jesus christ' },
]

function StatItem({ stat }) {
  if (stat.text) {
    return (
      <p className="max-w-[13rem] text-center text-xl font-semibold leading-snug text-text-inverse lg:text-left">
        {stat.text}
      </p>
    )
  }
  return <StatBlock number={stat.number} label={stat.label} />
}

// Dotted flight-path curves from Figma (node 152:5690), desktop only. Each of the
// three sub-curves draws on one after another (staggered --d), a start-dot fades
// in with each, and the plane lands last. The dotted look lives on the visible
// stroke; the draw-on is a thick-stroke mask whose dashoffset animates 1→0.
const CURVES = [
  { d: 'M815.138 566.337C536.638 1334.34 -341.863 789.337 148.633 110.337', start: [815.138, 566.337], delay: 0 },
  {
    d: 'M493.633 160.837C701.133 -101.663 956.11 21.5601 954.134 110.337C951.664 221.307 819.174 255.337 771.134 173.337C691.75 37.8369 952.134 -46.6632 1166.63 95.8368',
    start: [493.633, 160.837],
    delay: 1.2,
  },
  { d: 'M1223.64 893.837C1736.78 820.412 1668.14 221.337 1478.64 95.8368', start: [1223.64, 893.837], delay: 2.4 },
]
const PLANE_DELAY = 3.6

function OrbitCurves() {
  return (
    <svg viewBox="0 0 1621.9 943.294" fill="none" preserveAspectRatio="xMidYMid meet" className="size-full">
      <defs>
        {CURVES.map((c, i) => (
          <mask key={i} id={`orbit-mask-${i}`} maskUnits="userSpaceOnUse">
            <path
              d={c.d}
              pathLength="1"
              fill="none"
              stroke="#fff"
              strokeWidth="16"
              className="orbit-draw"
              style={{ '--d': `${c.delay}s` }}
            />
          </mask>
        ))}
      </defs>
      {CURVES.map((c, i) => (
        <path
          key={i}
          d={c.d}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray="8 8"
          opacity="0.9"
          mask={`url(#orbit-mask-${i})`}
        />
      ))}
      {/* start-dot markers, fading in with each curve */}
      {CURVES.map((c, i) => (
        <circle
          key={i}
          cx={c.start[0]}
          cy={c.start[1]}
          r="9"
          fill="#fff"
          className="orbit-fade"
          style={{ '--d': `${c.delay}s` }}
        />
      ))}
      {/* plane — lands last, lower-left, angled up the curve (Figma 158:7624:
          ~7.7% left / ~79% down, rotate -123.71°) */}
      <g
        className="orbit-fade"
        style={{ '--d': `${PLANE_DELAY}s` }}
        transform="translate(230 828) rotate(-123.71) scale(0.26) translate(-256 -256)"
      >
        <path
          fill="#fff"
          d="M480 256c0 13.8-12.5 25-28 25l-132.7 0-83.6 128.5c-2.9 4.5-7.9 7.2-13.2 7.2l-37.3 0c-7.6 0-13.1-7.3-11-14.6L163 281 94.2 281l-37.4 44.9c-2.7 3.2-6.7 5.1-10.9 5.1l-23.6 0c-5.6 0-9.7-5.3-8.3-10.7L36.9 256 13.5 182.7c-1.4-5.4 2.7-10.7 8.3-10.7l23.6 0c4.2 0 8.2 1.9 10.9 5.1L93.7 231l68.8 0L124.9 116.9c-2.1-7.3 3.4-14.6 11-14.6l37.3 0c5.3 0 10.3 2.7 13.2 7.2L269.3 231 452 231c15.5 0 28 11.2 28 25z"
        />
      </g>
    </svg>
  )
}

export default function StatsSection() {
  // Slower background pace: 8s per slide with a 2s crossfade (see the img classes).
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (charitySlides.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % charitySlides.length), 8000)
    return () => clearInterval(id)
  }, [])

  // GSAP center-logo animation: on scroll-in, the logo eases up from small +
  // faded + tilted, then settles into a gentle, endless float.
  const logoRef = useRef(null)
  useEffect(() => {
    const el = logoRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let tl
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        tl = gsap.timeline()
        tl.from(el, { autoAlpha: 0, scale: 0.5, rotate: -8, duration: 1, ease: 'back.out(1.7)' }).to(
          el,
          { yPercent: -6, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true },
        )
        obs.disconnect()
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      tl?.kill()
    }
  }, [])

  // Trigger the orbit draw-on when the section scrolls into view. We observe the
  // always-rendered section (not the `hidden lg:block` orbit div, which reports
  // no intersection while display:none) so the trigger is width-independent.
  const orbitRef = useRef(null)
  const sectionRef = useRef(null)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        orbitRef.current?.classList.add('play')
        obs.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden lg:flex lg:min-h-[140vh] lg:items-center lg:justify-center">
      {/* crossfading slideshow — stacked images fade between each other */}
      <div className="absolute inset-0" aria-hidden="true">
        {charitySlides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[2000ms] ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {/* Gradient overlay: keeps text contrast AND fades to solid black at the
          bottom edge so it blends seamlessly into the RecapSection below. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"
        aria-hidden="true"
      />

      {/* dotted flight-path orbit — desktop only, hidden on mobile */}
      <div ref={orbitRef} className="orbit pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
        <OrbitCurves />
      </div>

      {/* Desktop (lg+): symmetric 3-row grid with the logo dead-center. */}
      <div className="relative z-20 hidden w-full max-w-[60rem] px-6 lg:block">
        <p className="mb-10 text-lg text-text-inverse/80">In 4 years</p>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 gap-y-12 xl:gap-x-16">
          {[0, 1, 2].map((row) => (
            <Fragment key={row}>
              <div className="justify-self-center">
                <StatItem stat={leftColumn[row]} />
              </div>
              {row === 1 ? (
                <img ref={logoRef} src={logo} alt="Hang Out With Jesus" className="w-52 xl:w-60" />
              ) : (
                <div aria-hidden="true" />
              )}
              <div className="justify-self-center">
                <StatItem stat={rightColumn[row]} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile: centered single-column stack. */}
      <div className="relative z-20 flex w-full flex-col items-center gap-2xl px-6 py-2xl lg:hidden">
        <img src={logo} alt="Hang Out With Jesus" className="w-44" />
        <p className="text-lg text-text-inverse/80">In 4 years</p>
        {[...leftColumn, ...rightColumn].map((stat, i) => (
          <StatItem key={i} stat={stat} />
        ))}
      </div>
    </section>
  )
}
