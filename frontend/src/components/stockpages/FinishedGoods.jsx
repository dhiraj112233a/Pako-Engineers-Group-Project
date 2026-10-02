import React from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, MOVE_KEY, MOVE_SEED, balances, stockState, fmtDate } from '../../store/erpstore';

const tone = { 'In stock': 'good', Low: 'warn', Out: 'bad' };

export default function FinishedGoods() {
  const [moves] = useStore(MOVE_KEY, MOVE_SEED);
  const rows = balances(moves, 'Finished Goods').map((b) => ({ ...b, id: b.reference, state: stockState(b) }));
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
      title="Finished Goods Stock" icon="fa-boxes-packing"
      subtitle="On-hand finished-item inventory, increased by production and reduced on dispatch."
      stats={[
        { label: 'SKUs in stock', value: rows.filter((r) => r.onHand > 0).length },
        { label: 'Total value', value: `₹${total.toFixed(2)}`, tone: 'blue' },
        { label: 'Low / out of stock', value: rows.filter((r) => r.state !== 'In stock').length, tone: 'red' },
      ]}
      lowOnly columns={columns} rows={rows}
      empty="No stock records yet. Record movements in Stock Management."
    />
  );
}