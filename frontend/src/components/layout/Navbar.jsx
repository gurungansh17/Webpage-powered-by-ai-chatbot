import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import './Navbar.css'

const links = [
  { to: '/',             label: 'Home' },
  { to: '/solutions',    label: 'Solutions' },
  { to: '/case-studies', label: 'Past Work' },
  { to: '/articles',     label: 'Articles' },
  { to: '/events',       label: 'Events' },
  { to: '/gallery',      label: 'Gallery' },
  { to: '/feedback',     label: 'Feedback' },
  { to: '/contact',      label: 'Contact' },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <Zap size={20} />
          AI-Solutions
        </Link>

        <ul className={`navbar__links${open ? ' navbar__links--open' : ''}`}>
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className="navbar__burger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  )
}
