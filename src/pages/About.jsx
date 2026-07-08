import Reveal from '../components/Reveal.jsx'
import site from '../content/site.json'

export default function About() {
  return (
    <section className="mx-auto max-w-[48rem] px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        {site.about?.heading}
      </Reveal>
      <Reveal as="p" delay={100} className="mt-6 text-lg text-neutral-black/70">
        {site.about?.body}
      </Reveal>
    </section>
  )
}
