import React from 'react';
import ErpTablePage from '../ErpTablePage';

const rows = [
  { woNo: 'WO-0002', customer: 'NAMOKAR ENGINEERING', drawing: '26342 M3001/DLZ001', qty: '48 NOS', done: 0, due: '31/7/2026', priority: 'Normal', approval: '—', status: 'Open' },
];

const columns = [
  { key: 'woNo', label: 'WO No', render: (r) => <b>{r.woNo}</b> },
  { key: 'customer', label: 'Customer' },
  { key: 'drawing', label: 'Drawing' },
  { key: 'qty', label: 'Qty' },
  { key: 'done', label: 'Done' },
  { key: 'due', label: 'Due' },
  { key: 'priority', label: 'Priority' },
  { key: 'approval', label: 'Approval' },
  { key: 'status', label: 'Status', render: (r) => <span className="erp-pill">{r.status}</span> },
];

export default function WorkOrders() {
  return (
    <ErpTablePage
      title="Work Orders" icon="fa-file-invoice"
      subtitle="Production orders to make finished items — raised from a customer order or manually."
      action="New Work Order" columns={columns} rows={rows}
      filters={[{ key: 'status', all: 'All statuses', options: ['Open', 'In Progress', 'Closed'] }]}
    />
  );
}