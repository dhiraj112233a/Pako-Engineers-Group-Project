import React, { useState } from 'react';
import { Menu, X, Search, Bell, MessageSquare, Home, Settings, BarChart3 } from 'lucide-react';
import '../styles/Navbar.css';
import Dropdown from './Dropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          {/* Logo Section */}
          <div className="navbar-logo">
            <div className="logo-icon">
              <span>A</span>
            </div>

            <div className="logo-text">
              <h1>Welcome to PAKO ENGINEERS</h1>
              <p>Portal · Precision Shaft Manufacturing</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="navbar-menu-desktop">

            <div
              className={`menu-item ${activeMenu === 'home' ? 'active' : ''}`}
              onClick={() => handleMenuClick('home')}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'vault' ? 'active' : ''}`}
              onClick={() => handleMenuClick('vault')}
            >
              <span>Vault</span>
            </div>

            {/* Master Dropdown */}
            <Dropdown />

            <div
              className={`menu-item ${activeMenu === 'production' ? 'active' : ''}`}
              onClick={() => handleMenuClick('production')}
            >
              <BarChart3 size={18} />
              <span>Production</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'stock' ? 'active' : ''}`}
              onClick={() => handleMenuClick('stock')}
            >
              <span>Stock</span>
            </div>

            <div
              className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => handleMenuClick('settings')}
            >
              <Settings size={18} />
              <span>Settings</span>
            </div>

          </div>

          {/* Right Icons Section */}
          <div className="navbar-icons">

            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Item Search"
              />
            </div>

            <button className="icon-btn" title="Notifications">
              <Bell size={20} />
            </button>

            <button className="icon-btn" title="Messages">
              <MessageSquare size={20} />
            </button>

            <button className="icon-btn" title="Settings">
              <Settings size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="mobile-menu-btn"
              title={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="navbar-menu-mobile">

            <div
              className="mobile-menu-item"
              onClick={() => handleMenuClick('home')}
            >
              Dashboard
            </div>

            <div
              className="mobile-menu-item"
              onClick={() => handleMenuClick('vault')}
            >
              Vault
            </div>

            <div
              className="mobile-menu-item"
              onClick={() => handleMenuClick('master')}
            >
              Master
            </div>

            <div
              className="mobile-menu-item"
              onClick={() => handleMenuClick('production')}
            >
              Production
            </div>

            <div
              className="mobile-menu-item"
              onClick={() => handleMenuClick('stock')}
            >
              Stock
            </div>

            <div
              className="mobile-menu-item"
              onClick={() => handleMenuClick('settings')}
            >
              Settings
            </div>

            <div className="mobile-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Item Search"
              />
            </div>

          </div>
        )}

      </nav>
    </>
  );
};

export default Navbar;