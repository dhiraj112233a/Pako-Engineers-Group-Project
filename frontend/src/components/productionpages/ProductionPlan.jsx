import React from 'react';
import ErpTablePage from '../ErpTablePage';

const rows = [
  { woNo: 'WO-0002', drawing: '26342 M3001/DLZ001', qty: '48 NOS', operations: 'not planned', status: 'Open' },
];

const columns = [
  { key: 'plan', label: '', render: () => <button className="erp-btn" style={{ padding: '4px 12px' }}>Plan</button> },
  { key: 'woNo', label: 'WO No', render: (r) => <b>{r.woNo}</b> },
  { key: 'drawing', label: 'Drawing' },
  { key: 'qty', label: 'Qty' },
  { key: 'operations', label: 'Operations', render: (r) => <span className="erp-pill warn">{r.operations}</span> },
  { key: 'status', label: 'Status' },
];

export default function ProductionPlan() {
  return (
    <ErpTablePage
      title="Production Plan" icon="fa-tasks"
      subtitle="Plan each work order's operations (process → machine), then record actual progress."
      columns={columns} rows={rows}
    />
  );
}