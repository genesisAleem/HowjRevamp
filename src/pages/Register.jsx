import Reveal from '../components/Reveal.jsx'
import RegisterForm from '../components/RegisterForm.jsx'

export default function Register() {
  return (
    <section className="mx-auto max-w-[36rem] px-6 py-20">
      <Reveal as="h1" className="font-heading text-4xl font-semibold">
        Register your interest
      </Reveal>
      <Reveal as="p" delay={80} className="mt-3 text-neutral-black/70">
        Leave your details and we'll be in touch. Placeholder copy — replace with real messaging.
      </Reveal>
      <div className="mt-10">
        <RegisterForm />
      </div>
    </section>
  )
}
