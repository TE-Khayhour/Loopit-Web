import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import './Navbar.css';

const homeSections = [
  { id: 'what-is-loopit', label: 'What is LoopIt?' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'why-loopit', label: 'Why LoopIt' },
  { id: 'featured-meals', label: 'Featured Meals' },
];

const aboutSections = [
  { id: 'our-values', label: 'Our Values' },
  { id: 'our-meal-kits', label: 'Our Meal Kits' },
  { id: 'meet-our-team', label: 'Meet Our Team' },
  { id: 'partner-with-us', label: 'Partner With Us' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setAboutDropdownOpen(false);
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

  const scrollToAboutSection = (id: string) => {
    closeMenu();
    if (location.pathname === '/about') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/about');
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
            alt="LoopIt logo"
            className="navbar-logo-icon"
          />
          <span className="navbar-logo-text">LoopIt</span>
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
              <ChevronDown size={12} strokeWidth={2.5} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
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
          <li
            className="has-dropdown"
            onMouseEnter={() => setAboutDropdownOpen(true)}
            onMouseLeave={() => setAboutDropdownOpen(false)}
          >
            <button
              className={`nav-link-btn ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => { closeMenu(); navigate('/about'); if (location.pathname === '/about') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              About Us
              <ChevronDown size={12} strokeWidth={2.5} className={`dropdown-arrow ${aboutDropdownOpen ? 'open' : ''}`} />
            </button>
            <ul className={`dropdown ${aboutDropdownOpen ? 'show' : ''}`}>
              {aboutSections.map((s) => (
                <li key={s.id}>
                  <button className="dropdown-link" onClick={() => scrollToAboutSection(s.id)}>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
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
