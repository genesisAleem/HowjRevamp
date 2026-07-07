import { NavLink } from 'react-router-dom'
import site from '../content/site.json'
import planeIcon from '../assets/brand/plane.svg'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-black/10 bg-neutral-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-heading text-xl font-semibold">
          <img src={planeIcon} alt="" className="h-6 w-6" aria-hidden="true" />
          {site.brand?.name ?? 'HOWJ'}
        </NavLink>

        <ul className="hidden gap-6 text-sm font-medium md:flex">
          {site.nav?.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'text-brand-secondary' : 'text-neutral-black/80 hover:text-brand-secondary'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink
          to="/register"
          className="rounded-full bg-brand-secondary px-4 py-2 text-sm font-semibold text-neutral-white transition hover:bg-neutral-black"
        >
          Register
        </NavLink>
      </nav>
    </header>
  )
}
