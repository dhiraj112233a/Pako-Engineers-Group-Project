import React from 'react';
import '../../styles/Erp.css';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const RESULTS = [18, 22, 19, 25, 21, 27, 24, 26, 24, 16, 0, 0];
const BASIC = [18.5, 22.4, 19.8, 25.7, 21.5, 26.9, 24.2, 26.6, 22.4, 27.4, 0, 0].map((x) => x * 1e5);
const GST = BASIC.map((b) => b * 0.18);
const TOTAL = BASIC.map((b, i) => b + GST[i]);
const TARGET = MONTHS.map(() => 25e5);
const sum = (a) => a.reduce((s, x) => s + x, 0);

const CUSTOMERS = [
  ['Kirloskar Brothers Ltd', 62], ['Shakti Pumps', 55], ['CRI Pumps', 44], ['KSB Limited', 38], ['Grundfos India', 30],
  ['Texmo Industries', 26], ['Lubi Pumps', 21], ['Crompton Greaves', 17], ['Falcon Pumps', 12], ['Oswal Pumps', 9],
];
const COLORS = ['#1e3a8a', '#22d3ee', '#3b82f6', '#38bdf8', '#7c3aed', '#0d9488', '#2563eb', '#60a5fa', '#6d28d9', '#0891b2'];

const money = (n) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(2)} L`);
const full = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function LineChart() {
  const W = 620, H = 230, P = 30;
  const max = Math.max(...TOTAL) * 1.1;
  const x = (i) => P + (i * (W - 2 * P)) / 11;
  const y = (v) => H - P - (v / max) * (H - 2 * P);
  const pts = (a) => a.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="erp-svg">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={P} x2={W - P} y1={H - P - t * (H - 2 * P)} y2={H - P - t * (H - 2 * P)} stroke="#e2e8f0" />
      ))}
      <polygon points={`${x(0)},${H - P} ${pts(TOTAL)} ${x(11)},${H - P}`} fill="#38bdf8" opacity="0.12" />
      <polyline points={pts(TARGET)} fill="none" stroke="#94a3b8" strokeDasharray="4 4" />
      <polyline points={pts(BASIC)} fill="none" stroke="#1e3a8a" strokeWidth="2" />
      <polyline points={pts(TOTAL)} fill="none" stroke="#38bdf8" strokeWidth="2" />
      <polyline points={pts(GST)} fill="none" stroke="#0d9488" strokeWidth="2" />
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 10} fontSize="9" textAnchor="middle" fill="#94a3b8">{m}</text>
      ))}
    </svg>
  );
}

function Bars({ data, scale }) {
  const max = Math.max(...data.map((d) => d[1]));
  return data.map(([name, v], i) => (
    <div className="erp-bar" key={name}>
      <span>{name}</span>
      <i style={{ width: `${(v / max) * 70}%`, background: COLORS[i] }} title={`₹${(v * scale).toFixed(1)} L`}></i>
    </div>
  ));
}

export default function Dashboard() {
  const yBasic = sum(BASIC), yGst = sum(GST), yTotal = sum(TOTAL), yTarget = sum(TARGET);
  const cur = 9; // Jan
  const kpis = [
    { label: 'Target Achievement', value: `${((yTotal / yTarget) * 100).toFixed(1)}%`, note: `Target: ${money(yTarget)}` },
    { label: 'Daily Pace', value: 'Ahead', note: '+₹29.18 L' },
    { label: 'Invoices (FY)', value: sum(RESULTS) + 5, note: 'This month: 26' },
    { label: 'Active Customers', value: 38 },
    { label: 'Total POs', value: 312, note: 'Pending: 27' },
    { label: 'Prev. FY Sales', value: '₹2.48 Cr' },
  ];

  return (
    <div className="erp-page">
      <div className="erp-head">
        <div><h1>Dashboard</h1><p>FY 2025-26 Overview · demo data</p></div>
      </div>

      <div className="erp-grid two">
        <div className="erp-card">
          <h3>Yearly Sales <span className="erp-badge">↗ 11.8% YoY</span></h3>
          <div className="erp-split">
            <div><small>Basic</small><b>{money(yBasic)}</b></div>
            <div><small>GST</small><b>{money(yGst)}</b></div>
            <div><small>Total</small><b>{money(yTotal)}</b></div>
          </div>
        </div>
        <div className="erp-card">
          <h3>Monthly Sales <span className="erp-badge">↗ 115.5%</span></h3>
          <div className="erp-split">
            <div><small>Basic</small><b>{money(BASIC[cur])}</b></div>
            <div><small>GST</small><b>{money(GST[cur])}</b></div>
            <div><small>Total</small><b>{money(TOTAL[cur])}</b></div>
          </div>
        </div>
      </div>

      <div className="erp-grid">
        {kpis.map((k) => (
          <div className="erp-card" key={k.label}>
            <b>{k.value}</b><small>{k.label}</small>{k.note && <em>{k.note}</em>}
          </div>
        ))}
      </div>

      <div className="erp-grid two">
        <div className="erp-card"><h3>Monthly Sales vs Target</h3><LineChart /></div>
        <div className="erp-card"><h3>Customer-wise Sales — Monthly</h3><Bars data={CUSTOMERS} scale={0.13} /></div>
      </div>

      <div className="erp-card" style={{ marginBottom: 18 }}>
        <h3>Customer-wise Sales — Yearly</h3>
        <Bars data={CUSTOMERS} scale={1} />
      </div>

      <div className="erp-card">
        <h3>Month-wise Breakdown — FY 2025-26</h3>
        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Month</th><th className="num">Results</th><th className="num">Basic Amount</th>
                <th className="num">GST</th><th className="num">Total Sales</th><th className="num">Target</th><th className="num">Achievement</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((m, i) => {
                const ach = TOTAL[i] ? Math.round((TOTAL[i] / TARGET[i]) * 100) : null;
                return (
                  <tr key={m}>
                    <td>{m}</td><td className="num">{RESULTS[i]}</td><td className="num">{full(BASIC[i])}</td>
                    <td className="num">{full(GST[i])}</td><td className="num">{full(TOTAL[i])}</td><td className="num">{full(TARGET[i])}</td>
                    <td className="num">{ach === null ? '—' : <span className={`erp-pill ${ach >= 100 ? 'good' : 'warn'}`}>{ach}%</span>}</td>
                  </tr>
                );
              })}
              <tr>
                <td><b>Total</b></td><td className="num"><b>{sum(RESULTS)}</b></td><td className="num"><b>{full(yBasic)}</b></td>
                <td className="num"><b>{full(yGst)}</b></td><td className="num"><b>{full(yTotal)}</b></td>
                <td className="num"><b>{full(yTarget)}</b></td>
                <td className="num"><span className="erp-pill bad">{((yTotal / yTarget) * 100).toFixed(1)}%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="erp-foot">© 2026, Pako Engineers — All Rights Reserved · v1.0.0</p>
    </div>
  );
}