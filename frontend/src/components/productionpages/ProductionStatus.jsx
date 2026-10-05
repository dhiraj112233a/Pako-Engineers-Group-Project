import React from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, WO_KEY, WO_SEED, fmtDate, today } from '../../store/erpstore';

const tone = { Open: '', 'In Progress': 'warn', Closed: 'good' };

export default function ProductionStatus() {
  const [orders] = useStore(WO_KEY, WO_SEED);

  const rows = orders.map((r) => ({
    ...r,
    pct: r.qty ? Math.round((r.done / r.qty) * 100) : 0,
    late: r.status !== 'Closed' && r.due < today(),
  }));

  const columns = [
    { key: 'woNo', label: 'WO No', render: (r) => <b>{r.woNo}</b> },
    { key: 'customer', label: 'Customer' },
    { key: 'drawing', label: 'Drawing' },
    {
      key: 'pct', label: 'Progress', render: (r) => (
        <div className="erp-progress" title={`${r.done} / ${r.qty} ${r.unit}`}>
          <i className={r.late ? 'late' : ''} style={{ width: `${r.pct}%` }}></i>
          <span>{r.pct}%</span>
        </div>)
    },
    {
      key: 'latestOp', label: 'Latest operation', sortable: false, render: (r) => {
        const o = r.operations?.[r.operations.length - 1];
        return o ? `${o.process} @ ${o.machine}` : '—';
      }
    },
    {
      key: 'due', label: 'Due', render: (r) => (
        <span style={r.late ? { color: '#b91c1c', fontWeight: 700 } : undefined}>
          {fmtDate(r.due)}{r.late && ' ⚠'}
        </span>)
    },
    { key: 'status', label: 'Status', render: (r) => <span className={`erp-pill ${tone[r.status] || ''}`}>{r.status}</span> },
  ];

  return (
    <ErpTablePage
      title="Production Status" icon="fa-check-circle"
      subtitle="Live progress of every work order."
      stats={[
        { label: 'Work orders', value: rows.length },
        { label: 'In progress', value: rows.filter((r) => r.status === 'In Progress').length, tone: 'blue' },
        { label: 'Completed', value: rows.filter((r) => r.status === 'Closed').length },
        { label: 'Overdue', value: rows.filter((r) => r.late).length, tone: 'red' },
      ]}
      columns={columns} rows={rows}
      filters={[{ key: 'status', all: 'All statuses', options: ['Open', 'In Progress', 'Closed'] }]}
      empty="No work orders yet"
    />
  );
}