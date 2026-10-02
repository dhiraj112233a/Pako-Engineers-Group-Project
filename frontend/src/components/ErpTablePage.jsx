import React, { useState } from 'react';
import '../styles/Erp.css';
import '../styles/ErpExtras.css';

const cmp = (a, b) => {
  if (a == null) return 1;
  if (b == null) return -1;
  return typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String(a).localeCompare(String(b), undefined, { numeric: true });
};

// Shared layout for Production + Stock pages: header, stat cards, filters, sortable table.
export default function ErpTablePage({
  title, icon, subtitle, action, onAction, stats = [], columns, rows,
  filters = [], lowOnly = false, empty = 'No records found',
}) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState({});
  const [low, setLow] = useState(false);
  const [sort, setSort] = useState({ key: null, dir: 1 });

  const filtered = rows.filter(
    (r) =>
      (!q || Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase())) &&
      filters.every((f) => !sel[f.key] || r[f.key] === sel[f.key]) &&
      (!low || r.onHand <= r.reorder)
  );
  const list = sort.key ? [...filtered].sort((a, b) => cmp(a[sort.key], b[sort.key]) * sort.dir) : filtered;
  const toggleSort = (k) => setSort((s) => (s.key === k ? { key: k, dir: -s.dir } : { key: k, dir: 1 }));
  const filtersOn = q || low || Object.values(sel).some(Boolean);

  return (
    <div className="erp-page">
      <div className="erp-head">
        <div>
          <h1><i className={`fas ${icon}`}></i>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action && <button className="erp-btn" onClick={onAction}>+ {action}</button>}
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
        {filtersOn && (
          <button className="erp-link-btn" onClick={() => { setQ(''); setSel({}); setLow(false); }}>Clear filters</button>
        )}
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              {columns.map((c) => {
                const can = c.label && c.sortable !== false;
                return (
                  <th key={c.key} className={`${c.num ? 'num' : ''} ${can ? 'sortable' : ''}`} onClick={can ? () => toggleSort(c.key) : undefined}>
                    {c.label}{sort.key === c.key ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td className="erp-empty" colSpan={columns.length}>{filtersOn ? 'No records match your filters' : empty}</td></tr>
            ) : (
              list.map((r, i) => (
                <tr key={r.id ?? i}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.num ? 'num' : ''}>{c.render ? c.render(r) : r[c.key] ?? '—'}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="erp-count"><span>Showing {list.length} of {rows.length}</span></div>
      <p className="erp-foot">© 2026, Pako Engineers — All Rights Reserved · v1.0.0</p>
    </div>
  );
}