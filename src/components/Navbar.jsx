import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu, X, UserRound, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import logo from '../../images/hash-logo.png';
import { logoutUser } from '../services/api.js';

const links = [
  ['Home', '/'],
  ['Events', '/events'],
  ['Register', '/signup'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact']
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('userName') || '');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setVisitorName(localStorage.getItem('userName') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    await logoutUser().catch(() => {}); // still clear local state if the server is unreachable
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setVisitorName('');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" aria-label="TechFest home">
          <img src={logo} alt="" />
          <span>TECHFEST<span className="brand-year">’26</span></span>
        </Link>
        <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(open => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.filter(([label]) => !(visitorName && label === 'Register')).map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/cart" onClick={() => setMenuOpen(false)} className={({ isActive }) => `cart-link ${isActive ? 'active' : ''}`} aria-label={`Cart, ${itemCount} items`}>
            <ShoppingBag size={18} /> Cart <span className={`cart-badge ${itemCount > 0 ? 'has-items' : 'empty'}`}>{itemCount}</span>
          </NavLink>
        </nav>
        
        {visitorName ? (
          <button className="welcome-chip has-name" type="button" onClick={handleLogout}>
            <LogOut size={15} /> Logout ({visitorName})
          </button>
        ) : (
          <button className="welcome-chip" type="button" onClick={() => { setMenuOpen(false); navigate('/login'); }}>
            <UserRound size={15} /> Login
          </button>
        )}

        <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  );
}
