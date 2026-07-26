import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import site from '../content/site.json'

const base = import.meta.env.BASE_URL
const src = (p) => base + String(p).replace(/^\//, '')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// A single "way to give" — photo card with the method name. If a real handle/
// link hasn't been added to site.json yet, it degrades to "Reach out for
// details" pointing at the contact form below, rather than showing nothing.
function GiveMethodCard({ name, handle, image }) {
  return (
    <div className="relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-md">
      <img src={src(image)} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative flex flex-col gap-xs p-md text-neutral-white">
        <p className="font-condensed text-3xl font-bold uppercase leading-[1]">{name}</p>
        {handle ? (
          <p className="text-base">{handle}</p>
        ) : (
          <a href="#reach-out" className="text-sm underline decoration-1 underline-offset-2 opacity-90">
            Reach out for details
          </a>
        )}
      </div>
    </div>
  )
}

// One "way to partner" — photo card with a scripture + short body.
function PartnerCard({ name, verse, body, image }) {
  return (
    <div className="relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-md">
      <img src={src(image)} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div className="relative flex flex-col gap-xs p-md text-neutral-white">
        <p className="font-condensed text-3xl font-bold uppercase leading-[1]">{name}</p>
        <p className="text-sm italic leading-snug opacity-90">{verse}</p>
        <p className="text-sm leading-snug">{body}</p>
      </div>
    </div>
  )
}

// "Reach Out to Us" inquiry form. Not wired to a backend yet (there's no
// contact-inquiry endpoint, unlike registrations which post to the Cloudflare
// Worker) — shows a local confirmation on submit, same pattern as the footer
// newsletter form.
function ReachOutForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = {}
    if (!values.name.trim()) fieldErrors.name = 'Name is required.'
    if (!values.email.trim()) fieldErrors.email = 'Email is required.'
    else if (!EMAIL_RE.test(values.email)) fieldErrors.email = 'Enter a valid email address.'
    if (!values.message.trim()) fieldErrors.message = 'Message is required.'
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setSubmitted(true)
    setValues({ name: '', email: '', message: '' })
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-brand-primary-700/30 bg-brand-primary-50 p-lg text-brand-primary-900">
        <p className="font-heading font-semibold">Thanks — we’ve got your message.</p>
        <p className="mt-1 text-sm">We’ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-md">
      <div>
        <label htmlFor="give-name" className="mb-1 block text-sm font-medium text-neutral-black">
          Name
        </label>
        <input
          id="give-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-black/20 bg-white px-3 py-2 focus:border-brand-secondary focus:outline-none"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="give-email" className="mb-1 block text-sm font-medium text-neutral-black">
          Email
        </label>
        <input
          id="give-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-black/20 bg-white px-3 py-2 focus:border-brand-secondary focus:outline-none"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="give-message" className="mb-1 block text-sm font-medium text-neutral-black">
          Message
        </label>
        <textarea
          id="give-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-black/20 bg-white px-3 py-2 focus:border-brand-secondary focus:outline-none"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="mt-xs self-start rounded-full bg-brand-secondary px-2xl py-sm font-heading font-semibold text-neutral-black transition hover:brightness-95"
      >
        Send message
      </button>
    </form>
  )
}

export default function Give() {
  const g = site.give

  return (
    <div className="bg-surface-page">
      {/* Hero */}
      <section className="relative -mt-[60px] flex min-h-[60svh] items-end overflow-hidden sm:-mt-[64px] lg:-mt-[112px]">
        <img src={src(g.hero.image)} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/25" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[70rem] px-6 pb-2xl pt-[8rem] lg:px-4xl">
          <Reveal as="p" className="font-heading text-lg font-semibold uppercase tracking-wide text-brand-primary-400">
            {g.hero.eyebrow}
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="mt-sm max-w-[40rem] font-condensed text-6xl font-bold uppercase leading-[0.95] text-neutral-white lg:text-8xl"
          >
            {g.hero.title}
          </Reveal>
          <Reveal as="p" delay={140} className="mt-lg max-w-[38rem] text-lg leading-relaxed text-text-inverse/85">
            {g.hero.body}
          </Reveal>
        </div>
      </section>

      {/* Ways to give */}
      <section className="mx-auto max-w-[70rem] px-6 py-3xl lg:px-4xl">
        <Reveal as="h2" className="font-condensed text-5xl font-bold uppercase text-neutral-black lg:text-7xl">
          {g.waysToGive.heading}
        </Reveal>
        <Reveal as="p" delay={80} className="mt-sm max-w-[36rem] text-lg text-neutral-black/70">
          {g.waysToGive.body}
        </Reveal>
        <div className="mt-xl grid gap-lg sm:grid-cols-3">
          {g.waysToGive.methods.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <GiveMethodCard {...m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ways to partner */}
      <section className="bg-neutral-gray-100 py-3xl">
        <div className="mx-auto max-w-[70rem] px-6 lg:px-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {g.waysToPartner.eyebrow}
          </p>
          <Reveal
            as="p"
            delay={60}
            className="mt-sm max-w-[38rem] font-heading text-2xl italic leading-snug text-neutral-black"
          >
            {g.waysToPartner.verse}
          </Reveal>
          <Reveal as="p" delay={100} className="mt-sm max-w-[36rem] text-lg text-neutral-black/70">
            {g.waysToPartner.body}
          </Reveal>
          <div className="mt-xl grid gap-lg sm:grid-cols-3">
            {g.waysToPartner.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 80}>
                <PartnerCard {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reach out to us */}
      <section id="reach-out" className="mx-auto max-w-[36rem] scroll-mt-28 px-6 py-3xl lg:px-4xl">
        <Reveal as="h2" className="font-condensed text-5xl font-bold uppercase text-neutral-black">
          {g.contact.heading}
        </Reveal>
        <Reveal as="p" delay={60} className="mt-sm text-lg text-neutral-black/70">
          {g.contact.body}
        </Reveal>
        <div className="mt-lg">
          <ReachOutForm />
        </div>
      </section>
    </div>
  )
}
