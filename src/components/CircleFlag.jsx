import { useId } from 'react'

// Notion's Country field is free text ("United States", "USA", "South Korea"…) —
// normalize the common spellings down to the flag/accent keys below.
const ALIASES = {
  'united states': 'usa',
  usa: 'usa',
  us: 'usa',
  'united kingdom': 'uk',
  uk: 'uk',
  'great britain': 'uk',
  'united arab emirates': 'uae',
  uae: 'uae',
  'south korea': 'korea',
  korea: 'korea',
  'republic of korea': 'korea',
}

export function normalizeCountry(name) {
  if (!name) return undefined
  const key = name.trim().toLowerCase()
  return ALIASES[key] ?? key
}

// Signature colour sampled from each flag — used as the CountryCard stub accent
// so the card is colour-coded per country. Keep a key here for every `flags` key.
export const FLAG_ACCENTS = {
  brazil: '#009b3b', // green field
  ghana: '#ce1126', // red band
  india: '#ff9933', // saffron band
  korea: '#cd2e3a', // taegeuk red
  bangladesh: '#006a4e', // green field
  usa: '#b22234', // old glory red
  uk: '#00247d', // navy
  uae: '#ff0000', // hoist red band
  nigeria: '#008751', // green
  kenya: '#bb0000', // red band
}

// Circular country-flag badges, rebuilt as clean SVGs (the Figma export was
// ~100 stacked vector masks). Add a country by dropping its artwork into `flags`.
const flags = {
  brazil: (
    <>
      <rect width="56" height="56" fill="#009c3b" />
      <path d="M28 6 52 28 28 50 4 28Z" fill="#ffdf00" />
      <circle cx="28" cy="28" r="9.5" fill="#002776" />
    </>
  ),
  ghana: (
    <>
      <rect width="56" height="56" fill="#006b3f" />
      <rect width="56" height="37.34" fill="#fcd116" />
      <rect width="56" height="18.67" fill="#ce1126" />
      <path
        d="M28 20.5l2.7 8.4h8.8l-7.1 5.2 2.7 8.4-7.1-5.2-7.1 5.2 2.7-8.4-7.1-5.2h8.8z"
        fill="#000"
      />
    </>
  ),
  india: (
    <>
      <rect width="56" height="56" fill="#138808" />
      <rect width="56" height="37.34" fill="#fff" />
      <rect width="56" height="18.67" fill="#ff9933" />
      <circle cx="28" cy="28" r="6" fill="none" stroke="#000080" strokeWidth="1.3" />
      <circle cx="28" cy="28" r="1.1" fill="#000080" />
    </>
  ),
  korea: (
    <>
      <rect width="56" height="56" fill="#fff" />
      {/* taegeuk: blue disc with the red swirl overlaid on top */}
      <circle cx="28" cy="28" r="11" fill="#0047a0" />
      <path
        d="M17 28 A11 11 0 0 1 39 28 A5.5 5.5 0 0 1 28 28 A5.5 5.5 0 0 0 17 28 Z"
        fill="#cd2e3a"
      />
      {/* four simplified trigrams */}
      <g stroke="#000" strokeWidth="1.2">
        <path d="M11 15h6M11 17.5h6M11 20h6" />
        <path d="M39 15h6M39 17.5h6M39 20h6" />
        <path d="M11 36h6M11 38.5h6M11 41h6" />
        <path d="M39 36h6M39 38.5h6M39 41h6" />
      </g>
    </>
  ),
  bangladesh: (
    <>
      <rect width="56" height="56" fill="#006a4e" />
      <circle cx="25" cy="28" r="11" fill="#f42a41" />
    </>
  ),
  usa: (
    <>
      <rect width="56" height="56" fill="#fff" />
      <rect y="0" width="56" height="8" fill="#b22234" />
      <rect y="16" width="56" height="8" fill="#b22234" />
      <rect y="32" width="56" height="8" fill="#b22234" />
      <rect y="48" width="56" height="8" fill="#b22234" />
      <rect width="24" height="32" fill="#3c3b6e" />
    </>
  ),
  uk: (
    <>
      <rect width="56" height="56" fill="#00247d" />
      <path d="M0 0 L56 56 M56 0 L0 56" stroke="#fff" strokeWidth="10" />
      <path d="M0 0 L56 56 M56 0 L0 56" stroke="#cf142b" strokeWidth="4" />
      <path d="M28 0 V56 M0 28 H56" stroke="#fff" strokeWidth="16" />
      <path d="M28 0 V56 M0 28 H56" stroke="#cf142b" strokeWidth="8" />
    </>
  ),
  uae: (
    <>
      <rect width="56" height="56" fill="#fff" />
      <rect width="56" height="18.67" fill="#00732f" />
      <rect y="18.67" width="56" height="18.67" fill="#fff" />
      <rect y="37.34" width="56" height="18.66" fill="#000" />
      <rect width="16" height="56" fill="#ff0000" />
    </>
  ),
  nigeria: (
    <>
      <rect width="18.67" height="56" fill="#008751" />
      <rect x="18.67" width="18.67" height="56" fill="#fff" />
      <rect x="37.34" width="18.66" height="56" fill="#008751" />
    </>
  ),
  kenya: (
    <>
      <rect width="56" height="56" fill="#fff" />
      <rect width="56" height="16" fill="#000" />
      <rect y="20" width="56" height="16" fill="#bb0000" />
      <rect y="40" width="56" height="16" fill="#006600" />
      <rect y="16" width="56" height="4" fill="#fff" />
      <rect y="36" width="56" height="4" fill="#fff" />
      <path d="M28 20 L36 24 V34 Q28 40 20 34 V24 Z" fill="#bb0000" stroke="#000" strokeWidth="1.5" />
    </>
  ),
}

export default function CircleFlag({ country, className = '' }) {
  const clipId = useId()
  const key = normalizeCountry(country)
  const art = flags[key]
  return (
    <svg
      viewBox="0 0 56 56"
      className={className}
      role="img"
      aria-label={country ? `${country} flag` : 'flag'}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="28" cy="28" r="28" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{art ?? <rect width="56" height="56" fill="#a6a6a6" />}</g>
    </svg>
  )
}
