import StatFigure from './StatFigure.jsx'

// A row of headline stats for the expression (miracles, charity impact, …).
export default function NumbersBand({ stats = [] }) {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-xl lg:px-4xl">
      <div className="flex flex-col gap-xl sm:flex-row sm:flex-wrap sm:items-start sm:gap-2xl">
        {stats.map((stat, i) => (
          <StatFigure key={i} value={stat.value} label={stat.label} size="xl" />
        ))}
      </div>
    </section>
  )
}
