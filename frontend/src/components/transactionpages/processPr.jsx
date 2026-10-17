import React, { useEffect, useMemo, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, CPO_KEY, PROCESS_PR_KEY, fmtDate, today, nextProcessPrNo } from '../../store/erpstore';
import '../../styles/processPr.css';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const newDraft = () => ({
  customerPoId: '',
  lineId: '',
  stage: '',
  process: '',
  requiredQty: '',
  sampleRate: '',
  requiredBy: '',
});

export default function ProcessPr() {
  const [customerOrders] = useStore(CPO_KEY, []);
  const [rows, setRows] = useStore(PROCESS_PR_KEY, []);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(newDraft);
  const [error, setError] = useState('');

  const acceptedOrders = useMemo(
    () => customerOrders.filter((order) => order.status === 'Received'),
    [customerOrders],
  );
  const selectedOrder = acceptedOrders.find((order) => String(order.id) === draft.customerPoId);
  const selectedLine = selectedOrder?.lines?.find((line) => String(line.id) === draft.lineId);
  const stages = [...new Set(rows.map((row) => row.stage).filter(Boolean))].sort();

  useEffect(() => {
    if (!show) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [show]);

  const openForm = () => {
    setDraft(newDraft());
    setError('');
    setShow(true);
  };

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const selectOrder = (value) => {
    const order = acceptedOrders.find((item) => String(item.id) === value);
    const line = order?.lines?.[0];
    setDraft((current) => ({
      ...current,
      customerPoId: value,
      lineId: line ? String(line.id) : '',
      requiredQty: line ? String(line.qty) : '',
    }));
    setError('');
  };

  const selectLine = (value) => {
    const line = selectedOrder?.lines?.find((item) => String(item.id) === value);
    setDraft((current) => ({
      ...current,
      lineId: value,
      requiredQty: line ? String(line.qty) : '',
    }));
    setError('');
  };

  const save = (event) => {
    event.preventDefault();
    if (!selectedOrder || !selectedLine) {
      setError('Select an accepted customer PO and one of its line items.');
      return;
    }
    if (!draft.stage.trim() || !draft.process.trim()) {
      setError('Stage and process are required.');
      return;
    }
    if (!Number.isFinite(Number(draft.requiredQty)) || Number(draft.requiredQty) <= 0) {
      setError('Required quantity must be greater than zero.');
      return;
    }
    if (Number(draft.requiredQty) > Number(selectedLine.qty)) {
      setError(`Required quantity cannot exceed the customer order quantity of ${selectedLine.qty}.`);
      return;
    }
    if (draft.sampleRate !== '' && (!Number.isFinite(Number(draft.sampleRate)) || Number(draft.sampleRate) < 0)) {
      setError('Sample rate must be zero or more.');
      return;
    }

    setRows((list) => [{
      id: Date.now(),
      prNo: nextProcessPrNo(list),
      customer: selectedOrder.customer,
      customerPoId: selectedOrder.id,
      customerPoNo: selectedOrder.poNo,
      drawing: selectedLine.drawing,
      stage: draft.stage.trim(),
      process: draft.process.trim(),
      requiredQty: Number(draft.requiredQty),
      unit: selectedLine.unit || 'NOS',
      sampleRate: draft.sampleRate === '' ? 0 : Number(draft.sampleRate),
      requiredBy: draft.requiredBy,
      createdAt: today(),
      status: 'Open',
    }, ...list]);
    setShow(false);
  };

  const remove = (row) => {
    if (window.confirm(`Delete ${row.prNo} for ${row.process}?`)) {
      setRows((list) => list.filter((item) => item.id !== row.id));
    }
  };

  const columns = [
    { key: 'stage', label: 'Stage' },
    { key: 'process', label: 'Process' },
    { key: 'customer', label: 'Customer' },
    { key: 'customerPoNo', label: 'Order', render: (row) => <span title={row.drawing}>{row.customerPoNo} · {row.drawing}</span> },
    { key: 'requiredQty', label: 'Required Qty', num: true, render: (row) => `${row.requiredQty} ${row.unit}` },
    { key: 'sampleRate', label: 'Sample Rate', num: true, render: (row) => money(row.sampleRate) },
    { key: 'requiredBy', label: 'Required By', render: (row) => fmtDate(row.requiredBy) },
    { key: 'status', label: 'Status', render: (row) => <span className="erp-pill">{row.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (row) => <button className="erp-link-btn process-pr-delete" onClick={() => remove(row)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Process PR" icon="fa-sliders"
        subtitle="Track outsourced process requirements for accepted customer orders."
        action="Create Process PR" onAction={openForm}
        stats={[
          { label: 'Processes', value: new Set(rows.map((row) => row.process.toLowerCase())).size, tone: 'blue' },
          { label: 'Requirement Lines', value: rows.length },
        ]}
        columns={columns} rows={rows}
        filters={[
          { key: 'customer', all: 'All customers', options: [...new Set(rows.map((row) => row.customer))].sort() },
          { key: 'stage', all: 'All stages', options: stages },
        ]}
        empty="No process requirement found from accepted orders"
      />

      {show && (
        <div className="erp-overlay process-pr-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal process-pr-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>Create Process PO</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            {!acceptedOrders.length && (
              <p className="process-pr-hint">No accepted customer orders found. Create a Customer PO first; accepted orders are listed here when their status is Received.</p>
            )}

            <div className="process-pr-fields">
              <label className="process-pr-wide">
                <span>Accepted Customer Order *</span>
                <select value={draft.customerPoId} onChange={(event) => selectOrder(event.target.value)} disabled={!acceptedOrders.length}>
                  <option value="">Select accepted customer PO...</option>
                  {acceptedOrders.map((order) => (
                    <option key={order.id} value={order.id}>{order.poNo} — {order.customer}</option>
                  ))}
                </select>
              </label>
              <label className="process-pr-wide">
                <span>Order Line / Drawing *</span>
                <select value={draft.lineId} onChange={(event) => selectLine(event.target.value)} disabled={!selectedOrder}>
                  <option value="">Select order line...</option>
                  {(selectedOrder?.lines || []).map((line) => (
                    <option key={line.id} value={line.id}>{line.drawing} · {line.qty} {line.unit}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Stage *</span>
                <input value={draft.stage} onChange={(event) => updateDraft('stage', event.target.value)} placeholder="e.g. Stage 1" list="process-pr-stages" />
                <datalist id="process-pr-stages">{stages.map((stage) => <option key={stage} value={stage} />)}</datalist>
              </label>
              <label>
                <span>Process *</span>
                <input value={draft.process} onChange={(event) => updateDraft('process', event.target.value)} placeholder="e.g. Heat Treatment" />
              </label>
              <label>
                <span>Required Quantity *</span>
                <input type="number" min="0.01" step="any" max={selectedLine?.qty} value={draft.requiredQty} onChange={(event) => updateDraft('requiredQty', event.target.value)} />
                {selectedLine && <small>Customer order quantity: {selectedLine.qty} {selectedLine.unit}</small>}
              </label>
              <label>
                <span>Sample Rate (₹)</span>
                <input type="number" min="0" step="any" value={draft.sampleRate} onChange={(event) => updateDraft('sampleRate', event.target.value)} placeholder="0.00" />
              </label>
              <label>
                <span>Required By</span>
                <input type="date" value={draft.requiredBy} onChange={(event) => updateDraft('requiredBy', event.target.value)} />
              </label>
            </div>

            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn" disabled={!acceptedOrders.length}>Create Process PO</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
