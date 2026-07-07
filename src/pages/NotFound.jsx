import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[36rem] px-6 py-32 text-center">
      <h1 className="font-heading text-4xl font-semibold">Page not found</h1>
      <Link to="/" className="mt-6 inline-block text-brand-secondary hover:underline">
        Back home
      </Link>
    </section>
  )
}
