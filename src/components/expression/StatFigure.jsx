import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Split "15+" / "500+" / "1,200" into { prefix, target, suffix } so we can roll
// the numeric part up while keeping any leading/trailing symbol.
function parseValue(str) {
  const m = String(str).match(/^(\D*)([\d,]+)(\D*)$/)
  if (!m) return null
  const [, prefix, digits, suffix] = m
  return { prefix, suffix, target: Number(digits.replace(/,/g, '')), hasComma: digits.includes(',') }
}

// Big stat: condensed number over a caption. The number rolls up from zero (GSAP)
// the first time it scrolls into view. `dark` flips to white text over imagery.
export default function StatFigure({ value, label, dark = false, size = 'lg', className = '' }) {
  const parsed = parseValue(value)
  const ref = useRef(null)
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value)

  useEffect(() => {
    const el = ref.current
    if (!parsed || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    gsap.set(el, { autoAlpha: 0, y: 16 })
    let tween
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        const counter = { v: 0 }
        tween = gsap.to(counter, {
          v: parsed.target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            const n = Math.round(counter.v)
            setDisplay(`${parsed.prefix}${parsed.hasComma ? n.toLocaleString('en-US') : n}${parsed.suffix}`)
          },
        })
        obs.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      tween?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const color = dark ? 'text-neutral-white' : 'text-neutral-black'
  const valueSize =
    size === 'xl'
      ? 'text-8xl lg:text-9xl'
      : size === 'md'
        ? 'text-5xl lg:text-6xl'
        : 'text-7xl lg:text-8xl'
  return (
    <div className={`flex flex-col ${className}`}>
      {/* data-count keeps the page-level reveal from touching the rolling number */}
      <p
        ref={ref}
        data-count
        className={`font-condensed font-bold leading-[1] tabular-nums ${valueSize} ${color}`}
      >
        {display}
      </p>
      <p className={`mt-xs max-w-[14rem] text-lg leading-snug ${color}`}>{label}</p>
    </div>
  )
}
