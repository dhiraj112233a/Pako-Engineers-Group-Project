import React from 'react';
import ErpTablePage from '../ErpTablePage';

const rows = [
  { reference: 'CUTTER M20', hsn: '84879000', onHand: 6, unit: 'Nos.', avgRate: null, value: 0, reorder: 0, lastMovement: null },
];

const columns = [
  { key: 'reference', label: 'Reference', render: (r) => <b>{r.reference}</b> },
  { key: 'hsn', label: 'HSN' },
  { key: 'onHand', label: 'On Hand', render: (r) => `${r.onHand} ${r.unit}` },
  { key: 'avgRate', label: 'Avg Rate' },
  { key: 'value', label: 'Value', render: (r) => `₹${r.value.toFixed(2)}` },
  { key: 'reorder', label: 'Reorder' },
  { key: 'lastMovement', label: 'Last Movement' },
];

export default function RawMaterial() {
  const low = rows.filter((r) => r.onHand <= r.reorder).length;
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <ErpTablePage
      title="Raw Material Stock" icon="fa-boxes-stacked"
      subtitle="On-hand raw material / material-group inventory with moving-average cost."
      stats={[
        { label: 'SKUs in stock', value: rows.length },
        { label: 'Total value', value: `₹${total.toFixed(2)}`, tone: 'blue' },
        { label: 'Low stock', value: low, tone: 'red' },
      ]}
      lowOnly columns={columns} rows={rows}
    />
  );
}