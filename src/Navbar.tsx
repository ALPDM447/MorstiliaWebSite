import { Link } from 'react-router-dom'
import logoImg from './assets/mc-logo.png'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logoImg} alt="Morstilia Logo" className="navbar-logo" />
          Morstilia
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/engines">Engines</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
