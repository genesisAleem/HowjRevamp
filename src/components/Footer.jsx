import { Link } from 'react-router-dom'
import site from '../content/site.json'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-neutral-black/10 bg-neutral-black text-neutral-white">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-lg">{site.brand?.name ?? 'HOWJ'}</p>
            <p className="text-neutral-white/70">{site.footer?.email}</p>
          </div>
          <nav className="flex gap-4">
            {site.nav?.map((item) => (
              <Link key={item.path} to={item.path} className="text-neutral-white/70 hover:text-neutral-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-xs text-neutral-white/50">
          © {year} {site.brand?.name ?? 'HOWJ'}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
