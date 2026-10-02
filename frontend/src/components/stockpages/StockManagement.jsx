import React, { useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import ErpModal from '../ErpModal';
import { useStore, MOVE_KEY, MOVE_SEED, balances, fmtDate, today, skuNo } from '../../store/erpstore';

const fields = [
  { key: 'stock', label: 'Stock', options: ['Raw Material', 'Finished Goods'], default: 'Raw Material' },
  { key: 'type', label: 'Type', options: ['Receipt', 'Issue', 'Adjust', 'Dispatch'], default: 'Receipt' },
  { key: 'reference', label: 'Reference (item / material)', required: true, wide: true },
  { key: 'qty', label: 'Qty (Adjust can be negative)', type: 'number', required: true },
  { key: 'rate', label: 'Rate (₹) — used on Receipt', type: 'number' },
  { key: 'unit', label: 'Unit', default: 'Nos.' },
  { key: 'hsn', label: 'HSN' },
  { key: 'reorder', label: 'Reorder level', type: 'number' },
  { key: 'date', label: 'Date', type: 'date', default: today() },
];

const tone = { Receipt: 'good', Issue: 'warn', Adjust: '', Dispatch: 'bad' };

export default function StockManagement() {
  const [moves, setMoves] = useStore(MOVE_KEY, MOVE_SEED);
  const [show, setShow] = useState(false);

  const save = (v) => {
    const ref = v.reference.trim().toUpperCase();
    const qty = Number(v.qty);
    if (!qty) return 'Quantity cannot be 0';
    if (v.type !== 'Adjust' && qty < 0) return 'Only Adjust can have a negative quantity';
    if (v.type === 'Dispatch' && v.stock !== 'Finished Goods') return 'Dispatch is only for Finished Goods';
    if (v.type !== 'Receipt') {
      const cur = balances(moves, v.stock).find((b) => b.reference === ref)?.onHand ?? 0;
      const after = v.type === 'Adjust' ? cur + qty : cur - qty;
      if (after < 0) return `Not enough stock — only ${cur} on hand`;
    }
    setMoves((list) => [
      ...list,
      { id: Math.max(0, ...list.map((m) => m.id)) + 1, ...v, reference: ref, qty, rate: Number(v.rate) || 0, source: 'Manual' },
    ]);
    setShow(false);
  };

  const rows = [...moves].reverse().map((m) => ({
    ...m, skuNo: skuNo(m.id), amount: m.qty * (m.rate || 0), approval: '—',
  }));

  const columns = [
    { key: 'skuNo', label: 'SKU No', render: (r) => <b>{r.skuNo}</b> },
    { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) },
    { key: 'type', label: 'Type', render: (r) => <span className={`erp-pill ${tone[r.type] || ''}`}>{r.type}</span> },
    { key: 'stock', label: 'Stock' },
    { key: 'reference', label: 'Reference' },
    { key: 'qty', label: 'Qty', num: true },
    { key: 'rate', label: 'Rate', num: true, render: (r) => `₹${(r.rate || 0).toFixed(2)}` },
    { key: 'amount', label: 'Amount', num: true, render: (r) => `₹${r.amount.toFixed(2)}` },
    { key: 'source', label: 'Source' },
    { key: 'approval', label: 'Approval' },
  ];

  return (
    <>
      <ErpTablePage
        title="Stock Management" icon="fa-clipboard-list"
        subtitle="Record stock movements (receipt / issue / adjust / dispatch). Balances update automatically with moving-average cost."
        action="New Movement" onAction={() => setShow(true)}
        stats={[
          { label: 'Movements', value: moves.length },
          { label: 'Receipts', value: moves.filter((m) => m.type === 'Receipt').length, tone: 'blue' },
          { label: 'Issues / Dispatch', value: moves.filter((m) => m.type === 'Issue' || m.type === 'Dispatch').length },
        ]}
        columns={columns} rows={rows} empty="No movements yet"
        filters={[
          { key: 'stock', all: 'All stock', options: ['Raw Material', 'Finished Goods'] },
          { key: 'type', all: 'All types', options: ['Receipt', 'Issue', 'Adjust', 'Dispatch'] },
        ]}
      />
      {show && <ErpModal title="New Stock Movement" fields={fields} onSave={save} onClose={() => setShow(false)} />}
    </>
  );
}