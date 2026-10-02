import React, { useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import ErpModal from '../ErpModal';
import { useStore, WO_KEY, WO_SEED } from '../../store/erpstore';

export default function ProductionPlan() {
  const [rows, setRows] = useStore(WO_KEY, WO_SEED);
  const [target, setTarget] = useState(null);

  const save = (v) => {
    const done = v.done === '' ? target.done : Number(v.done);
    if (done < 0 || done > target.qty) return `Completed qty must be between 0 and ${target.qty}`;
    setRows((list) => list.map((w) => {
      if (w.id !== target.id) return w;
      const status = done >= w.qty ? 'Closed' : done > 0 ? 'In Progress' : w.status;
      return { ...w, done, status, operations: [...(w.operations || []), { process: v.process.trim(), machine: v.machine.trim() }] };
    }));
    setTarget(null);
  };

  const columns = [
    {
      key: 'plan', label: '', render: (r) => (
        <button className="erp-btn sm" disabled={r.status === 'Closed'} onClick={() => setTarget(r)}>
          {r.operations?.length ? 'Add op' : 'Plan'}
        </button>)
    },
    { key: 'woNo', label: 'WO No', render: (r) => <b>{r.woNo}</b> },
    { key: 'drawing', label: 'Drawing' },
    { key: 'qty', label: 'Qty', render: (r) => `${r.done} / ${r.qty} ${r.unit}` },
    {
      key: 'operations', label: 'Operations', sortable: false, render: (r) =>
        r.operations?.length
          ? <span className="erp-pill good" title={r.operations.map((o) => `${o.process} @ ${o.machine}`).join('\n')}>
            {r.operations.map((o) => o.process).join(' → ')}
          </span>
          : <span className="erp-pill warn">not planned</span>
    },
    { key: 'status', label: 'Status' },
  ];

  const fields = target && [
    { key: 'process', label: 'Process', required: true, placeholder: 'e.g. Turning' },
    { key: 'machine', label: 'Machine', required: true, placeholder: 'e.g. CNC-01' },
    { key: 'done', label: `Qty completed so far (of ${target.qty})`, type: 'number', default: target.done, wide: true },
  ];

  return (
    <>
      <ErpTablePage
        title="Production Plan" icon="fa-tasks"
        subtitle="Plan each work order's operations (process → machine), then record actual progress."
        stats={[
          { label: 'Work orders', value: rows.length },
          { label: 'Not planned', value: rows.filter((r) => !r.operations?.length && r.status !== 'Closed').length, tone: 'red' },
          { label: 'In progress', value: rows.filter((r) => r.status === 'In Progress').length, tone: 'blue' },
        ]}
        columns={columns} rows={rows}
        filters={[{ key: 'status', all: 'All statuses', options: ['Open', 'In Progress', 'Closed'] }]}
        empty="No work orders to plan — create one in Work Orders"
      />
      {target && <ErpModal key={target.id} title={`Plan ${target.woNo}`} fields={fields} onSave={save} onClose={() => setTarget(null)} />}
    </>
  );
}