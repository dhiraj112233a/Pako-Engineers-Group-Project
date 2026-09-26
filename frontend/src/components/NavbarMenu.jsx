import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuDropdown from './Dropdown';
import '../styles/NavbarMenu.css';
import '../styles/MenuDropdown.css';

const NavbarMenu = ({
  activeMenu,
  setActiveMenu,
  openDropdown,
  setOpenDropdown
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'fa-th-large',
      dropdown: null
    },
    {
      label: 'Document Vault',
      icon: 'fa-vault',
      dropdown: null
    },
    {
      label: 'Master',
      icon: 'fa-database',
      dropdown: [
        { icon: 'fa-users', label: 'Customers' },
        { icon: 'fa-dolly', label: 'Vendors' },
        { icon: 'fa-cube', label: 'Items' },
        { icon: 'fa-flask', label: 'Materials' },
        { icon: 'fa-file-alt', label: 'Material Specs' },
        { icon: 'fa-layer-group', label: 'Material Groups' },
        { icon: 'fa-cog', label: 'Processes' },
        { icon: 'fa-wrench', label: 'Tools' },
        { icon: 'fa-industry', label: 'Machines' },
        { icon: 'fa-compass', label: 'Instruments' },
        { icon: 'fa-droplet', label: 'Consumables' },
        { icon: 'fa-shopping-cart', label: 'Bought-out Items' }
      ]
    },
    {
      label: 'Transactions',
      icon: 'fa-exchange-alt',
      dropdown: [
        { icon: 'fa-magnifying-glass', label: 'Customer Enquiry' },
        { icon: 'fa-file-invoice', label: 'Quotation' },
        { icon: 'fa-cart-shopping', label: 'Customer PO' },
        { icon: 'fa-file-invoice', label: 'Purchase List' },
        { icon: 'fa-truck', label: 'Vendor PO' },
        { icon: 'fa-clock', label: 'Pending List' },
        { icon: 'fa-arrow-right-arrow-left', label: 'Process PR' },
        { icon: 'fa-arrow-right-arrow-left', label: 'Process PO' },
        { icon: 'fa-truck-fast', label: 'Dispatch' }
      ]
    },
    {
      label: 'Production',
      icon: 'fa-industry',
      dropdown: [
        { icon: 'fa-file-invoice', label: 'Work Orders' },
        { icon: 'fa-tasks', label: 'Production Plan' },
        { icon: 'fa-check-circle', label: 'Production Status' }
      ]
    },
    {
      label: 'Stock',
      icon: 'fa-boxes',
      dropdown: [
        { icon: 'fa-boxes-stacked', label: 'Raw Material' },
        { icon: 'fa-boxes-packing', label: 'Finished Goods' },
        { icon: 'fa-clipboard-list', label: 'Stock Management' }
      ]
    },
    {
      label: 'Reports',
      icon: 'fa-chart-bar',
      dropdown: [
        { icon: 'fa-chart-pie', label: 'Sales Report' },
        { icon: 'fa-chart-area', label: 'GST Report' }
      ]
    },
    {
      label: 'Settings',
      icon: 'fa-cog',
      dropdown: [
        { icon: 'fa-percent', label: 'GST Settings' },
        { icon: 'fa-bullseye', label: 'Sales Targets' },
        { icon: 'fa-file-lines', label: 'Vendor T&C' },
        { icon: 'fa-screwdriver-wrench', label: 'Global Setting' },
        { icon: 'fa-users-cog', label: 'User Management' }
      ]
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpenDropdown]);

  // Handle navbar menu click
  const handleMenuClick = (label) => {
    setActiveMenu(label);

    const item = menuItems.find((menu) => menu.label === label);

    if (item?.dropdown) {
      // Open / close dropdown
      setOpenDropdown(
        openDropdown === label ? null : label
      );
    } else {
      // Close any open dropdown
      setOpenDropdown(null);

      // Dashboard navigation
      if (label === 'Dashboard') {
        navigate('/');
      }
    }
  };

  return (
    <div className="navbar-menu" ref={dropdownRef}>
      <div className="menu-items">

        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item-wrapper"
          >

            <button
              className={`
                menu-item
                ${activeMenu === item.label ? 'active' : ''}
                ${item.dropdown ? 'has-dropdown' : ''}
              `}
              onClick={() => handleMenuClick(item.label)}
            >

              <i className={`fas ${item.icon}`}></i>

              <span className="menu-label">
                {item.label}
              </span>

              {item.dropdown && (
                <i
                  className={`
                    fas
                    fa-chevron-down
                    chevron
                    ${openDropdown === item.label ? 'open' : ''}
                  `}
                ></i>
              )}

            </button>

            {item.dropdown &&
              openDropdown === item.label && (
                <MenuDropdown
                  items={item.dropdown}
                />
              )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default NavbarMenu;