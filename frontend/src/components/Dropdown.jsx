import React, { useState } from 'react';
import '../styles/Master.css';

const Dropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const items = [
    'Customer',
    'Items',
    'Material Specs',
    'Processes',
    'Machines',
    'Consumables',
    'Vendors',
    'Materials',
    'Material Groups',
    'Tools',
    'Instruments',
    'Bought-out-items'
  ];

  return (
    <div className="dropdown-container">

      <div
        className="master-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>Master</span>
        <span>{isDropdownOpen ? '▲' : '▼'}</span>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">

          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              className="dropdown-item"
              onClick={(e) => e.preventDefault()}
            >
              {item}
            </a>
          ))}

        </div>
      )}

    </div>
  );
};

export default Dropdown;