import { ArrowUpRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div>
          <Link className="footer-brand" to="/">TECHFEST<span>’26</span></Link>
          <p>Three days. One campus. Infinite possibilities.</p>
        </div>
        <div className="footer-links">
          <Link to="/events">Explore events <ArrowUpRight size={14} /></Link>
          <Link to="/register">Get your pass <ArrowUpRight size={14} /></Link>
          <Link to="/contact">Contact the team <ArrowUpRight size={14} /></Link>
        </div>
        <div className="social-links" aria-label="Social media">
          <a href="https://instagram.com" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="https://youtube.com" aria-label="YouTube"><Youtube size={18} /></a>
          <a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin size={18} /></a>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 TechFest. All rights reserved.</span>
        <span>Built for the curious minds.</span>
      </div>
    </footer>
  );
}
