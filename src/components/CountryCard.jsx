import CircleFlag, { FLAG_ACCENTS } from './CircleFlag.jsx'

// Pick black or white text for a given background so the stub stays legible
// whatever flag colour it's sampled from (e.g. saffron → black, navy → white).
function readableText(hex) {
  const c = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.4 ? '#0b0b0b' : '#ffffff'
}

// Top-view airliner (nose right), rebuilt clean — the Figma airplane was ~90
// stacked vectors. Tints via currentColor.
function AirplaneTopIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M480 256c0 13.8-12.5 25-28 25l-132.7 0-83.6 128.5c-2.9 4.5-7.9 7.2-13.2 7.2l-37.3 0c-7.6 0-13.1-7.3-11-14.6L163 281 94.2 281l-37.4 44.9c-2.7 3.2-6.7 5.1-10.9 5.1l-23.6 0c-5.6 0-9.7-5.3-8.3-10.7L36.9 256 13.5 182.7c-1.4-5.4 2.7-10.7 8.3-10.7l23.6 0c4.2 0 8.2 1.9 10.9 5.1L93.7 231l68.8 0L124.9 116.9c-2.1-7.3 3.4-14.6 11-14.6l37.3 0c5.3 0 10.3 2.7 13.2 7.2L269.3 231 452 231c15.5 0 28 11.2 28 25z" />
    </svg>
  )
}

// Figma: Country card (node 132:3329). Feature image with a circular country
// flag top-right, and a dashed-top "boarding pass stub" footer holding the host
// church, city, and airport code beside the airliner. Fixed proportions from the
// design (394×581) expressed fluidly so it tiles in a responsive grid.
// Two sizes: the full destination card, and a `compact` variant for the small
// cards that float in the MissionSection.
const SIZES = {
  default: {
    card: 'max-w-[24.625rem]',
    flag: 'size-14 right-2.5 top-2.5',
    stub: 'gap-sm px-sm py-md',
    church: 'text-lg',
    title: 'text-5xl',
    plane: 'w-28 sm:w-32',
  },
  // Small floating MissionSection cards — scaled down a further 20%.
  compact: {
    card: 'max-w-[9.5rem]',
    flag: 'size-[1.4rem] right-1.5 top-1.5',
    stub: 'gap-1 px-2 py-2',
    church: 'text-[0.45rem]',
    title: 'text-[0.95rem]',
    plane: 'w-9',
  },
}

export default function CountryCard({
  image,
  imageAlt,
  country,
  church,
  city,
  code,
  flag,
  accent,
  compact = false,
  className = '',
}) {
  // Stub colour: explicit `accent` prop, else the country's flag accent, else the
  // brand green. Text/plane and the dashed perforation adapt to stay legible.
  const bg = accent ?? FLAG_ACCENTS[country?.toLowerCase()] ?? '#0e6537'
  const fg = readableText(bg)
  const border = fg === '#ffffff' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)'
  const s = compact ? SIZES.compact : SIZES.default

  return (
    <article className={`flex w-full ${s.card} flex-col overflow-hidden rounded-md ${className}`}>
      {/* feature image + flag badge */}
      <div className="relative aspect-[372/359] w-full bg-neutral-gray-100">
        <img src={image} alt={imageAlt ?? city ?? country} className="absolute inset-0 size-full object-cover" />
        <div className={`absolute ${s.flag}`}>
          {flag ?? <CircleFlag country={country} className="size-full" />}
        </div>
      </div>

      {/* detail stub — dashed perforation on top, like a boarding pass */}
      <div
        className={`flex items-center border-t-4 border-dashed ${s.stub}`}
        style={{ backgroundColor: bg, color: fg, borderColor: border }}
      >
        <div className="flex min-w-0 flex-1 flex-col font-heading font-semibold">
          {church && <p className={`${s.church} leading-snug`}>{church}</p>}
          {/* leading-[1] not leading-none: --spacing-none shadows it to line-height 0 */}
          <p className={`${s.title} leading-[1]`}>{city}</p>
          <p className={`${s.title} leading-[1]`}>{code}</p>
        </div>
        <AirplaneTopIcon className={`${s.plane} shrink-0`} />
      </div>
    </article>
  )
}
