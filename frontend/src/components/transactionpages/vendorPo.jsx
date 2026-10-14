import React, { useEffect, useMemo, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, VPO_KEY, fmtDate, today, nextVendorPoNo } from '../../store/erpstore';
import '../../styles/vendorPo.css';

const newLine = (id) => ({
  id,
  material: '',
  hsn: '',
  qty: '1',
  unit: 'KG',
  rate: '',
  discountPct: '0',
  gstPct: '18',
});

const newDraft = () => ({
  vendor: '',
  contact: '',
  poDate: today(),
  expectedDelivery: '',
  status: 'Draft',
  reference: '',
  lines: [newLine(1)],
  paymentTerms: '',
  deliveryTerms: '',
  freight: '0',
  deliveryAddress: '',
  terms: '',
});

const money = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
  const cgst = gst / 2;
  const sgst = gst / 2;
  const beforeRoundOff = taxable + cgst + sgst;
  const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
  return {
    subtotal,
    discount,
    taxable,
    cgst,
    sgst,
    roundOff,
    grandTotal: beforeRoundOff + roundOff,
  };
}

export default function VendorPo() {
  const [rows, setRows] = useStore(VPO_KEY, []);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(newDraft);
  const [error, setError] = useState('');

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
      !line.material.trim() ||
      !Number.isFinite(Number(line.qty)) || Number(line.qty) <= 0 ||
      line.rate === '' || !Number.isFinite(Number(line.rate)) || Number(line.rate) < 0 ||
      !Number.isFinite(Number(line.discountPct)) || Number(line.discountPct) < 0 || Number(line.discountPct) > 100 ||
      !Number.isFinite(Number(line.gstPct)) || Number(line.gstPct) < 0 || Number(line.gstPct) > 100
    ));
    if (invalidLine) {
      setError('Each line needs a material, quantity above zero, and valid rate, discount and GST values.');
      return;
    }
    if (!Number.isFinite(Number(draft.freight)) || Number(draft.freight) < 0) {
      setError('Freight must be zero or more.');
      return;
    }

    setRows((list) => [{
      id: Date.now(),
      poNo: nextVendorPoNo(list),
      vendor: draft.vendor.trim(),
      contact: draft.contact.trim(),
      poDate: draft.poDate,
      expectedDelivery: draft.expectedDelivery,
      status: draft.status,
      reference: draft.reference.trim(),
      lines: draft.lines.map((line) => ({
        ...line,
        material: line.material.trim(),
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
    setShow(false);
  };

  const remove = (po) => {
    if (window.confirm(`Delete ${po.poNo}?`)) {
      setRows((list) => list.filter((row) => row.id !== po.id));
    }
  };

  const columns = [
    { key: 'poNo', label: 'PO No.', render: (po) => <b>{po.poNo}</b> },
    { key: 'reference', label: 'Reference' },
    { key: 'poDate', label: 'PO Date', render: (po) => fmtDate(po.poDate) },
    { key: 'vendor', label: 'Vendor' },
    { key: 'lines', label: 'Items', render: (po) => po.lines.length },
    { key: 'grandTotal', label: 'Grand Total', num: true, render: (po) => <b>{money(po.grandTotal)}</b> },
    { key: 'status', label: 'Status', render: (po) => <span className={`erp-pill ${po.status === 'Received' ? 'good' : po.status === 'Cancelled' ? 'bad' : ''}`}>{po.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (po) => <button className="erp-link-btn vendor-po-delete" onClick={() => remove(po)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Vendor PO" icon="fa-truck"
        subtitle="Create vendor purchase orders with live item pricing, discounts and GST calculations."
        action="New Vendor PO" onAction={openForm}
        stats={[
          { label: 'Total POs', value: rows.length },
          { label: 'Draft', value: rows.filter((po) => po.status === 'Draft').length, tone: 'blue' },
          { label: 'Issued', value: rows.filter((po) => po.status === 'Issued').length },
          { label: 'PO value', value: money(rows.reduce((sum, po) => sum + po.grandTotal, 0)), tone: 'blue' },
        ]}
        columns={columns} rows={rows}
        filters={[{ key: 'status', all: 'All statuses', options: ['Draft', 'Issued', 'Received', 'Cancelled'] }]}
        empty="No vendor POs yet — click + New Vendor PO"
      />

      {show && (
        <div className="erp-overlay vendor-po-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal vendor-po-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>New Vendor PO</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            <div className="vendor-po-header-fields">
              <label>
                <span>Vendor *</span>
                <input autoFocus value={draft.vendor} onChange={(event) => updateDraft('vendor', event.target.value)} placeholder="Select or type vendor..." />
              </label>
              <label>
                <span>Contact Person</span>
                <input value={draft.contact} onChange={(event) => updateDraft('contact', event.target.value)} placeholder="Contact person" />
              </label>
              <label>
                <span>PO Date *</span>
                <input type="date" value={draft.poDate} onChange={(event) => updateDraft('poDate', event.target.value)} />
              </label>
              <label>
                <span>Expected Delivery</span>
                <input type="date" value={draft.expectedDelivery} onChange={(event) => updateDraft('expectedDelivery', event.target.value)} />
              </label>
              <label>
                <span>Status</span>
                <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>
                  {['Draft', 'Issued', 'Received', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label>
                <span>Reference</span>
                <input value={draft.reference} onChange={(event) => updateDraft('reference', event.target.value)} placeholder="Quotation / reference" />
              </label>
            </div>

            <section className="vendor-po-items-section">
              <div className="vendor-po-section-heading">
                <h4>Items ({draft.lines.length})</h4>
                <button type="button" className="erp-link-btn" onClick={addLine}>+ Add Line</button>
              </div>
              <div className="vendor-po-items-labels">
                <span>Material / Group</span><span>HSN</span><span>Qty</span><span>Unit</span><span>Rate</span><span>Disc%</span><span>GST%</span><span>Amount</span><span></span>
              </div>
              {draft.lines.map((line) => {
                const lineTotals = calculateLine(line);
                return (
                  <div className="vendor-po-item-row" key={line.id}>
                    <label className="vendor-po-material">
                      <span>Material / Group</span>
                      <input value={line.material} onChange={(event) => updateLine(line.id, 'material', event.target.value)} placeholder="Search material / group..." />
                    </label>
                    <label>
                      <span>HSN</span>
                      <input value={line.hsn} onChange={(event) => updateLine(line.id, 'hsn', event.target.value)} />
                    </label>
                    <label>
                      <span>Qty</span>
                      <input type="number" min="0.01" step="any" value={line.qty} onChange={(event) => updateLine(line.id, 'qty', event.target.value)} />
                    </label>
                    <label>
                      <span>Unit</span>
                      <select value={line.unit} onChange={(event) => updateLine(line.id, 'unit', event.target.value)}>
                        {['KG', 'NOS', 'SET', 'MTR', 'LTR', 'LOT'].map((unit) => <option key={unit}>{unit}</option>)}
                      </select>
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
                    <div className="vendor-po-row-amount">
                      <span>Amount</span>
                      <b>{money(lineTotals.amount)}</b>
                    </div>
                    <button type="button" className="vendor-po-remove-line" aria-label="Remove item" disabled={draft.lines.length === 1} onClick={() => removeLine(line.id)}>×</button>
                  </div>
                );
              })}
            </section>

            <div className="vendor-po-bottom-layout">
              <div className="vendor-po-details">
                <div className="vendor-po-detail-fields">
                  <label>
                    <span>Payment Terms</span>
                    <input value={draft.paymentTerms} onChange={(event) => updateDraft('paymentTerms', event.target.value)} />
                  </label>
                  <label>
                    <span>Delivery Terms</span>
                    <input value={draft.deliveryTerms} onChange={(event) => updateDraft('deliveryTerms', event.target.value)} />
                  </label>
                  <label>
                    <span>Freight</span>
                    <input type="number" min="0" step="any" value={draft.freight} onChange={(event) => updateDraft('freight', event.target.value)} />
                  </label>
                  <label>
                    <span>Delivery Address</span>
                    <input value={draft.deliveryAddress} onChange={(event) => updateDraft('deliveryAddress', event.target.value)} />
                  </label>
                </div>
                <label className="vendor-po-terms">
                  <span>Terms &amp; Conditions / Notes</span>
                  <textarea value={draft.terms} onChange={(event) => updateDraft('terms', event.target.value)} rows="4" placeholder="Add terms, conditions or notes..." />
                </label>
              </div>
              <div className="vendor-po-totals" aria-live="polite">
                <div><span>Subtotal</span><b>{money(totals.subtotal)}</b></div>
                <div><span>Discount</span><b>{money(totals.discount)}</b></div>
                <div><span>Taxable Amount</span><b>{money(totals.taxable)}</b></div>
                <div><span>CGST</span><b>{money(totals.cgst)}</b></div>
                <div><span>SGST</span><b>{money(totals.sgst)}</b></div>
                <div><span>Round Off</span><b>{money(totals.roundOff)}</b></div>
                <div className="vendor-po-grand-total"><span>Grand Total</span><b>{money(totals.grandTotal)}</b></div>
                <small>Intra-state (Maharashtra) — CGST + SGST</small>
              </div>
            </div>

            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn">Create Vendor PO</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
