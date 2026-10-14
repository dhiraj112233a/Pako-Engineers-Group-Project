import React, { useEffect, useMemo, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import {
  useStore,
  CPO_KEY,
  DISPATCH_KEY,
  MOVE_KEY,
  MOVE_SEED,
  balances,
  fmtDate,
  today,
  nextDispatchNo,
} from '../../store/erpstore';
import '../../styles/dispatch.css';

const newDraft = () => ({ customerPoId: '', date: today() });

export default function Dispatch() {
  const [customerOrders] = useStore(CPO_KEY, []);
  const [challans, setChallans] = useStore(DISPATCH_KEY, []);
  const [moves, setMoves] = useStore(MOVE_KEY, MOVE_SEED);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(newDraft);
  const [error, setError] = useState('');

  const receivedOrders = useMemo(
    () => customerOrders.filter((order) => order.status === 'Received'),
    [customerOrders],
  );
  const selectedOrder = receivedOrders.find((order) => String(order.id) === draft.customerPoId);
  const dispatchedQty = (orderId, lineId) => challans
    .filter((challan) => challan.customerPoId === orderId)
    .flatMap((challan) => challan.lines)
    .filter((line) => line.customerPoLineId === lineId)
    .reduce((sum, line) => sum + line.qty, 0);

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

  const remove = (challan) => {
    if (!window.confirm(`Delete ${challan.challanNo}? This will restore its stock quantities.`)) return;

    const removalMoves = new Set(challan.moveIds || []);
    setMoves((list) => list.filter((move) => !removalMoves.has(move.id)));
    setChallans((list) => list.filter((item) => item.id !== challan.id));
  };

  const save = (event) => {
    event.preventDefault();
    if (!selectedOrder) {
      setError('Select a received customer PO.');
      return;
    }
    if (!draft.date) {
      setError('Challan date is required.');
      return;
    }

    const remainingLines = selectedOrder.lines
      .map((line) => ({ ...line, remainingQty: Number(line.qty) - dispatchedQty(selectedOrder.id, line.id) }))
      .filter((line) => line.remainingQty > 0);
    if (!remainingLines.length) {
      setError('This customer PO has already been fully dispatched.');
      return;
    }

    const stock = balances(moves, 'Finished Goods');
    const requiredByReference = new Map();
    remainingLines.forEach((line) => {
      const reference = String(line.drawing || '').trim().toUpperCase();
      requiredByReference.set(reference, (requiredByReference.get(reference) || 0) + line.remainingQty);
    });
    const insufficient = [...requiredByReference].find(([reference, requiredQty]) => {
      const available = stock.find((balance) => balance.reference === reference)?.onHand || 0;
      return available < requiredQty;
    });
    if (insufficient) {
      const [reference, requiredQty] = insufficient;
      const available = stock.find((balance) => balance.reference === reference)?.onHand || 0;
      setError(`Not enough finished goods for ${reference}: ${available} available, ${requiredQty} required.`);
      return;
    }

    const challanId = Math.max(0, ...challans.map((challan) => Number(challan.id) || 0)) + 1;
    const lastMoveId = Math.max(0, ...moves.map((move) => Number(move.id) || 0));
    const moveIds = remainingLines.map((line, index) => lastMoveId + index + 1);
    const savedLines = remainingLines.map((line, index) => ({
      customerPoLineId: line.id,
      drawing: line.drawing,
      description: line.description || '',
      qty: line.remainingQty,
      unit: line.unit || 'NOS',
      hsn: line.hsn || '',
      moveId: moveIds[index],
    }));

    setMoves((list) => [
      ...list,
      ...savedLines.map((line, index) => ({
        id: moveIds[index],
        date: draft.date,
        type: 'Dispatch',
        stock: 'Finished Goods',
        reference: String(line.drawing).trim().toUpperCase(),
        hsn: line.hsn,
        unit: line.unit,
        qty: line.qty,
        rate: 0,
        reorder: '',
        source: `Dispatch ${nextDispatchNo(challans)}`,
      })),
    ]);
    setChallans((list) => [{
      id: challanId,
      challanNo: nextDispatchNo(challans),
      customerPoId: selectedOrder.id,
      customerPoNo: selectedOrder.poNo,
      customer: selectedOrder.customer,
      date: draft.date,
      lines: savedLines,
      moveIds,
      status: 'Dispatched',
    }, ...list]);
    setShow(false);
  };

  const columns = [
    { key: 'challanNo', label: 'Challan No.', render: (challan) => <b>{challan.challanNo}</b> },
    { key: 'date', label: 'Challan Date', render: (challan) => fmtDate(challan.date) },
    { key: 'customerPoNo', label: 'Customer PO' },
    { key: 'customer', label: 'Customer' },
    { key: 'lines', label: 'Items', render: (challan) => challan.lines.map((line) => `${line.drawing} (${line.qty} ${line.unit})`).join(', ') },
    { key: 'status', label: 'Status', render: (challan) => <span className="erp-pill good">{challan.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (challan) => <button className="erp-link-btn dispatch-delete" onClick={() => remove(challan)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Dispatch" icon="fa-truck-fast"
        subtitle="Create delivery challans against received customer orders."
        action="New Dispatch" onAction={openForm}
        stats={[
          { label: 'Dispatch Challans', value: challans.length, tone: 'blue' },
          { label: 'Items Dispatched', value: challans.reduce((sum, challan) => sum + challan.lines.length, 0) },
        ]}
        columns={columns} rows={challans}
        empty="No dispatch challans yet"
      />

      {show && (
        <div className="erp-overlay dispatch-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal dispatch-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>New Dispatch Challan</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            {!receivedOrders.length && (
              <p className="dispatch-hint">No received customer POs found. Create a Customer PO first to issue a dispatch challan.</p>
            )}

            <div className="dispatch-fields">
              <label>
                <span>Customer PO *</span>
                <select value={draft.customerPoId} onChange={(event) => { setDraft({ ...draft, customerPoId: event.target.value }); setError(''); }} disabled={!receivedOrders.length}>
                  <option value="">Select a PO...</option>
                  {receivedOrders.map((order) => {
                    const remaining = order.lines.reduce(
                      (sum, line) => sum + Math.max(0, Number(line.qty) - dispatchedQty(order.id, line.id)),
                      0,
                    );
                    return remaining > 0
                      ? <option key={order.id} value={order.id}>{order.poNo} — {order.customer}</option>
                      : null;
                  })}
                </select>
              </label>
              <label>
                <span>Challan Date *</span>
                <input type="date" value={draft.date} onChange={(event) => { setDraft({ ...draft, date: event.target.value }); setError(''); }} />
              </label>
            </div>

            {selectedOrder && (
              <div className="dispatch-order-summary">
                <strong>{selectedOrder.customer}</strong>
                <span>{selectedOrder.poNo}</span>
                {selectedOrder.lines.map((line) => {
                  const remaining = Math.max(0, Number(line.qty) - dispatchedQty(selectedOrder.id, line.id));
                  const available = balances(moves, 'Finished Goods').find(
                    (balance) => balance.reference === String(line.drawing || '').trim().toUpperCase(),
                  )?.onHand || 0;
                  return (
                    <span key={line.id}>
                      {line.drawing}: dispatch {remaining} {line.unit || 'NOS'} · {available} available
                    </span>
                  );
                })}
              </div>
            )}

            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn" disabled={!receivedOrders.length}>Create Challan</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
