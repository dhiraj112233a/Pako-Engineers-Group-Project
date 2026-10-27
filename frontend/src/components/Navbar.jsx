import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarMenu from './NavbarMenu';
import "../styles/Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar-container">
      <div className="navbar-wrapper">
        <Link className="logo-section" to="/" aria-label="Pako Engineers dashboard">
          <div className="logo-icon">
            <i className="fas fa-gear" aria-hidden="true"></i>
          </div>
          <div className="logo-text">
            <span className="logo-title">PAKO ENGINEERS</span>
            <span className="logo-subtitle">Precision Manufacturing ERP</span>
          </div>
        </Link>

        <div className="navbar-right">
          <button
            className="hamburger-menu"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <NavbarMenu
        mobileMenuOpen={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
};
export default Navbar;