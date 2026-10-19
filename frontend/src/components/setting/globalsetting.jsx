import React, { useState } from 'react';
import {
  GLOBAL_SETTINGS_DEFAULT,
  GLOBAL_SETTINGS_KEY,
  useStore,
} from '../../store/erpstore';
import '../../styles/globalsetting.css';

const NUMBERING_DOCUMENTS = [
  ['invoice', 'Invoice Numbering', 'Invoice Prefix'],
  ['vendorPo', 'Vendor PO Numbering', 'VPO Prefix'],
  ['enquiry', 'Customer Enquiry Numbering', 'Enquiry Prefix'],
  ['quotation', 'Quotation Numbering', 'Quotation Prefix'],
  ['orderAcceptance', 'Order Acceptance (OA) Numbering', 'OA Prefix'],
];

const COMPANY_FIELDS = [
  ['name', 'Company Name', 'PAKO ENGINEERS', true],
  ['address', 'Address', 'Street, City, State, Pincode', true],
  ['gstin', 'GSTIN', '27XXXXX...', false],
  ['pan', 'PAN', 'AAAAA0000A', false],
  ['phone', 'Phone', '+91 ...', false],
  ['email', 'Email', 'info@pako...', false],
  ['website', 'Website', 'www.pako...', false],
  ['bankName', 'Bank Name & Branch', 'Bank name and branch', true],
  ['accountHolder', 'A/C Holder Name', 'M/S PAKO ENGINEERS', true],
  ['accountNumber', 'Account No.', '0000000000', false],
  ['ifsc', 'IFSC Code', 'XXXXXXXXXXX', false],
];

const serialLabel = (prefix, value) => `${prefix}${String(value || 0).padStart(4, '0')}`;

export default function GlobalSettings() {
  const [settings, setSettings] = useStore(GLOBAL_SETTINGS_KEY, GLOBAL_SETTINGS_DEFAULT);
  const [numbering, setNumbering] = useState(settings.numbering);
  const [customerDefaults, setCustomerDefaults] = useState(settings.customerDefaults);
  const [company, setCompany] = useState(settings.company);
  const [savedSection, setSavedSection] = useState('');
  const [numberingErrors, setNumberingErrors] = useState({});

  const saveSection = (sectionKey, section, values) => {
    setSettings((current) => ({ ...current, [section]: values }));
    setSavedSection(sectionKey);
    window.setTimeout(() => setSavedSection((saved) => (saved === sectionKey ? '' : saved)), 2200);
  };

  const updateNumbering = (key, field, value) => {
    setNumbering((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }));
  };

  const updateCompany = (key, value) => {
    setCompany((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="global-settings-page">
      <header className="global-settings-header">
        <span className="global-settings-icon"><i className="fas fa-gear" /></span>
        <div>
          <h1>Global Setting</h1>
          <p>Document numbering &amp; app-wide settings</p>
        </div>
        <span className="global-settings-help" title="Settings are saved in this browser and used when new documents are created.">
          <i className="fas fa-circle-info" /> How it works
        </span>
      </header>

      <main className="global-settings-sections">
        {NUMBERING_DOCUMENTS.map(([key, title, prefixLabel]) => (
          <form
            className="global-settings-card"
            key={key}
            onSubmit={(event) => {
              event.preventDefault();
              const config = numbering[key];
              const prefix = config.prefix.trim();
              const next = Number(config.next);
              if (!prefix || !Number.isInteger(next) || next < 1) {
                setNumberingErrors((current) => ({
                  ...current,
                  [key]: 'Enter a prefix and a whole serial number of 1 or more.',
                }));
                return;
              }
              setNumberingErrors((current) => ({ ...current, [key]: '' }));
              const updated = { ...numbering, [key]: { prefix, next } };
              setNumbering(updated);
              saveSection(`numbering-${key}`, 'numbering', updated);
            }}
          >
            <div className="global-settings-card-heading">
              <h2>{title}</h2>
              <button type="submit" className="global-settings-save">
                <i className="fas fa-floppy-disk" /> {savedSection === `numbering-${key}` ? 'Saved' : 'Save'}
              </button>
            </div>
            <div className="global-settings-grid">
              <label>
                <span>{prefixLabel}</span>
                <input
                  value={numbering[key]?.prefix ?? ''}
                  onChange={(event) => {
                    updateNumbering(key, 'prefix', event.target.value);
                    setNumberingErrors((current) => ({ ...current, [key]: '' }));
                  }}
                  required
                />
              </label>
              <label>
                <span>Next Serial No.</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={numbering[key]?.next ?? ''}
                  onChange={(event) => {
                    updateNumbering(key, 'next', event.target.value);
                    setNumberingErrors((current) => ({ ...current, [key]: '' }));
                  }}
                  required
                />
              </label>
            </div>
            {numberingErrors[key] && <p className="global-settings-error">{numberingErrors[key]}</p>}
            <p className="global-settings-preview">
              Next: <b>{serialLabel(numbering[key]?.prefix, numbering[key]?.next)}</b>
            </p>
          </form>
        ))}

        <form
          className="global-settings-card"
          onSubmit={(event) => {
            event.preventDefault();
            saveSection('customerDefaults', 'customerDefaults', customerDefaults);
          }}
        >
          <div className="global-settings-card-heading">
            <h2>Customer Defaults</h2>
            <button type="submit" className="global-settings-save">
              <i className="fas fa-floppy-disk" /> {savedSection === 'customerDefaults' ? 'Saved' : 'Save'}
            </button>
          </div>
          <label className="global-settings-full-field">
            <span>Default Payment Terms</span>
            <select
              value={customerDefaults.paymentTerms}
              onChange={(event) => setCustomerDefaults({ ...customerDefaults, paymentTerms: event.target.value })}
            >
              <option value="">— Select —</option>
              {['Advance', '15 days from invoice', '30 days from invoice', '45 days from invoice', '60 days from invoice'].map((term) => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </label>
        </form>

        <form
          className="global-settings-card global-settings-company"
          onSubmit={(event) => {
            event.preventDefault();
            saveSection('company', 'company', company);
          }}
        >
          <div className="global-settings-card-heading">
            <h2>Company Details (for OA / Documents)</h2>
            <button type="submit" className="global-settings-save">
              <i className="fas fa-floppy-disk" /> {savedSection === 'company' ? 'Saved' : 'Save'}
            </button>
          </div>
          <div className="global-settings-grid">
            {COMPANY_FIELDS.map(([key, label, placeholder, fullWidth]) => (
              <label className={fullWidth ? 'global-settings-wide' : ''} key={key}>
                <span>{label}</span>
                <input
                  value={company[key] ?? ''}
                  placeholder={placeholder}
                  onChange={(event) => updateCompany(key, event.target.value)}
                />
              </label>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}