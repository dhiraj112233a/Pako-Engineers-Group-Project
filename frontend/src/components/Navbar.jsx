import React, { useState } from 'react';
import NavbarMenu from './NavbarMenu';
import "../styles/navbar.css";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: 'fa-th-large' },
    { label: 'Document Vault', icon: 'fa-vault' },
    { label: 'Master', icon: 'fa-database' },
    { label: 'Transactions', icon: 'fa-exchange-alt' },
    { label: 'Production', icon: 'fa-industry' },
    { label: 'Stock', icon: 'fa-boxes' },
    { label: 'Reports', icon: 'fa-chart-bar' },
    { label: 'Settings', icon: 'fa-cog' }
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-wrapper">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">
            <i className="fas fa-cog"></i>
          </div>
          <div className="logo-text">
            <h1>Welcome to PAKO ENGINEERS</h1>
            <p>Admin Portal· Precision Shaft Manufacturing</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <button className="nav-icon-btn" title="Search">
            <i className="fas fa-search"></i>
            <span className="btn-label">Search</span>
          </button>
          <button className="nav-icon-btn" title="Tasks">
            <i className="fas fa-tasks"></i>
            <span className="btn-label">Tasks</span>
          </button>
          <button className="nav-icon-btn" title="Notifications">
            <i className="fas fa-bell"></i>
          </button>
          <button className="nav-icon-btn" title="Messages">
            <i className="fas fa-envelope"></i>
          </button>
          <button className="nav-icon-btn" title="User">
            <i className="fas fa-user-circle"></i>
          </button>
          <button 
            className="hamburger-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Desktop Menu Bar */}
      <NavbarMenu
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              className={`mobile-menu-item ${activeMenu === item.label ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(item.label);
                setOpenDropdown(null);
                setMobileMenuOpen(false);
              }}
            >
              <i className={`fas ${item.icon}`}></i>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
