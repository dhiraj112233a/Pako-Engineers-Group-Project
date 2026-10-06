import React, { useState, useEffect } from 'react';
import '../styles/ErpExtras.css';
// Generic form modal.
// fields: [{ key, label, type, options, suggest, required, default, wide, placeholder }]
// onSave(values) may return a string to show as an error; anything else = success.
export default function ErpModal({ title, fields, onSave, onClose, submitLabel = 'Save' }) {
  const [vals, setVals] = useState(() => Object.fromEntries(fields.map((f) => [f.key, f.default ?? ''])));
  const [err, setErr] = useState('');

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const miss = fields.find((f) => f.required && String(vals[f.key]).trim() === '');
    if (miss) return setErr(`${miss.label} is required`);
    const res = onSave(vals);
    if (typeof res === 'string') setErr(res);
  };

  return (
    <div className="erp-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="erp-modal" onSubmit={submit}>
        <div className="erp-modal-head">
          <h3>{title}</h3>
          <button type="button" className="erp-x" onClick={onClose}>×</button>
        </div>
        <div className="erp-form-grid">
          {fields.map((f) => (
            <label key={f.key} className={f.wide ? 'wide' : ''}>
              <span>{f.label}{f.required && ' *'}</span>
              {f.options ? (
                <select value={vals[f.key]} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <>
                  <input
                    type={f.type || 'text'} placeholder={f.placeholder} value={vals[f.key]}
                    list={f.suggest ? `dl-${f.key}` : undefined}
                    step={f.type === 'number' ? 'any' : undefined}
                    onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}
                  />
                  {f.suggest && (
                    <datalist id={`dl-${f.key}`}>
                      {f.suggest.map((s) => <option key={s} value={s} />)}
                    </datalist>
                  )}
                </>
              )}
            </label>
          ))}
        </div>
        {err && <p className="erp-err">{err}</p>}
        <div className="erp-modal-foot">
          <button type="button" className="erp-btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="erp-btn">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}