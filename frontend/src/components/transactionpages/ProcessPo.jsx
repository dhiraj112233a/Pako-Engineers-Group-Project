import React, { useEffect, useMemo, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import {
  useStore,
  PROCESS_PR_KEY,
  PROCESS_PO_KEY,
  VPO_KEY,
  fmtDate,
  today,
  nextProcessPoNo,
} from '../../store/erpstore';
import '../../styles/processPo.css';

const newLine = (id) => ({
  id,
  prId: '',
  process: '',
  drawing: '',
  hsn: '',
  qty: '1',
  unit: 'NOS',
  rate: '',
  discountPct: '0',
  gstPct: '18',
});

const newDraft = () => ({
  vendor: '',
  contact: '',
  poDate: today(),
  expectedReturn: '',
  status: 'Draft',
  reference: '',
  lines: [newLine(1)],
  paymentTerms: '',
  deliveryTerms: '',
  freight: '0',
  deliveryAddress: '',
  terms: '40 DAYS AFTER INVOICE DATE',
});

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const asNumber = (value) => Number(value) || 0;

function calculateLine(line) {
  const subtotal = asNumber(line.qty) * asNumber(line.rate);
  const discount = subtotal * asNumber(line.discountPct) / 100;
  const taxable = subtotal - discount;
  const gst = taxable * asNumber(line.gstPct) / 100;
  return { subtotal, discount, taxable, gst, amount: taxable + gst };
}

function calculatePo(po) {
  const lines = po.lines.map(calculateLine);
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = lines.reduce((sum, line) => sum + line.discount, 0);
  const taxable = lines.reduce((sum, line) => sum + line.taxable, 0) + asNumber(po.freight);
  const gst = lines.reduce((sum, line) => sum + line.gst, 0);
  const beforeRoundOff = taxable + gst;
  const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
  return {
    subtotal,
    discount,
    taxable,
    cgst: gst / 2,
    sgst: gst / 2,
    roundOff,
    grandTotal: beforeRoundOff + roundOff,
  };
}

export default function ProcessPo() {
  const [requirements, setRequirements] = useStore(PROCESS_PR_KEY, []);
  const [rows, setRows] = useStore(PROCESS_PO_KEY, []);
  const [vendorOrders] = useStore(VPO_KEY, []);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(newDraft);
  const [error, setError] = useState('');

  const orderedByPr = useMemo(() => {
    const totals = new Map();
    rows.filter((po) => po.status !== 'Cancelled').forEach((po) => {
      po.lines.forEach((line) => {
        if (line.prId == null) return;
        totals.set(String(line.prId), (totals.get(String(line.prId)) || 0) + Number(line.qty));
      });
    });
    return totals;
  }, [rows]);
  const vendorSuggestions = [...new Set(vendorOrders.map((po) => po.vendor).filter(Boolean))].sort();
  const availableRequirements = requirements.filter((pr) => (
    pr.status !== 'Cancelled' && Number(pr.requiredQty) - (orderedByPr.get(String(pr.id)) || 0) > 0
  ));

  useEffect(() => {
    if (!show) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [show]);

  const totals = useMemo(() => calculatePo(draft), [draft]);

  const openForm = () => {
    setDraft(newDraft());
    setError('');
    setShow(true);
  };

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const updateLine = (id, key, value) => {
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) => line.id === id ? { ...line, [key]: value } : line),
    }));
    setError('');
  };

  const addLine = () => {
    setDraft((current) => ({
      ...current,
      lines: [...current.lines, newLine(Math.max(0, ...current.lines.map((line) => line.id)) + 1)],
    }));
  };

  const removeLine = (id) => {
    setDraft((current) => ({
      ...current,
      lines: current.lines.length > 1 ? current.lines.filter((line) => line.id !== id) : current.lines,
    }));
  };

  const selectRequirement = (lineId, prId) => {
    const requirement = availableRequirements.find((pr) => String(pr.id) === prId);
    const quantityInDraft = draft.lines
      .filter((line) => line.id !== lineId && String(line.prId) === prId)
      .reduce((sum, line) => sum + asNumber(line.qty), 0);
    const remaining = requirement
      ? Number(requirement.requiredQty) - (orderedByPr.get(requirement.id) || 0) - quantityInDraft
      : 0;
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) => line.id === lineId
        ? {
          ...line,
          prId: prId || '',
          process: requirement?.process || '',
          drawing: requirement?.drawing || '',
          qty: requirement ? String(Math.max(0, remaining)) : '1',
          unit: requirement?.unit || 'NOS',
        }
        : line),
    }));
    setError('');
  };

  const save = (event) => {
    event.preventDefault();
    if (!draft.vendor.trim()) {
      setError('Vendor is required.');
      return;
    }
    if (!draft.poDate) {
      setError('PO date is required.');
      return;
    }
    const invalidLine = draft.lines.find((line) => (
      !line.prId || !line.process.trim() || !line.drawing.trim() ||
      !Number.isFinite(Number(line.qty)) || Number(line.qty) <= 0 ||
      line.rate === '' || !Number.isFinite(Number(line.rate)) || Number(line.rate) < 0 ||
      !Number.isFinite(Number(line.discountPct)) || Number(line.discountPct) < 0 || Number(line.discountPct) > 100 ||
      !Number.isFinite(Number(line.gstPct)) || Number(line.gstPct) < 0 || Number(line.gstPct) > 100
    ));
    if (invalidLine) {
      setError('Each line must use an open process requirement and have a process, drawing, quantity, rate, valid discount and GST.');
      return;
    }

    const plannedByPr = new Map();
    draft.lines.forEach((line) => plannedByPr.set(String(line.prId), (plannedByPr.get(String(line.prId)) || 0) + Number(line.qty)));
    const overAllocated = [...plannedByPr].find(([prId, qty]) => {
      const requirement = requirements.find((pr) => String(pr.id) === prId);
      return !requirement || qty > Number(requirement.requiredQty) - (orderedByPr.get(prId) || 0);
    });
    if (overAllocated) {
      setError('A process PO quantity cannot exceed its remaining process requirement.');
      return;
    }
    if (!Number.isFinite(Number(draft.freight)) || Number(draft.freight) < 0) {
      setError('Freight must be zero or more.');
      return;
    }

    const nextId = Math.max(0, ...rows.map((po) => Number(po.id) || 0)) + 1;
    setRows((list) => [{
      id: nextId,
      poNo: nextProcessPoNo(list),
      vendor: draft.vendor.trim(),
      contact: draft.contact.trim(),
      poDate: draft.poDate,
      expectedReturn: draft.expectedReturn,
      status: draft.status,
      reference: draft.reference.trim(),
      lines: draft.lines.map((line) => ({
        ...line,
        prId: Number(line.prId),
        process: line.process.trim(),
        drawing: line.drawing.trim(),
        hsn: line.hsn.trim(),
        qty: Number(line.qty),
        rate: Number(line.rate),
        discountPct: Number(line.discountPct),
        gstPct: Number(line.gstPct),
      })),
      paymentTerms: draft.paymentTerms.trim(),
      deliveryTerms: draft.deliveryTerms.trim(),
      freight: Number(draft.freight),
      deliveryAddress: draft.deliveryAddress.trim(),
      terms: draft.terms.trim(),
      ...calculatePo(draft),
    }, ...list]);
    setRequirements((list) => list.map((pr) => {
      if (pr.status === 'Cancelled') return pr;
      const orderedQty = (orderedByPr.get(String(pr.id)) || 0) + (plannedByPr.get(String(pr.id)) || 0);
      return {
        ...pr,
        orderedQty,
        status: orderedQty >= Number(pr.requiredQty) ? 'Ordered' : 'Open',
      };
    }));
    setShow(false);
  };

  const remove = (po) => {
    if (!window.confirm(`Delete ${po.poNo}? Its process requirements will be reopened.`)) return;
    setRows((list) => list.filter((row) => row.id !== po.id));
    setRequirements((list) => list.map((pr) => {
      if (pr.status === 'Cancelled') return pr;
      const removedQty = po.lines
        .filter((line) => String(line.prId) === String(pr.id))
        .reduce((sum, line) => sum + Number(line.qty), 0);
      const orderedQty = Math.max(0, (orderedByPr.get(String(pr.id)) || 0) - removedQty);
      return {
        ...pr,
        orderedQty,
        status: orderedQty >= Number(pr.requiredQty) ? 'Ordered' : 'Open',
      };
    }));
  };

  const columns = [
    { key: 'poNo', label: 'Process PO No.', render: (po) => <b>{po.poNo}</b> },
    { key: 'vendor', label: 'Vendor' },
    { key: 'poDate', label: 'PO Date', render: (po) => fmtDate(po.poDate) },
    { key: 'expectedReturn', label: 'Expected Return', render: (po) => fmtDate(po.expectedReturn) },
    { key: 'lines', label: 'Process Lines', render: (po) => po.lines.length },
    { key: 'grandTotal', label: 'Grand Total', num: true, render: (po) => <b>{money(po.grandTotal)}</b> },
    { key: 'status', label: 'Status', render: (po) => <span className={`erp-pill ${po.status === 'Issued' ? 'good' : po.status === 'Cancelled' ? 'bad' : ''}`}>{po.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (po) => <button className="erp-link-btn process-po-delete" onClick={() => remove(po)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Process PO" icon="fa-arrow-right-arrow-left"
        subtitle="Issue outsourced process work to vendors against open process requirements."
        action="New Process PO" onAction={openForm}
        stats={[
          { label: 'Process POs', value: rows.length, tone: 'blue' },
          { label: 'Open Requirements', value: availableRequirements.length },
          { label: 'Issued', value: rows.filter((po) => po.status === 'Issued').length },
          { label: 'PO Value', value: money(rows.reduce((sum, po) => sum + po.grandTotal, 0)), tone: 'blue' },
        ]}
        columns={columns} rows={rows}
        filters={[{ key: 'status', all: 'All statuses', options: ['Draft', 'Issued', 'Completed', 'Cancelled'] }]}
        empty="No process POs yet — click + New Process PO"
      />

      {show && (
        <div className="erp-overlay process-po-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal process-po-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>New Process PO (Job Work)</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            {!availableRequirements.length && (
              <p className="process-po-hint">No open process requirements. Create a Process PR first.</p>
            )}

            <div className="process-po-header-fields">
              <label>
                <span>Vendor *</span>
                <input list="process-po-vendors" autoFocus value={draft.vendor} onChange={(event) => updateDraft('vendor', event.target.value)} placeholder="Select vendor..." />
                <datalist id="process-po-vendors">{vendorSuggestions.map((vendor) => <option key={vendor} value={vendor} />)}</datalist>
              </label>
              <label>
                <span>Contact Person</span>
                <input value={draft.contact} onChange={(event) => updateDraft('contact', event.target.value)} />
              </label>
              <label>
                <span>PO Date *</span>
                <input type="date" value={draft.poDate} onChange={(event) => updateDraft('poDate', event.target.value)} />
              </label>
              <label>
                <span>Expected Return</span>
                <input type="date" value={draft.expectedReturn} onChange={(event) => updateDraft('expectedReturn', event.target.value)} />
              </label>
              <label>
                <span>Status</span>
                <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>
                  {['Draft', 'Issued'].map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label>
                <span>Reference</span>
                <input value={draft.reference} onChange={(event) => updateDraft('reference', event.target.value)} placeholder="QA / reference" />
              </label>
            </div>

            <section className="process-po-lines-section">
              <div className="process-po-section-heading">
                <h4>Process Lines ({draft.lines.length})</h4>
                <button type="button" className="erp-link-btn" onClick={addLine}>+ Add Line</button>
              </div>
              <div className="process-po-table-header">
                <span>Process</span><span>For Drawing</span><span>HSN</span><span>Qty</span><span>Unit</span><span>Rate</span><span>Disc%</span><span>GST%</span><span>Amount</span>
              </div>
              {draft.lines.map((line) => {
                const lineTotal = calculateLine(line);
                const selectedRequirement = requirements.find((pr) => String(pr.id) === String(line.prId));
                const alreadyOnPo = draft.lines
                  .filter((item) => item.id !== line.id && item.prId === line.prId)
                  .reduce((sum, item) => sum + asNumber(item.qty), 0);
                const availableQty = selectedRequirement
                  ? Number(selectedRequirement.requiredQty) - (orderedByPr.get(selectedRequirement.id) || 0) - alreadyOnPo
                  : 0;
                return (
                  <div className="process-po-line-row" key={line.id}>
                    <label className="process-po-process">
                      <span>Process</span>
                      <select value={line.prId} onChange={(event) => selectRequirement(line.id, event.target.value)} disabled={!availableRequirements.length}>
                        <option value="">Search process...</option>
                        {availableRequirements.map((pr) => {
                          const remaining = Number(pr.requiredQty) - (orderedByPr.get(pr.id) || 0);
                          return <option key={pr.id} value={pr.id}>{pr.process} — {pr.drawing} ({remaining} {pr.unit} open)</option>;
                        })}
                      </select>
                    </label>
                    <label>
                      <span>For Drawing</span>
                      <input value={line.drawing} readOnly placeholder="Drawing" />
                    </label>
                    <label>
                      <span>HSN</span>
                      <input value={line.hsn} onChange={(event) => updateLine(line.id, 'hsn', event.target.value)} />
                    </label>
                    <label>
                      <span>Qty</span>
                      <input type="number" min="0.01" max={availableQty || undefined} step="any" value={line.qty} onChange={(event) => updateLine(line.id, 'qty', event.target.value)} />
                    </label>
                    <label>
                      <span>Unit</span>
                      <input value={line.unit} readOnly />
                    </label>
                    <label>
                      <span>Rate</span>
                      <input type="number" min="0" step="any" value={line.rate} onChange={(event) => updateLine(line.id, 'rate', event.target.value)} />
                    </label>
                    <label>
                      <span>Disc%</span>
                      <input type="number" min="0" max="100" step="any" value={line.discountPct} onChange={(event) => updateLine(line.id, 'discountPct', event.target.value)} />
                    </label>
                    <label>
                      <span>GST%</span>
                      <select value={line.gstPct} onChange={(event) => updateLine(line.id, 'gstPct', event.target.value)}>
                        {['0', '5', '12', '18', '28'].map((rate) => <option key={rate}>{rate}</option>)}
                      </select>
                    </label>
                    <div className="process-po-line-amount"><span>Amount</span><b>{money(lineTotal.amount)}</b></div>
                    {draft.lines.length > 1 && <button type="button" className="process-po-remove-line" aria-label="Remove line" onClick={() => removeLine(line.id)}>×</button>}
                  </div>
                );
              })}
            </section>

            <div className="process-po-bottom-layout">
              <div className="process-po-details">
                <div className="process-po-detail-fields">
                  <label><span>Payment Terms</span><input value={draft.paymentTerms} onChange={(event) => updateDraft('paymentTerms', event.target.value)} /></label>
                  <label><span>Delivery Terms</span><input value={draft.deliveryTerms} onChange={(event) => updateDraft('deliveryTerms', event.target.value)} /></label>
                  <label><span>Freight (₹)</span><input type="number" min="0" step="any" value={draft.freight} onChange={(event) => updateDraft('freight', event.target.value)} /></label>
                  <label><span>Delivery Address</span><input value={draft.deliveryAddress} onChange={(event) => updateDraft('deliveryAddress', event.target.value)} /></label>
                </div>
                <label className="process-po-terms">
                  <span>Terms &amp; Conditions / Notes</span>
                  <textarea value={draft.terms} onChange={(event) => updateDraft('terms', event.target.value)} rows="3" />
                </label>
              </div>
              <div className="process-po-totals" aria-live="polite">
                <div><span>Subtotal</span><b>{money(totals.subtotal)}</b></div>
                <div><span>Discount</span><b>{money(totals.discount)}</b></div>
                <div><span>Taxable Amount</span><b>{money(totals.taxable)}</b></div>
                <div><span>CGST</span><b>{money(totals.cgst)}</b></div>
                <div><span>SGST</span><b>{money(totals.sgst)}</b></div>
                <div><span>Round Off</span><b>{money(totals.roundOff)}</b></div>
                <div className="process-po-grand-total"><span>Grand Total</span><b>{money(totals.grandTotal)}</b></div>
                <small>Intra-state (Maharashtra) — CGST + SGST</small>
              </div>
            </div>

            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn" disabled={!availableRequirements.length}>Create Process PO</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
