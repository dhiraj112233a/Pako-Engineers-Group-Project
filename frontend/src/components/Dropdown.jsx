import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/MenuDropdown.css";

const MenuDropdown = ({ items }) => {
  const navigate = useNavigate();

  const handleItemClick = (label) => {
    const routes = {
      "Customers": "/customer",
      "Vendors": "/vendors",
      "Items": "/items",
      "Materials": "/materials",
      "Material Specs": "/material-specs",
      "Material Groups": "/material-groups",
      "Processes": "/processes",
      "Tools": "/tools",
      "Machines": "/machines",
      "Instruments": "/instruments",
      "Consumables": "/consumables",
      "Bought-out Items": "/bought-out-items",
      "Customer Enquiry": "/customer-enquiry"
    };

    if (routes[label]) {
      navigate(routes[label]);
    }
  };

  return (
    <div className="menu-dropdown">
      <div className="dropdown-grid">
        {items.map((item, index) => (
          <button
            key={index}
            className="dropdown-item"
            onClick={() => handleItemClick(item.label)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDropdown;