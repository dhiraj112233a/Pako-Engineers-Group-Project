import React, { useState, useEffect, useRef } from 'react';
import '../styles/ErpExtras.css';

// Generic form modal.
// field options:
//   key, label, type, options, suggest, required, default, wide, placeholder
//   min, max        -> number / date limits
//   integer         -> number must be a whole number
//   upper           -> auto convert typed text to UPPERCASE
//   pattern, patternMsg -> regex check for text
//   showIf(vals)    -> show the field only when this returns true
// onSave(values) may return a string to show as an error; anything else = success.
export default function ErpModal({ title, fields, onSave, onClose, submitLabel = 'Save' }) {
  const [vals, setVals] = useState(() => Object.fromEntries(fields.map((f) => [f.key, f.default ?? ''])));
  const [errs, setErrs] = useState({});
  const [formErr, setFormErr] = useState('');
  const firstRef = useRef(null);

  // focus first input once, when the modal opens
  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  // close on Escape
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const visible = fields.filter((f) => !f.showIf || f.showIf(vals));

  const change = (f, raw) => {
    const v = f.upper ? raw.toUpperCase() : raw;
    setVals((s) => ({ ...s, [f.key]: v }));
    setErrs((s) => ({ ...s, [f.key]: '' }));
    setFormErr('');
  };

  // returns an error message for one field, or '' if it is fine
  const check = (f) => {
    const v = String(vals[f.key] ?? '').trim();
    if (f.required && v === '') return `${f.label} is required`;
    if (v === '') return '';

    if (f.type === 'number') {
      const n = Number(v);
      if (Number.isNaN(n)) return 'Enter a valid number';
      if (f.integer && !Number.isInteger(n)) return 'Must be a whole number';
      if (f.min !== undefined && n < f.min) return `Must be at least ${f.min}`;
      if (f.max !== undefined && n > f.max) return `Must be at most ${f.max}`;
    }

    if (f.type === 'date' && f.min && v < f.min) {
      const [y, m, d] = f.min.split('-');
      return `Date must be on or after ${d}/${m}/${y}`;
    }

    if (f.pattern && !f.pattern.test(v)) return f.patternMsg || 'Invalid format';
    return '';
  };

  const submit = (e) => {
    e.preventDefault();

    const found = {};
    visible.forEach((f) => {
      const msg = check(f);
      if (msg) found[f.key] = msg;
    });
    setErrs(found);
    if (Object.keys(found).length) return;

    // send only visible fields, with text trimmed
    const clean = {};
    visible.forEach((f) => {
      clean[f.key] = typeof vals[f.key] === 'string' ? vals[f.key].trim() : vals[f.key];
    });

    const res = onSave(clean);
    if (typeof res === 'string') setFormErr(res);
  };

  return (
    <div className="erp-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="erp-modal" onSubmit={submit} noValidate>
        <div className="erp-modal-head">
          <h3>{title}</h3>
          <button type="button" className="erp-x" onClick={onClose}>×</button>
        </div>

        <div className="erp-form-grid">
          {visible.map((f, i) => (
            <label key={f.key} className={f.wide ? 'wide' : ''}>
              <span>{f.label}{f.required && ' *'}</span>

              {f.options ? (
                <select
                  ref={i === 0 ? firstRef : undefined}
                  value={vals[f.key]}
                  onChange={(e) => change(f, e.target.value)}
                >
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <>
                  <input
                    ref={i === 0 ? firstRef : undefined}
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={vals[f.key]}
                    min={f.min}
                    max={f.max}
                    step={f.type === 'number' ? (f.integer ? 1 : 'any') : undefined}
                    list={f.suggest ? `dl-${f.key}` : undefined}
                    className={errs[f.key] ? 'has-err' : ''}
                    onChange={(e) => change(f, e.target.value)}
                  />
                  {f.suggest && (
                    <datalist id={`dl-${f.key}`}>
                      {f.suggest.map((s) => <option key={s} value={s} />)}
                    </datalist>
                  )}
                </>
              )}

              {errs[f.key] && <small className="erp-field-err">{errs[f.key]}</small>}
            </label>
          ))}
        </div>

        {formErr && <p className="erp-err">{formErr}</p>}

        <div className="erp-modal-foot">
          <button type="button" className="erp-btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="erp-btn">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}