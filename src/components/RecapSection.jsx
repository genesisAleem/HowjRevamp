import PlaneIcon from './PlaneIcon.jsx'

// Default recap content — swap via props for other trips.
const RECAP_STATS = [
  ['Attendance', '300+'],
  ['Miracles', '20+'],
  ['Souls saved', '50+'],
  ['Charity', '3000+'],
]

function RecapStat({ label, value }) {
  return (
    <div className="flex flex-col gap-1 text-text-inverse">
      <p className="font-heading text-2xl font-bold sm:text-3xl">{label}</p>
      <p className="text-lg text-text-inverse/90">{value}</p>
    </div>
  )
}

// Trip recap: full-bleed photo whose TOP gradient starts solid black (blending
// down from StatsSection) and eases open. Meta row up top, massive title, and a
// 2x2 stats grid split by a white plane divider at the bottom.
export default function RecapSection({
  date = 'March 26 2026',
  place = 'kerala',
  title = 'India & Bangladesh Recap',
  image = `${import.meta.env.BASE_URL}gallery/India-charity-01.jpg`,
  stats = RECAP_STATS,
}) {
  return (
    <section className="relative flex min-h-screen overflow-hidden">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      {/* Top gradient: solid black at the top edge (continues the blend from the
          section above) fading into a darkened photo. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black/80"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-2xl lg:py-3xl">
        {/* meta row */}
        <div className="flex items-center justify-between text-base text-text-inverse sm:text-lg">
          <span>{date}</span>
          <span>{place}</span>
        </div>

        {/* title */}
        <h2 className="mt-xl max-w-[20rem] font-heading text-6xl font-bold leading-[1.05] text-text-inverse sm:max-w-[28rem] sm:text-7xl lg:mt-2xl lg:max-w-[34rem] lg:text-8xl">
          {title}
        </h2>

        {/* bottom stats grid, split by the plane divider */}
        <div className="mt-auto pt-2xl">
          <div className="grid grid-cols-2 gap-lg">
            <RecapStat label={stats[0][0]} value={stats[0][1]} />
            <RecapStat label={stats[1][0]} value={stats[1][1]} />
          </div>

          <div className="my-lg flex items-center" aria-hidden="true">
            <span className="h-px flex-1 bg-text-inverse" />
            <PlaneIcon className="mx-4 w-10 shrink-0 text-text-inverse" />
            <span className="h-px flex-1 bg-text-inverse" />
          </div>

          <div className="grid grid-cols-2 gap-lg">
            <RecapStat label={stats[2][0]} value={stats[2][1]} />
            <RecapStat label={stats[3][0]} value={stats[3][1]} />
          </div>
        </div>
      </div>
    </section>
  )
}
