import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Erp.css';
import '../../styles/ErpExtras.css';
import {
  useStore, INV_KEY, CUST_KEY, CPO_KEY, VPO_KEY, TARGET_KEY, SALES_TARGETS_KEY,
  today, fyOf, fyLabel, fyIndex, salesByMonth, salesByCustomer,
} from '../../store/erpstore';
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const COLORS = ['#1e3a8a', '#22d3ee', '#3b82f6', '#38bdf8', '#7c3aed', '#0d9488', '#2563eb', '#60a5fa', '#6d28d9', '#0891b2'];
const SERIES = [['Basic', '#1e3a8a'], ['GST', '#0d9488'], ['Total', '#38bdf8'], ['Target', '#94a3b8']];
const sum = (a) => a.reduce((s, x) => s + x, 0);
const money = (n) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(2)} L`);
const full = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const delta = (cur, prev) => (prev > 0 ? ((cur - prev) / prev) * 100 : null);
function Badge({ v }) {
  if (v === null) return null;
  return (
    <span className="erp-badge" style={v < 0 ? { background: '#fee2e2', color: '#b91c1c' } : undefined}>
      {v < 0 ? '↘' : '↗'} {Math.abs(v).toFixed(1)}%
    </span>
  );
}
function LineChart({ basic, gst, total, target }) {
  const W = 620, H = 230, P = 34;
  const max = Math.max(...total, ...target, 1) * 1.1;
  const x = (i) => P + (i * (W - 2 * P)) / 11;
  const y = (v) => H - P - (v / max) * (H - 2 * P);
  const pts = (a) => a.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="erp-svg"
        role="img"
        aria-label="Monthly basic sales, GST, total sales and target comparison"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={P} x2={W - P} y1={H - P - t * (H - 2 * P)} y2={H - P - t * (H - 2 * P)} stroke="#e2e8f0" />
            <text x={P - 5} y={H - P - t * (H - 2 * P) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
              {Math.round((t * max) / 1e5)}L
            </text>
          </g>
        ))}
        <polygon points={`${x(0)},${H - P} ${pts(total)} ${x(11)},${H - P}`} fill="#38bdf8" opacity="0.12" />
        <polyline points={pts(target)} fill="none" stroke="#94a3b8" strokeDasharray="4 4" />
        <polyline points={pts(basic)} fill="none" stroke="#1e3a8a" strokeWidth="2" />
        <polyline points={pts(total)} fill="none" stroke="#38bdf8" strokeWidth="2" />
        <polyline points={pts(gst)} fill="none" stroke="#0d9488" strokeWidth="2" />
        {MONTHS.map((m, i) => (
          <g key={m}>
            <text x={x(i)} y={H - 10} fontSize="9" textAnchor="middle" fill="#94a3b8">{m}</text>
            {[basic, gst, total, target].map((series, seriesIndex) => (
              <circle
                key={seriesIndex}
                cx={x(i)}
                cy={y(series[i])}
                r="3"
                fill={SERIES[seriesIndex][1]}
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
            <circle cx={x(i)} cy={y(total[i])} r="8" fill="transparent">
              <title>{`${m}: ${full(total[i])} (target ${full(target[i])})`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <div className="erp-legend">
        {SERIES.map(([n, c]) => <span key={n}><i style={{ background: c }}></i>{n}</span>)}
      </div>
    </>
  );
}
function Bars({ data }) {
  if (!data.length) return <p className="erp-empty">No sales in this period</p>;
  const max = Math.max(...data.map((d) => d[1]), 1);
  return data.map(([name, v], i) => (
    <div className="erp-bar" key={name}>
      <span title={name}>{name.length > 16 ? `${name.slice(0, 15)}…` : name}</span>
      <div className="erp-bar-track">
        <i style={{ width: `${(v / max) * 100}%`, background: COLORS[i % COLORS.length] }}></i>
      </div>
      <em>{money(v)}</em>
    </div>
  ));
}
export default function Dashboard() {
  const navigate = useNavigate();
  const [invoices] = useStore(INV_KEY, []);
  const [customers] = useStore(CUST_KEY, []);
  const [customerOrders] = useStore(CPO_KEY, []);
  const [vendorOrders] = useStore(VPO_KEY, []);
  const [monthlyTarget] = useStore(TARGET_KEY, 2500000);
  const [salesTargets] = useStore(SALES_TARGETS_KEY, []);
  const curFy = fyOf(today());
  const [fy, setFy] = useState(curFy);
  const years = [...new Set([curFy, ...invoices.map((i) => fyOf(i.date))])].sort((a, b) => b - a);
  // ---- everything below is derived from stored data ----
  const m = salesByMonth(invoices, fy);
  const prev = salesByMonth(invoices, fy - 1);
  const targetPlan = salesTargets.find((plan) => Number(plan.financialYear) === Number(fy));
  const TARGET = targetPlan
    ? Array.from({ length: 12 }, (_, index) => Number(targetPlan.months?.[index]) || 0)
    : Array(12).fill(monthlyTarget);
  const cur = fy === curFy ? fyIndex(today()) : 11;
  const yBasic = sum(m.basic), yGst = sum(m.gst), yTotal = sum(m.total);
  const yTarget = targetPlan ? Number(targetPlan.annualTarget ?? sum(TARGET)) : sum(TARGET);
  const prevTotal = sum(prev.total);
  const pct = yTarget ? (yTotal / yTarget) * 100 : 0;
  const invCount = sum(m.count);
  const billedCustomers = new Set(invoices.filter((i) => fyOf(i.date) === fy).map((i) => i.customer)).size;
  const activeCustomers = customers.filter((c) => c.status === 'Active').length;
  const purchaseOrders = customerOrders.length + vendorOrders.length;
  const kpis = [
    { label: 'Target Achievement', value: `${pct.toFixed(1)}%`, note: `Target ${money(yTarget)}`, icon: 'fa-bullseye', tone: 'blue' },
    { label: 'Sales vs Target', value: pct >= 100 ? 'Ahead' : 'Behind', note: `${money(Math.abs(yTarget - yTotal))} ${pct >= 100 ? 'above' : 'remaining'}`, icon: 'fa-chart-line', tone: 'green', to: '/reports/sales' },
    { label: 'Invoices', value: invCount, note: `This month ${m.count[cur]}`, icon: 'fa-file-invoice', tone: 'cyan', to: '/sales-invoices' },
    { label: 'Active Customers', value: activeCustomers, note: `${billedCustomers} billed this FY`, icon: 'fa-users', tone: 'blue', to: '/customer' },
    { label: 'Purchase Orders', value: purchaseOrders, note: 'Customer + vendor orders', icon: 'fa-cart-shopping', tone: 'purple', to: '/purchase-list' },
    { label: 'Prev. FY Sales', value: prevTotal ? money(prevTotal) : '—', note: `FY ${fyLabel(fy - 1)}`, icon: 'fa-cube', tone: 'slate' },
  ];
  const editTarget = () => navigate('/admin/sales-targets');
  return (
    <div className="erp-page">
      <div className="erp-head">
        <div>
          <h1>Dashboard</h1>
          <p>FY {fyLabel(fy)} overview · live business performance</p>
        </div>
        <div className="erp-head-actions dashboard-actions">
          <label className="dashboard-year-picker">
            <span>Financial year</span>
            <select aria-label="Dashboard financial year" value={fy} onChange={(e) => setFy(Number(e.target.value))}>
              {years.map((y) => <option key={y} value={y}>FY {fyLabel(y)}</option>)}
            </select>
          </label>
          <button type="button" className="erp-btn ghost" onClick={editTarget}>Manage targets</button>
          <button type="button" className="erp-btn" onClick={() => navigate('/sales-invoices')}>+ Add invoice</button>
        </div>
      </div>
      <div className="erp-grid two dashboard-sales-summary">
        <div className="erp-card dashboard-sales-card">
          <div className="dashboard-sales-heading">
            <span className="dashboard-icon blue"><i className="fas fa-chart-line" aria-hidden="true" /></span>
            <div><h2>Yearly Sales</h2><p>FY {fyLabel(fy)}</p></div>
            <Badge v={delta(yTotal, prevTotal)} />
          </div>
          <div className="erp-split">
            <div><small>Basic</small><b>{money(yBasic)}</b></div>
            <div><small>GST</small><b>{money(yGst)}</b></div>
            <div><small>Total</small><b>{money(yTotal)}</b></div>
          </div>
        </div>
        <div className="erp-card dashboard-sales-card">
          <div className="dashboard-sales-heading">
            <span className="dashboard-icon cyan"><i className="fas fa-filter" aria-hidden="true" /></span>
            <div><h2>Monthly Sales</h2><p>{MONTHS[cur]} · FY {fyLabel(fy)}</p></div>
            <Badge v={cur > 0 ? delta(m.total[cur], m.total[cur - 1]) : null} />
          </div>
          <div className="erp-split">
            <div><small>Basic</small><b>{money(m.basic[cur])}</b></div>
            <div><small>GST</small><b>{money(m.gst[cur])}</b></div>
            <div><small>Total</small><b>{money(m.total[cur])}</b></div>
          </div>
        </div>
      </div>
      <div className="erp-grid dashboard-kpis">
        {kpis.map((k) => {
          const Card = k.to ? 'button' : 'div';
          return (
            <Card
              key={k.label}
              type={k.to ? 'button' : undefined}
              className={`erp-card ${k.to ? 'link' : ''}`}
              onClick={k.to ? () => navigate(k.to) : undefined}
              aria-label={k.to ? `${k.label}: ${k.value}` : undefined}
            >
              <span className={`dashboard-icon ${k.tone}`}><i className={`fas ${k.icon}`} aria-hidden="true" /></span>
              <b>{k.value}</b><small>{k.label}</small>{k.note && <em>{k.note}</em>}
            </Card>
          );
        })}
      </div>
      <div className="erp-grid two">
        <div className="erp-card">
          <div className="dashboard-chart-heading">
            <div><h2>Monthly Sales vs Target</h2><p>FY {fyLabel(fy)} · Basic, GST &amp; total</p></div>
          </div>
          <LineChart basic={m.basic} gst={m.gst} total={m.total} target={TARGET} />
        </div>
        <div className="erp-card">
          <div className="dashboard-chart-heading">
            <div><h2>Customer-wise Sales — Monthly</h2><p>Top customers · {MONTHS[cur]} {fyLabel(fy)}</p></div>
          </div>
          <Bars data={salesByCustomer(invoices, fy, cur)} />
        </div>
      </div>
      <div className="erp-card dashboard-yearly-sales">
        <h3>Customer-wise Sales — Yearly</h3>
        <Bars data={salesByCustomer(invoices, fy)} />
      </div>
      <div className="erp-card">
        <h3>Month-wise Breakdown — FY {fyLabel(fy)}</h3>
        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Month</th><th className="num">Invoices</th><th className="num">Basic Amount</th>
                <th className="num">GST</th><th className="num">Total Sales</th><th className="num">Target</th><th className="num">Achievement</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((mo, i) => {
                const ach = TARGET[i] > 0 ? Math.round((m.total[i] / TARGET[i]) * 100) : null;
                return (
                  <tr key={mo}>
                    <td>{mo}</td><td className="num">{m.count[i]}</td><td className="num">{full(m.basic[i])}</td>
                    <td className="num">{full(m.gst[i])}</td><td className="num">{full(m.total[i])}</td><td className="num">{full(TARGET[i])}</td>
                    <td className="num">{ach === null ? '—' : <span className={`erp-pill ${ach >= 100 ? 'good' : 'warn'}`}>{ach}%</span>}</td>
                  </tr>
                );
              })}
              <tr>
                <td><b>Total</b></td><td className="num"><b>{invCount}</b></td><td className="num"><b>{full(yBasic)}</b></td>
                <td className="num"><b>{full(yGst)}</b></td><td className="num"><b>{full(yTotal)}</b></td>
                <td className="num"><b>{full(yTarget)}</b></td>
                <td className="num"><span className={`erp-pill ${pct >= 100 ? 'good' : pct >= 70 ? 'warn' : 'bad'}`}>{pct.toFixed(1)}%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="erp-foot">© 2026, Pako Engineers — All Rights Reserved · v1.0.0</p>
    </div>
  );
}