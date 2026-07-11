import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Split "450k" / "1500+" / "12+" into { prefix, target, suffix } so we can count
// the numeric part up while preserving any leading/trailing symbol.
function parseNumber(str) {
  const m = String(str).match(/^(\D*)([\d,]+)(\D*)$/)
  if (!m) return null
  const [, prefix, digits, suffix] = m
  return {
    prefix,
    suffix,
    target: Number(digits.replace(/,/g, '')),
    hasComma: digits.includes(','),
  }
}

// Atom for the StatsSection figures: optional pre-label, massive number, wrapping
// label. The number counts up from zero (GSAP tween) the first time it scrolls
// into view. All text renders in text-inverse (white).
export default function StatBlock({ preLabel, number, label }) {
  const parsed = parseNumber(number)
  const ref = useRef(null)
  const [display, setDisplay] = useState(
    parsed ? `${parsed.prefix}0${parsed.suffix}` : number,
  )

  useEffect(() => {
    const el = ref.current
    if (!parsed || !el) {
      setDisplay(number)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(number)
      return
    }

    let tween
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return
        const counter = { val: 0 }
        tween = gsap.to(counter, {
          val: parsed.target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            const n = Math.round(counter.val)
            const s = parsed.hasComma ? n.toLocaleString('en-US') : String(n)
            setDisplay(`${parsed.prefix}${s}${parsed.suffix}`)
          },
        })
        obs.disconnect()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      tween?.kill()
    }
    // parsed is derived from `number`; re-run only when the number changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number])

  return (
    <div className="flex flex-col gap-xs text-text-inverse">
      {preLabel && <p className="text-sm text-text-inverse/70">{preLabel}</p>}
      {/* leading-[1] not leading-none: --spacing-none shadows it to line-height 0.
          tabular-nums keeps the width steady so the count-up doesn't jitter. */}
      <p ref={ref} className="font-heading text-7xl font-bold leading-[1] tabular-nums sm:text-8xl">
        {display}
      </p>
      <p className="max-w-[14rem] text-lg leading-snug">{label}</p>
    </div>
  )
}
