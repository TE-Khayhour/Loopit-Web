import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const homeSections = [
  { id: 'what-is-loopit', label: 'What is Loopit?' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'why-loopit', label: 'Why Loopit' },
  { id: 'featured-meals', label: 'Featured Meals' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMenu();
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const goHome = () => {
    closeMenu();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <img
            src="/assets/images/android-chrome-192x192.png"
            alt="Loopit logo"
            className="navbar-logo-icon"
          />
          <span className="navbar-logo-text">Loopit</span>
        </NavLink>

        <button
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {/* Home with dropdown */}
          <li
            className="has-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`nav-link-btn ${location.pathname === '/' ? 'active' : ''}`}
              onClick={goHome}
            >
              Home
              <svg
                className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <ul className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
              {homeSections.map((s) => (
                <li key={s.id}>
                  <button className="dropdown-link" onClick={() => scrollToSection(s.id)}>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMenu}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu" onClick={closeMenu}>
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
