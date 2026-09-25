import React from 'react';
import "../styles/MenuDropdown.css";

const MenuDropdown = ({ items }) => {
  return (
    <div className="menu-dropdown">
      <div className="dropdown-grid">
        {items.map((item, index) => (
          <button key={index} className="dropdown-item">
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDropdown;
