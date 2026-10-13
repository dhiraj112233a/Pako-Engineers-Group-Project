import React, { useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import ErpModal from '../ErpModal';
import { useStore, WO_KEY, WO_SEED, fmtDate, today, nextWoNo } from '../../store/erpstore';

// Built inside a function so "today" is read when the modal opens,
// not once when the file loads (which goes stale if the page stays open overnight).
const buildFields = () => [
  { key: 'customer', label: 'Customer', required: true, wide: true, upper: true, placeholder: 'e.g. NAMOKAR ENGINEERING' },
  { key: 'drawing', label: 'Drawing No', required: true, upper: true },
  { key: 'qty', label: 'Quantity', type: 'number', required: true, integer: true, min: 1 },
  { key: 'unit', label: 'Unit', options: ['NOS', 'KG', 'SET'], default: 'NOS' },
  { key: 'due', label: 'Due date', type: 'date', required: true, min: today() },
  { key: 'priority', label: 'Priority', options: ['Low', 'Normal', 'High'], default: 'Normal' },
];

const statusTone = { Open: '', 'In Progress': 'warn', Closed: 'good' };
const prioTone = { High: 'bad', Normal: '', Low: 'good' };

export default function WorkOrders() {
  const [rows, setRows] = useStore(WO_KEY, WO_SEED);
  const [show, setShow] = useState(false);

  const isOverdue = (r) => r.status !== 'Closed' && r.due < today();

  const save = (v) => {
    // basic checks (quantity > 0, whole number) are now done by the modal itself
    setRows((list) => [
      { id: Date.now(), woNo: nextWoNo(list), ...v, qty: Number(v.qty), done: 0, approval: '—', status: 'Open', operations: [] },
      ...list,
    ]);
    setShow(false);
  };
  const remove = (r) => window.confirm(`Delete ${r.woNo}?`) && setRows((l) => l.filter((w) => w.id !== r.id));

  const columns = [
    { key: 'woNo', label: 'WO No', render: (r) => <b>{r.woNo}</b> },
    { key: 'customer', label: 'Customer' },
    { key: 'drawing', label: 'Drawing' },
    { key: 'qty', label: 'Qty', render: (r) => `${r.qty} ${r.unit}` },
    { key: 'done', label: 'Done', render: (r) => `${r.done} / ${r.qty}` },
    {
      key: 'due', label: 'Due', render: (r) => (
        <span style={isOverdue(r) ? { color: '#b91c1c', fontWeight: 700 } : undefined}>
          {fmtDate(r.due)}{isOverdue(r) && ' ⚠'}
        </span>)
    },
    { key: 'priority', label: 'Priority', render: (r) => <span className={`erp-pill ${prioTone[r.priority] || ''}`}>{r.priority}</span> },
    { key: 'approval', label: 'Approval' },
    { key: 'status', label: 'Status', render: (r) => <span className={`erp-pill ${statusTone[r.status] || ''}`}>{r.status}</span> },
    { key: 'actions', label: '', render: (r) => <button className="erp-link-btn" style={{ color: '#b91c1c' }} onClick={() => remove(r)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Work Orders" icon="fa-file-invoice"
        subtitle="Production orders to make finished items — raised from a customer order or manually."
        action="New Work Order" onAction={() => setShow(true)}
        stats={[
          { label: 'Total', value: rows.length },
          { label: 'Open', value: rows.filter((r) => r.status === 'Open').length, tone: 'blue' },
          { label: 'In progress', value: rows.filter((r) => r.status === 'In Progress').length },
          { label: 'Overdue', value: rows.filter(isOverdue).length, tone: 'red' },
        ]}
        columns={columns} rows={rows}
        filters={[
          { key: 'status', all: 'All statuses', options: ['Open', 'In Progress', 'Closed'] },
          { key: 'priority', all: 'All priorities', options: ['High', 'Normal', 'Low'] },
        ]}
        empty="No work orders yet — click + New Work Order"
      />
      {show && <ErpModal title="New Work Order" fields={buildFields()} onSave={save} onClose={() => setShow(false)} submitLabel="Create" />}
    </>
  );
}