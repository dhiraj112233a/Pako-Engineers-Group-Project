import React, { useState } from 'react';
import '../styles/Erp.css';

// Shared layout for Production + Stock pages: header, stat cards, filters, table.
export default function ErpTablePage({
  title, icon, subtitle, action, stats = [], columns, rows,
  filters = [], lowOnly = false, empty = 'No records found',
}) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState({});
  const [low, setLow] = useState(false);

  const list = rows.filter(
    (r) =>
      (!q || Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase())) &&
      filters.every((f) => !sel[f.key] || r[f.key] === sel[f.key]) &&
      (!low || r.onHand <= r.reorder)
  );

  return (
    <div className="erp-page">
      <div className="erp-head">
        <div>
          <h1><i className={`fas ${icon}`}></i>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action && <button className="erp-btn">+ {action}</button>}
      </div>

      {stats.length > 0 && (
        <div className="erp-grid">
          {stats.map((s) => (
            <div key={s.label} className={`erp-card ${s.tone || ''}`}>
              <small>{s.label}</small><b>{s.value}</b>
            </div>
          ))}
        </div>
      )}

      <div className="erp-tools">
        <input type="text" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        {filters.map((f) => (
          <select key={f.key} value={sel[f.key] || ''} onChange={(e) => setSel({ ...sel, [f.key]: e.target.value })}>
            <option value="">{f.all}</option>
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        {lowOnly && (
          <label><input type="checkbox" checked={low} onChange={(e) => setLow(e.target.checked)} /> Low stock only</label>
        )}
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>{columns.map((c) => <th key={c.key} className={c.num ? 'num' : ''}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td className="erp-empty" colSpan={columns.length}>{empty}</td></tr>
            ) : (
              list.map((r, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.num ? 'num' : ''}>{c.render ? c.render(r) : r[c.key] ?? '—'}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="erp-foot">© 2026, Pako Engineers — All Rights Reserved · v1.0.0</p>
    </div>
  );
}