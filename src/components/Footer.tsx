import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src="/assets/images/android-chrome-192x192.png"
            alt="LoopIt logo"
            className="footer-logo-icon"
          />
          <span className="footer-logo-text">LoopIt</span>
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
              <Facebook size={20} strokeWidth={1.75} />
            </a>
            <a href="https://www.instagram.com/loopit.kh?igsh=MTM4dXkwNGhmMXJp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} strokeWidth={1.75} />
            </a>
            <a href="https://www.linkedin.com/company/loopit-food/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} strokeWidth={1.75} />
            </a>
            <a href="https://t.me/loopitkh" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <Send size={20} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LoopIt. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
