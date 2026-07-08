import Reveal from '../components/Reveal.jsx'
import site from '../content/site.json'

export default function Contact() {
  return (
    <section className="mx-auto max-w-[36rem] px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        Contact
      </Reveal>
      <Reveal as="p" delay={80} className="mt-4 text-neutral-black/70">
        Placeholder contact copy. Reach us at{' '}
        <a href={`mailto:${site.footer?.email}`} className="text-brand-secondary hover:underline">
          {site.footer?.email}
        </a>
        .
      </Reveal>
    </section>
  )
}
