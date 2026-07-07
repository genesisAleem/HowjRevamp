import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PlaneIcon from './PlaneIcon.jsx'

const MS_DAY = 86_400_000
const MS_HOUR = 3_600_000
const MS_MIN = 60_000

function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, new Date(targetDate).getTime() - now)
  return {
    days: Math.floor(diff / MS_DAY),
    hours: Math.floor((diff % MS_DAY) / MS_HOUR),
    mins: Math.floor((diff % MS_HOUR) / MS_MIN),
    secs: Math.floor((diff % MS_MIN) / 1000),
  }
}

function JamaicaFlagIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <defs>
        <clipPath id="jm-flag-circle">
          <circle cx="28" cy="28" r="28" />
        </clipPath>
      </defs>
      <g clipPath="url(#jm-flag-circle)">
        <rect width="56" height="56" fill="#000000" />
        <path d="M0 0h56L28 28Z" fill="#009b3a" />
        <path d="M0 56h56L28 28Z" fill="#009b3a" />
        <path d="M0 0l56 56M56 0L0 56" stroke="#fed100" strokeWidth="9" fill="none" />
      </g>
    </svg>
  )
}

function CalendarIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
      <g fill="currentColor" stroke="none">
        {[7.2, 10.4, 13.6, 16.8].map((x) => (
          <g key={x}>
            <circle cx={x} cy="13.5" r="1" />
            <circle cx={x} cy="17.2" r="1" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function BoardingPassCard({
  title = 'HOWJ JAMAICA',
  airportCode = 'MBJ',
  location = 'MONTEGO BAY, JAMAICA',
  dateLabel = '12 DECEMBER, 2026',
  targetDate = '2026-12-12T00:00:00',
}) {
  const { days, hours, mins, secs } = useCountdown(targetDate)
  const units = [
    [days, 'DAYS'],
    [String(hours).padStart(2, '0'), 'HOURS'],
    [String(mins).padStart(2, '0'), 'MIN'],
    [String(secs).padStart(2, '0'), 'SECONDS'],
  ]

  // max-w-[22.4rem] not max-w-*: the custom --spacing-* tokens shadow the container scale
  return (
    <div className="flex w-full max-w-[22.4rem] flex-col bg-brand-primary-900 p-sm">
      {/* Ticket stub — dashed border is the boarding-pass perforation, plane sits on it */}
      <div className="relative">
        <div className="flex items-center justify-center rounded-t-sm border-b-[3px] border-dashed border-neutral-gray-500 bg-neutral-white px-md py-md">
          <p className="font-heading text-3xl font-bold text-brand-primary-900 sm:text-4xl">
            {title}
          </p>
        </div>
        <PlaneIcon className="absolute bottom-0 left-1/2 w-13 -translate-x-1/2 translate-y-1/2 text-brand-secondary" />
      </div>

      {/* Ticket body */}
      <div className="flex flex-col items-center bg-neutral-white pb-sm pt-xs">
        {/* leading-[1] not leading-none: --spacing-none shadows it to line-height 0 */}
        <p className="font-heading text-7xl font-bold leading-[1] text-brand-primary-900 sm:text-8xl">
          {airportCode}
        </p>

        <div className="mt-sm flex w-full items-center px-lg">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary-700 text-neutral-white">
            <PlaneIcon className="w-7" />
          </span>
          <span className="h-0 flex-1 border-t-2 border-neutral-gray-300" />
          <JamaicaFlagIcon className="size-11 shrink-0" />
        </div>
        <p className="mt-xs font-condensed text-base tracking-wide text-text-muted">{location}</p>

        <div className="mt-sm flex w-full items-center gap-md border-t border-border-default px-lg pt-sm">
          <CalendarIcon className="size-6 shrink-0 text-text-muted" />
          <p className="font-condensed text-base tracking-wide text-text-muted">{dateLabel}</p>
        </div>
      </div>

      {/* Countdown */}
      <div className="grid w-full grid-cols-4 rounded-b-sm bg-brand-secondary px-sm py-sm text-brand-secondary-700">
        {units.map(([value, label]) => (
          <div key={label} className="flex flex-col items-center">
            <p className="font-heading text-4xl font-bold leading-[1] sm:text-5xl">{value}</p>
            <p className="mt-1 text-2xs font-bold tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      <Link
        to="/register"
        className="mt-sm flex items-center justify-center rounded-sm bg-brand-secondary py-3 font-heading text-2xl font-bold text-neutral-black transition hover:brightness-95 sm:text-3xl"
      >
        REGISTER
      </Link>
    </div>
  )
}
