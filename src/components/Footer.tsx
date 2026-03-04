import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src="/assets/images/android-chrome-192x192.png"
            alt="Loopit logo"
            className="footer-logo-icon"
          />
          <span className="footer-logo-text">Loopit</span>
          <p className="footer-tagline">
            Make Cooking Easier,
            <br />Healthier & More Fun!
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Phnom Penh, Cambodia</p>
          <p>loopit2026@gmail.com</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/share/1HarRRapAU/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/assets/icons/facebook.png" alt="Facebook" />
            </a>
            <a href="https://www.instagram.com/loopit.kh?igsh=MTM4dXkwNGhmMXJp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/assets/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/company/loopit-food/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/assets/icons/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://t.me/loopitkh" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <img src="/assets/icons/telegram.png" alt="Telegram" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Loopit. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
