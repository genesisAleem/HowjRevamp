import Reveal from '../components/Reveal.jsx'
import site from '../content/site.json'

export default function Destinations() {
  const destinations = site.destinations ?? {}
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        {destinations.heading}
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.items?.map((item, i) => (
          <Reveal
            key={item.name}
            delay={i * 80}
            className="rounded-xl border border-neutral-black/10 bg-white p-6"
          >
            <h2 className="font-heading text-xl font-semibold">{item.name}</h2>
            <p className="mt-2 text-neutral-black/70">{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
