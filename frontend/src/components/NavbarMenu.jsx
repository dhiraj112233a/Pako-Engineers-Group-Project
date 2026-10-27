import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuDropdown from './Dropdown';
import '../styles/NavbarMenu.css';
import '../styles/MenuDropdown.css';

const menuItems = [
  { label: 'Dashboard', icon: 'fa-chart-line', to: '/' },
  { label: 'Document Vault', icon: 'fa-folder-open', to: '/document-vault' },
  {
    label: 'Master',
    icon: 'fa-database',
    dropdown: [
      { icon: 'fa-users', label: 'Customers', to: '/customer' },
      { icon: 'fa-truck-field', label: 'Vendors', to: '/vendors' },
      { icon: 'fa-cube', label: 'Items', to: '/items' },
      { icon: 'fa-flask', label: 'Materials', to: '/materials' },
      { icon: 'fa-file-lines', label: 'Material Specs', to: '/material-specs' },
      { icon: 'fa-layer-group', label: 'Material Groups', to: '/material-groups' },
      { icon: 'fa-gears', label: 'Processes', to: '/processes' },
      { icon: 'fa-wrench', label: 'Tools', to: '/tools' },
      { icon: 'fa-industry', label: 'Machines', to: '/machines' },
      { icon: 'fa-compass-drafting', label: 'Instruments', to: '/instruments' },
      { icon: 'fa-droplet', label: 'Consumables', to: '/consumables' },
      { icon: 'fa-cart-shopping', label: 'Bought-out Items', to: '/bought-out-items' },
    ],
  },
  {
    label: 'Transactions',
    icon: 'fa-arrow-right-arrow-left',
    dropdown: [
      { icon: 'fa-magnifying-glass', label: 'Customer Enquiry', to: '/customer-enquiry' },
      { icon: 'fa-file-invoice', label: 'Quotation', to: '/quotation' },
      { icon: 'fa-file-signature', label: 'Customer PO', to: '/customer-po' },
      { icon: 'fa-list-check', label: 'Purchase List', to: '/purchase-list' },
      { icon: 'fa-truck', label: 'Vendor PO', to: '/vendor-po' },
      { icon: 'fa-clock', label: 'Pending List', to: '/pending-list' },
      { icon: 'fa-file-circle-plus', label: 'Process PR', to: '/process-pr' },
      { icon: 'fa-gears', label: 'Process PO', to: '/process-po' },
      { icon: 'fa-truck-fast', label: 'Dispatch', to: '/dispatch' },
      { icon: 'fa-file-invoice-dollar', label: 'Sales Invoices', to: '/sales-invoices' },
    ],
  },
  {
    label: 'Production',
    icon: 'fa-industry',
    dropdown: [
      { icon: 'fa-clipboard-list', label: 'Work Orders', to: '/work-orders' },
      { icon: 'fa-list-check', label: 'Production Plan', to: '/production-plan' },
      { icon: 'fa-circle-check', label: 'Production Status', to: '/production-status' },
    ],
  },
  {
    label: 'Stock',
    icon: 'fa-boxes-stacked',
    dropdown: [
      { icon: 'fa-boxes-stacked', label: 'Raw Material', to: '/raw-material' },
      { icon: 'fa-box', label: 'Finished Goods', to: '/finished-goods' },
      { icon: 'fa-clipboard-list', label: 'Stock Management', to: '/stock-management' },
    ],
  },
  {
    label: 'Reports',
    icon: 'fa-chart-pie',
    dropdown: [
      { icon: 'fa-chart-line', label: 'Sales Report', to: '/reports/sales' },
      { icon: 'fa-file-invoice-dollar', label: 'GST Report', to: '/reports/gst' },
    ],
  },
  {
    label: 'Settings',
    icon: 'fa-sliders',
    dropdown: [
      { icon: 'fa-percent', label: 'GST Settings', to: '/admin/gst-setting' },
      { icon: 'fa-bullseye', label: 'Sales Targets', to: '/admin/sales-targets' },
      { icon: 'fa-file-lines', label: 'Vendor T&C', to: '/admin/vendor-terms' },
      { icon: 'fa-screwdriver-wrench', label: 'Global Settings', to: '/admin/global-setting' },
      { icon: 'fa-user-gear', label: 'User Management', to: '/admin/user-management' },
    ],
  },
];

const NavbarMenu = ({ mobileMenuOpen, onNavigate }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dropdownState, setDropdownState] = useState(null);
  const openDropdown = dropdownState?.startsWith(`${pathname}|`)
    ? dropdownState.slice(pathname.length + 1)
    : null;
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownState(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setDropdownState(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (item) =>
    item.to === pathname || item.dropdown?.some((child) => child.to === pathname);

  const handleMenuClick = (item) => {
    if (item.to) {
      navigate(item.to);
      setDropdownState(null);
      onNavigate?.();
      return;
    }
    setDropdownState((open) => (
      open === `${pathname}|${item.label}` ? null : `${pathname}|${item.label}`
    ));
  };

  return (
    <div
      className={`navbar-menu ${mobileMenuOpen ? 'is-open' : ''}`}
      id="primary-navigation"
      ref={dropdownRef}
    >
      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.label} className="menu-item-wrapper">
            <button
              type="button"
              className={`
                menu-item
                ${isActive(item) ? 'active' : ''}
                ${item.dropdown ? 'has-dropdown' : ''}
              `}
              onClick={() => handleMenuClick(item)}
              aria-current={item.to === pathname ? 'page' : undefined}
              aria-haspopup={item.dropdown ? 'true' : undefined}
              aria-expanded={item.dropdown ? openDropdown === item.label : undefined}
            >
              <i className={`fas ${item.icon}`} aria-hidden="true"></i>
              <span className="menu-label">{item.label}</span>
              {item.dropdown && (
                <i
                  className={`fas fa-chevron-down chevron ${openDropdown === item.label ? 'open' : ''}`}
                  aria-hidden="true"
                />
              )}
            </button>
            {item.dropdown && openDropdown === item.label && (
              <MenuDropdown
                items={item.dropdown}
                activePath={pathname}
                onSelect={(to) => {
                  navigate(to);
                  setDropdownState(null);
                  onNavigate?.();
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default NavbarMenu;