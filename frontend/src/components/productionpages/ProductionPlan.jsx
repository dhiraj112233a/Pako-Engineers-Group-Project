import React, { useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import ErpModal from '../ErpModal';
import { useStore, WO_KEY, WO_SEED, MOVE_KEY, MOVE_SEED, today } from '../../store/erpstore';

const UNIT = { NOS: 'Nos.', KG: 'Kg', SET: 'Set' };

export default function ProductionPlan() {
  const [rows, setRows] = useStore(WO_KEY, WO_SEED);
  const [, setMoves] = useStore(MOVE_KEY, MOVE_SEED);
  const [target, setTarget] = useState(null);

  const save = (v) => {
    const done = v.done === '' ? target.done : Number(v.done);
    if (Number.isNaN(done)) return 'Enter a valid completed quantity';
    if (done < target.done) return `Completed qty cannot go below ${target.done}`;
    if (done > target.qty) return `Completed qty cannot exceed ${target.qty}`;

    // Newly completed pieces go into Finished Goods stock automatically.
    const delta = done - target.done;
    if (delta > 0) {
      setMoves((list) => [
        ...list,
        {
          id: Math.max(0, ...list.map((m) => m.id)) + 1, date: today(), type: 'Receipt',
          stock: 'Finished Goods', reference: target.drawing.trim().toUpperCase(), hsn: '',
          unit: UNIT[target.unit] || 'Nos.', qty: delta, rate: 0, reorder: '', source: target.woNo,
        },
      ]);
    }

    setRows((list) => list.map((w) => {
      if (w.id !== target.id) return w;
      const status = done >= w.qty ? 'Closed' : done > 0 ? 'In Progress' : w.status;
      return {
        ...w, done, status,
        operations: [...(w.operations || []), { process: v.process.trim(), machine: v.machine.trim() }],
      };
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
        subtitle="Plan each work order's operations (process → machine), then record actual progress. Completed qty is added to Finished Goods automatically."
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