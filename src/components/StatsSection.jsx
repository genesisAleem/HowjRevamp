import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Reveal from './Reveal.jsx'
import StatBlock from './StatBlock.jsx'
import photos from '../content/gallery.json'
import logo from '../assets/brand/howj-logo-white.svg'

// Charity photos drive the background slideshow, pulled from the tagged gallery
// manifest so new charity images join automatically once synced. BASE_URL prefix
// keeps the /gallery/ paths correct under the GitHub Pages subpath.
const charitySlides = photos
  .filter((p) => p.category === 'charity')
  .map((p) => import.meta.env.BASE_URL + p.src.replace(/^\//, ''))

// Stats band: four StatBlocks fanned around the white HOWJ logo over a darkened
// charity-photo slideshow. Mobile stacks logo-first in a single column; lg+ is a
// three-column grid (stats | logo | stats) with each side column spread apart.
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
        tl.from(el, {
          autoAlpha: 0,
          scale: 0.5,
          rotate: -8,
          duration: 1,
          ease: 'back.out(1.7)',
        }).to(el, {
          yPercent: -6,
          duration: 2.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
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

  return (
    <section className="relative flex min-h-[140vh] items-center overflow-hidden">
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

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-lg px-6 py-2xl lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-2xl lg:py-3xl">
        {/* left column */}
        <div className="flex flex-col gap-lg lg:min-h-[26rem] lg:justify-between lg:justify-self-center">
          <Reveal>
            <StatBlock preLabel="In 4 years" number="12+" label="countries" />
          </Reveal>
          <Reveal delay={120}>
            <StatBlock number="1500+" label="people combined have assembled to experience jesus christ" />
          </Reveal>
        </div>

        {/* center logo — first on mobile, middle column on lg+ */}
        <img
          ref={logoRef}
          src={logo}
          alt="Hang Out With Jesus"
          className="order-first w-44 self-center lg:order-none lg:w-60"
        />

        {/* right column */}
        <div className="flex flex-col gap-lg lg:min-h-[26rem] lg:justify-between lg:justify-self-center">
          <Reveal delay={60}>
            <StatBlock number="450k" label="souls documented for christ in person" />
          </Reveal>
          <Reveal delay={180}>
            <StatBlock number="12+" label="Mission Completed" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
