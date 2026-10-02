import React from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, MOVE_KEY, MOVE_SEED, balances, stockState, fmtDate } from '../../store/erpstore';

const tone = { 'In stock': 'good', Low: 'warn', Out: 'bad' };

export default function RawMaterial() {
  const [moves] = useStore(MOVE_KEY, MOVE_SEED);
  const rows = balances(moves, 'Raw Material').map((b) => ({ ...b, id: b.reference, state: stockState(b) }));
  const low = rows.filter((r) => r.state !== 'In stock').length;
  const total = rows.reduce((s, r) => s + r.value, 0);

  const columns = [
    { key: 'reference', label: 'Reference', render: (r) => <b>{r.reference}</b> },
    { key: 'hsn', label: 'HSN' },
    { key: 'onHand', label: 'On Hand', render: (r) => `${r.onHand} ${r.unit}` },
    { key: 'avgRate', label: 'Avg Rate', render: (r) => (r.avgRate ? `₹${r.avgRate.toFixed(2)}` : '—') },
    { key: 'value', label: 'Value', render: (r) => `₹${r.value.toFixed(2)}` },
    { key: 'reorder', label: 'Reorder' },
    { key: 'state', label: 'Status', render: (r) => <span className={`erp-pill ${tone[r.state]}`}>{r.state}</span> },
    { key: 'lastMovement', label: 'Last Movement', render: (r) => fmtDate(r.lastMovement) },
  ];

  return (
    <ErpTablePage
      title="Raw Material Stock" icon="fa-boxes-stacked"
      subtitle="On-hand raw material / material-group inventory with moving-average cost."
      stats={[
        { label: 'SKUs in stock', value: rows.filter((r) => r.onHand > 0).length },
        { label: 'Total value', value: `₹${total.toFixed(2)}`, tone: 'blue' },
        { label: 'Low / out of stock', value: low, tone: 'red' },
      ]}
      lowOnly columns={columns} rows={rows}
      empty="No stock records yet. Record movements in Stock Management."
    />
  );
}