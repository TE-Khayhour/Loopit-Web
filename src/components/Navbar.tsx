import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setAboutDropdownOpen(false);
    setUserDropdownOpen(false);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
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

  const goAbout = () => {
    closeMenu();
    if (location.pathname === '/about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/about');
    }
  };

  const toggleUserDropdown = () => {
    if (isMobile) {
      setUserDropdownOpen(prev => !prev);
      return;
    }
  };

  const hoverHandlers = (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    isMobile
      ? {}
      : { onMouseEnter: () => setter(true), onMouseLeave: () => setter(false) };

  return (
    <nav className="navbar" ref={navRef}>
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
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        {menuOpen && isMobile && (
          <div className="navbar-overlay" onClick={closeMenu} />
        )}

        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <li className="has-dropdown" {...hoverHandlers(setDropdownOpen)}>
            <div className="nav-link-row">
              <button
                className={`nav-link-btn ${location.pathname === '/' ? 'active' : ''}`}
                onClick={goHome}
              >
                Home
              </button>
              <button
                className="nav-link-chevron"
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(prev => !prev); }}
                aria-label="Toggle Home sections"
              >
                <ChevronDown size={12} strokeWidth={2.5} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
              </button>
            </div>
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
          <li className="has-dropdown" {...hoverHandlers(setAboutDropdownOpen)}>
            <div className="nav-link-row">
              <button
                className={`nav-link-btn ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={goAbout}
              >
                About Us
              </button>
              <button
                className="nav-link-chevron"
                onClick={(e) => { e.stopPropagation(); setAboutDropdownOpen(prev => !prev); }}
                aria-label="Toggle About sections"
              >
                <ChevronDown size={12} strokeWidth={2.5} className={`dropdown-arrow ${aboutDropdownOpen ? 'open' : ''}`} />
              </button>
            </div>
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
          
          <li className="navbar-auth-item">
            <div className="navbar-actions">
              {user && (
                <NavLink to="/orders" className="navbar-order-btn" onClick={closeMenu} title="My Orders">
                  <Package size={20} />
                </NavLink>
              )}
              
              <NavLink to="/checkout" className="navbar-cart-btn" onClick={closeMenu}>
                <ShoppingCart size={20} />
                {totalItems > 0 && <span className="navbar-cart-badge">{totalItems}</span>}
              </NavLink>

              {user ? (
                <div
                  className="user-profile has-dropdown"
                  {...hoverHandlers(setUserDropdownOpen)}
                >
                  <button className="user-profile-btn" onClick={toggleUserDropdown}>
                    <User size={18} />
                    <span>{user.username}</span>
                    <ChevronDown size={12} strokeWidth={2.5} className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} />
                  </button>
                  <ul className={`dropdown ${userDropdownOpen ? 'show' : ''}`}>
                    <li>
                      <button className="dropdown-link" onClick={() => { closeMenu(); navigate('/orders'); }}>
                        <Package size={16} />
                        My Orders
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-link logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="auth-buttons">
                  <NavLink to="/login" className="login-btn" onClick={closeMenu}>Sign In</NavLink>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
