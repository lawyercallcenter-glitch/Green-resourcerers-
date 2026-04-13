import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">🛰️</span>
          <span className="navbar-name">The Green Resourcerers</span>
        </Link>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/request" className={({ isActive }) => isActive ? 'active' : ''}>
            Schedule Removal
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
