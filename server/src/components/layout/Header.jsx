import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <h1>Finviz</h1>
          </Link>
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        
        <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className={isActive('/')}>
              <Link to="/" onClick={closeMenu}>Dashboard</Link>
            </li>
            <li className={isActive('/transactions')}>
              <Link to="/transactions" onClick={closeMenu}>Transactions</Link>
            </li>
          </ul>
          
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;