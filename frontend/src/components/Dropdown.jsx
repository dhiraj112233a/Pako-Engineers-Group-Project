import React from 'react';
import "../styles/MenuDropdown.css";

const MenuDropdown = ({ items, activePath, onSelect }) => {
  return (
    <div className="menu-dropdown">
      <div className="dropdown-grid">
        {items.map((item) => (
          <button
            key={item.to}
            type="button"
            className={`dropdown-item ${activePath === item.to ? 'active' : ''}`}
            onClick={() => onSelect(item.to)}
            aria-current={activePath === item.to ? 'page' : undefined}
          >
            <i className={`fas ${item.icon}`} aria-hidden="true"></i>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDropdown;