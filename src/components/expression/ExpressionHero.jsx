// "2025-03-29" -> "March 29, 2025"; passes through already-formatted strings.
function formatDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '')
  if (!m) return value || ''
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Full-bleed hero: expression photo with the logo centered, the category tags as
// a vertical dotted timeline on the right, and a city / venue / date row overlaid
// along the bottom. Pulled up under the sticky navbar so it bleeds to the top.
export default function ExpressionHero({ logo, heroImage, city, venue, date, tags = [] }) {
  // Smooth-scroll to the target section (scroll-margin on the anchors clears the
  // sticky navbar). Explicit handler is more reliable than native hash scrolling
  // inside the SPA router.
  const jumpTo = (event, target) => {
    event.preventDefault()
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative -mt-[60px] sm:-mt-[64px] lg:-mt-[112px]">
      <img
        src={heroImage}
        alt=""
        className="h-svh min-h-[44rem] w-full object-cover"
      />
      <div className="absolute inset-0 bg-neutral-black/45" aria-hidden="true" />

      {/* expression logo */}
      <img
        src={logo}
        alt="Expression logo"
        className="absolute left-1/2 top-1/2 w-[15rem] -translate-x-1/2 -translate-y-1/2 lg:w-[22rem]"
      />

      {/* category timeline (desktop) — jumps to the matching section on click */}
      <nav className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:right-4xl lg:block" aria-label="On this page">
        <ul className="relative flex flex-col gap-6">
          {/* dashed connector runs through the dot centres */}
          <span
            className="absolute bottom-3 left-[7px] top-3 border-l-2 border-dashed border-neutral-white/60"
            aria-hidden="true"
          />
          {tags.map((tag, i) => (
            <li key={tag.target} className="relative">
              <a
                href={`#${tag.target}`}
                onClick={(e) => jumpTo(e, tag.target)}
                className="group flex items-center gap-4"
              >
                <span className="z-10 size-4 shrink-0 rounded-full bg-neutral-white transition group-hover:scale-125" />
                <span
                  className={`text-xl text-neutral-white transition group-hover:opacity-70 ${
                    i === 0 ? 'font-bold' : ''
                  }`}
                >
                  {tag.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* city / venue / date — overlaid along the bottom of the image */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-lg font-body text-base text-neutral-white sm:text-lg lg:px-4xl">
          <span>{city}</span>
          <span className="hidden sm:inline">{venue}</span>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </section>
  )
}
