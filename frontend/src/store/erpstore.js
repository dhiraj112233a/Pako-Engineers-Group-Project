import { useState, useEffect, useCallback } from 'react';

// ---- tiny localStorage store shared by Production, Stock and Dashboard ----
const EVT = 'erp-store';
const read = (k, init) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : init; } catch { return init; }
};

export function useStore(key, initial) {
  const [val, setVal] = useState(() => read(key, initial));
  useEffect(() => {
    const h = (e) => { if (e.detail === key) setVal(read(key, initial)); };
    window.addEventListener(EVT, h);
    return () => window.removeEventListener(EVT, h);
  }, [key]);
  const set = useCallback((next) => {
    const cur = read(key, initial);
    const v = typeof next === 'function' ? next(cur) : next;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage full/blocked */ }
    setVal(v);
    window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
  }, [key]);
  return [val, set];
}

export const WO_KEY = 'pako.workOrders';
export const MOVE_KEY = 'pako.stockMoves';

export const WO_SEED = [
  { id: 2, woNo: 'WO-0002', customer: 'NAMOKAR ENGINEERING', drawing: '26342 M3001/DLZ001', qty: 48, unit: 'NOS', done: 0, due: '2026-07-31', priority: 'Normal', approval: '—', status: 'Open', operations: [] },
];
export const MOVE_SEED = [
  { id: 1, date: '2026-07-01', type: 'Receipt', stock: 'Raw Material', reference: 'CUTTER M20', hsn: '84879000', unit: 'Nos.', qty: 6, rate: 0, reorder: 0, source: 'Opening' },
];

export const today = () => new Date().toISOString().slice(0, 10);
export const fmtDate = (d) => { if (!d) return '—'; const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };
export const nextWoNo = (list) =>
  `WO-${String(Math.max(0, ...list.map((w) => parseInt(w.woNo.slice(3), 10) || 0)) + 1).padStart(4, '0')}`;
export const skuNo = (id) => `SKU-${String(id).padStart(4, '0')}`;

// Moving-average stock balances built from the movement log.
export function balances(moves, stockType) {
  const map = {};
  [...moves].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id).forEach((m) => {
    if (m.stock !== stockType) return;
    const b = map[m.reference] || (map[m.reference] = {
      reference: m.reference, hsn: '', unit: 'Nos.', onHand: 0, avgRate: 0, value: 0, reorder: 0, lastMovement: null,
    });
    const q = Number(m.qty) || 0, r = Number(m.rate) || 0;
    if (m.hsn) b.hsn = m.hsn;
    if (m.unit) b.unit = m.unit;
    if (m.reorder !== '' && m.reorder != null) b.reorder = Number(m.reorder) || 0;
    if (m.type === 'Receipt') {
      const nv = b.value + q * r;
      b.onHand += q;
      b.avgRate = b.onHand ? nv / b.onHand : 0;
      b.value = nv;
    } else {
      b.onHand += m.type === 'Adjust' ? q : -q;   // Adjust qty is signed
      b.value = b.onHand * b.avgRate;
    }
    b.lastMovement = m.date;
  });
  return Object.values(map);
}
export const stockState = (b) => (b.onHand <= 0 ? 'Out' : b.onHand <= b.reorder ? 'Low' : 'In stock');