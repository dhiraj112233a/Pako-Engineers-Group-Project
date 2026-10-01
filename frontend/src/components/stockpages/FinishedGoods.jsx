import React from 'react';
import ErpTablePage from '../ErpTablePage';

const rows = []; // fills from production, reduces on dispatch

const columns = [
  { key: 'reference', label: 'Reference' },
  { key: 'hsn', label: 'HSN' },
  { key: 'onHand', label: 'On Hand' },
  { key: 'avgRate', label: 'Avg Rate' },
  { key: 'value', label: 'Value' },
  { key: 'reorder', label: 'Reorder' },
  { key: 'lastMovement', label: 'Last Movement' },
];

export default function FinishedGoods() {
  return (
    <ErpTablePage
      title="Finished Goods Stock" icon="fa-boxes-packing"
      subtitle="On-hand finished-item inventory, increased by production and reduced on dispatch."
      stats={[
        { label: 'SKUs in stock', value: 0 },
        { label: 'Total value', value: '₹0.00', tone: 'blue' },
        { label: 'Low stock', value: 0, tone: 'red' },
      ]}
      lowOnly columns={columns} rows={rows}
      empty="No stock records yet. Record movements in Stock Management."
    />
  );
}