import React, { useEffect, useMemo, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import {
  useStore,
  ENQ_KEY,
  QUOTATION_KEY,
  CUST_KEY,
  fmtDate,
  today,
  nextQuotationNo,
} from '../../store/erpstore';
import '../../styles/quotation.css';

const defaultTerms = '1. Prices are Ex-works unless otherwise stated.\n2. Taxes extra as applicable.\n3. Delivery subject to confirmation at the time of order.\n4. Quotation valid until the date mentioned above.';

const newLine = (id) => ({
  id,
  item: '',
  hsn: '',
  gstPct: '18',
  description: '',
  qty: '1',
  unit: 'NOS',
  rate: '',
  discountPct: '0',
  remarks: '',
});

const newDraft = () => ({
  customer: '',
  contact: '',
  enquiryId: '',
  date: today(),
  validUntil: '',
  status: 'Draft',
  reference: '',
  lines: [newLine(1)],
  paymentTerms: '',
  deliveryPeriod: '',
  packing: '0',
  freight: '0',
  warranty: '',
  terms: defaultTerms,
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

function calculateQuotation(quotation) {
  const lines = quotation.lines.map(calculateLine);
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = lines.reduce((sum, line) => sum + line.discount, 0);
  const taxable = lines.reduce((sum, line) => sum + line.taxable, 0) + asNumber(quotation.packing) + asNumber(quotation.freight);
  const gst = lines.reduce((sum, line) => sum + line.gst, 0);
  const cgst = gst / 2;
  const sgst = gst / 2;
  const beforeRoundOff = taxable + cgst + sgst;
  const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
  return { subtotal, discount, taxable, cgst, sgst, roundOff, grandTotal: beforeRoundOff + roundOff };
}

export default function Quotation() {
  const [rows, setRows] = useStore(QUOTATION_KEY, []);
  const [enquiries] = useStore(ENQ_KEY, []);
  const [customers] = useStore(CUST_KEY, []);
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

  const totals = useMemo(() => calculateQuotation(draft), [draft]);

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

  const selectEnquiry = (id) => {
    const enquiry = enquiries.find((item) => String(item.id) === id);
    if (!enquiry) {
      setDraft((current) => ({ ...current, enquiryId: '' }));
      setError('');
      return;
    }
    setDraft((current) => ({
      ...current,
      enquiryId: id,
      customer: enquiry.customer,
      contact: enquiry.contact || '',
      lines: enquiry.items.map((item, index) => ({
        ...newLine(index + 1),
        item: item.item,
        description: item.description || '',
        qty: String(item.qty || 1),
        unit: item.unit || 'NOS',
        rate: item.targetPrice === '' ? '' : String(item.targetPrice),
        remarks: item.remarks || '',
      })),
    }));
    setError('');
  };

  const save = (event) => {
    event.preventDefault();
    if (!draft.customer.trim()) {
      setError('Customer is required.');
      return;
    }
    if (!draft.date) {
      setError('Quotation date is required.');
      return;
    }
    if (draft.validUntil && draft.validUntil < draft.date) {
      setError('Valid-until date must be on or after the quotation date.');
      return;
    }
    const invalidLine = draft.lines.find((line) => (
      !line.item.trim() ||
      !Number.isFinite(Number(line.qty)) || Number(line.qty) <= 0 ||
      line.rate === '' || !Number.isFinite(Number(line.rate)) || Number(line.rate) < 0 ||
      !Number.isFinite(Number(line.discountPct)) || Number(line.discountPct) < 0 || Number(line.discountPct) > 100 ||
      !Number.isFinite(Number(line.gstPct)) || Number(line.gstPct) < 0 || Number(line.gstPct) > 100
    ));
    if (invalidLine) {
      setError('Each line needs an item, quantity above zero, and valid rate, discount and GST values.');
      return;
    }
    if (
      !Number.isFinite(Number(draft.packing)) || Number(draft.packing) < 0 ||
      !Number.isFinite(Number(draft.freight)) || Number(draft.freight) < 0
    ) {
      setError('Packing and forwarding and freight must be zero or more.');
      return;
    }

    const enquiry = enquiries.find((item) => String(item.id) === draft.enquiryId);
    setRows((list) => [{
      id: Date.now(),
      quotationNo: nextQuotationNo(list),
      customer: draft.customer.trim().toUpperCase(),
      contact: draft.contact.trim(),
      enquiryId: draft.enquiryId || '',
      enquiryNo: enquiry?.enquiryNo || '',
      date: draft.date,
      validUntil: draft.validUntil,
      status: draft.status,
      reference: draft.reference.trim(),
      lines: draft.lines.map((line) => ({
        ...line,
        item: line.item.trim(),
        hsn: line.hsn.trim(),
        description: line.description.trim(),
        qty: Number(line.qty),
        rate: Number(line.rate),
        discountPct: Number(line.discountPct),
        gstPct: Number(line.gstPct),
        remarks: line.remarks.trim(),
      })),
      paymentTerms: draft.paymentTerms.trim(),
      deliveryPeriod: draft.deliveryPeriod.trim(),
      packing: Number(draft.packing),
      freight: Number(draft.freight),
      warranty: draft.warranty.trim(),
      terms: draft.terms.trim(),
      ...calculateQuotation(draft),
    }, ...list]);
    setShow(false);
  };

  const remove = (quotation) => {
    if (window.confirm(`Delete ${quotation.quotationNo}?`)) {
      setRows((list) => list.filter((item) => item.id !== quotation.id));
    }
  };

  const changeStatus = (quotation, status) => {
    setRows((list) => list.map((item) => item.id === quotation.id ? { ...item, status } : item));
  };

  const contactSuggestions = [...new Set(customers.map((customer) => customer.contact).filter(Boolean))];
  const columns = [
    { key: 'quotationNo', label: 'Quotation No.', render: (quotation) => <b>{quotation.quotationNo}</b> },
    { key: 'date', label: 'Date', render: (quotation) => fmtDate(quotation.date) },
    { key: 'customer', label: 'Customer' },
    { key: 'enquiryNo', label: 'Reference Enquiry' },
    { key: 'grandTotal', label: 'Grand Total', num: true, render: (quotation) => <b>{money(quotation.grandTotal)}</b> },
    { key: 'validUntil', label: 'Valid Until', render: (quotation) => fmtDate(quotation.validUntil) },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (quotation) => (
        <select className="quotation-status" aria-label={`Status for ${quotation.quotationNo}`} value={quotation.status} onChange={(event) => changeStatus(quotation, event.target.value)}>
          {['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'].map((status) => <option key={status}>{status}</option>)}
        </select>
      ),
    },
    { key: 'actions', label: '', sortable: false, render: (quotation) => <button className="erp-link-btn quotation-delete" onClick={() => remove(quotation)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Quotations" icon="fa-file-invoice"
        subtitle="Prepare and track customer quotations with live pricing, tax and validity details."
        action="New Quotation" onAction={openForm}
        stats={[
          { label: 'Quotations', value: rows.length },
          { label: 'Draft', value: rows.filter((quotation) => quotation.status === 'Draft').length, tone: 'blue' },
          { label: 'Accepted', value: rows.filter((quotation) => quotation.status === 'Accepted').length },
          { label: 'Quoted value', value: money(rows.reduce((sum, quotation) => sum + quotation.grandTotal, 0)), tone: 'blue' },
        ]}
        columns={columns} rows={rows}
        filters={[{ key: 'status', all: 'All statuses', options: ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'] }]}
        empty="No quotations yet — click + New Quotation"
      />

      {show && (
        <div className="erp-overlay quotation-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal quotation-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>New Customer Quotation</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            <div className="quotation-header-fields">
              <label>
                <span>Customer *</span>
                {customers.length ? (
                  <select autoFocus value={draft.customer} onChange={(event) => {
                    const customer = customers.find((item) => item.name === event.target.value);
                    setDraft((current) => ({ ...current, customer: event.target.value, contact: customer?.contact || '' }));
                    setError('');
                  }}>
                    <option value="">Select customer...</option>
                    {customers.map((customer) => <option key={customer.id} value={customer.name}>{customer.name}</option>)}
                  </select>
                ) : (
                  <input autoFocus value={draft.customer} onChange={(event) => updateDraft('customer', event.target.value)} placeholder="Type customer name" />
                )}
              </label>
              <label>
                <span>Contact Person</span>
                <input list="quotation-contacts" value={draft.contact} onChange={(event) => updateDraft('contact', event.target.value)} />
                <datalist id="quotation-contacts">{contactSuggestions.map((contact) => <option key={contact} value={contact} />)}</datalist>
              </label>
              <label>
                <span>Quotation Date *</span>
                <input type="date" value={draft.date} onChange={(event) => updateDraft('date', event.target.value)} />
              </label>
              <label>
                <span>Reference Enquiry</span>
                <select value={draft.enquiryId} onChange={(event) => selectEnquiry(event.target.value)}>
                  <option value="">—</option>
                  {enquiries.map((enquiry) => <option key={enquiry.id} value={enquiry.id}>{enquiry.enquiryNo} — {enquiry.customer}</option>)}
                </select>
              </label>
              <label>
                <span>Valid Until</span>
                <input type="date" min={draft.date} value={draft.validUntil} onChange={(event) => updateDraft('validUntil', event.target.value)} />
              </label>
              <label>
                <span>Status</span>
                <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>
                  {['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'].map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="quotation-reference">
                <span>Reference / Source</span>
                <input value={draft.reference} onChange={(event) => updateDraft('reference', event.target.value)} placeholder="e.g. Email dated..., tender ref..." />
              </label>
            </div>

            <section className="quotation-lines-section">
              <div className="quotation-section-heading">
                <h4>Quotation Items ({draft.lines.length})</h4>
                <button type="button" className="erp-link-btn" onClick={addLine}>+ Add Line</button>
              </div>
              {draft.lines.map((line, index) => {
                const lineTotal = calculateLine(line);
                return (
                  <div className="quotation-line" key={line.id}>
                    <div className="quotation-line-heading">
                      <strong>#{index + 1}</strong>
                      <span>{line.item || 'No item selected'}</span>
                      {draft.lines.length > 1 && <button type="button" className="quotation-remove-line" onClick={() => removeLine(line.id)}>Remove</button>}
                      <b>{money(lineTotal.amount)}</b>
                    </div>
                    <div className="quotation-line-fields">
                      <label className="quotation-item-name">
                        <span>Item / Drawing No. *</span>
                        <input value={line.item} onChange={(event) => updateLine(line.id, 'item', event.target.value)} placeholder="Search master or type new..." />
                      </label>
                      <label>
                        <span>HSN</span>
                        <input value={line.hsn} onChange={(event) => updateLine(line.id, 'hsn', event.target.value)} />
                      </label>
                      <label>
                        <span>GST %</span>
                        <select value={line.gstPct} onChange={(event) => updateLine(line.id, 'gstPct', event.target.value)}>
                          {['0', '5', '12', '18', '28'].map((rate) => <option key={rate}>{rate}</option>)}
                        </select>
                      </label>
                      <label className="quotation-description">
                        <span>Description</span>
                        <input value={line.description} onChange={(event) => updateLine(line.id, 'description', event.target.value)} />
                      </label>
                      <label>
                        <span>Qty *</span>
                        <input type="number" min="0.01" step="any" value={line.qty} onChange={(event) => updateLine(line.id, 'qty', event.target.value)} />
                      </label>
                      <label>
                        <span>Unit</span>
                        <select value={line.unit} onChange={(event) => updateLine(line.id, 'unit', event.target.value)}>
                          {['NOS', 'SET', 'KG', 'MTR', 'LOT'].map((unit) => <option key={unit}>{unit}</option>)}
                        </select>
                      </label>
                      <label>
                        <span>Rate (₹) *</span>
                        <input type="number" min="0" step="any" value={line.rate} onChange={(event) => updateLine(line.id, 'rate', event.target.value)} />
                      </label>
                      <label>
                        <span>Discount %</span>
                        <input type="number" min="0" max="100" step="any" value={line.discountPct} onChange={(event) => updateLine(line.id, 'discountPct', event.target.value)} />
                      </label>
                      <label className="quotation-amount">
                        <span>Amount</span>
                        <input value={money(lineTotal.amount)} readOnly />
                      </label>
                      <label className="quotation-remarks">
                        <span>Remarks</span>
                        <input value={line.remarks} onChange={(event) => updateLine(line.id, 'remarks', event.target.value)} />
                      </label>
                    </div>
                  </div>
                );
              })}
            </section>

            <div className="quotation-bottom-layout">
              <div className="quotation-details">
                <div className="quotation-detail-fields">
                  <label>
                    <span>Payment Terms</span>
                    <input value={draft.paymentTerms} onChange={(event) => updateDraft('paymentTerms', event.target.value)} />
                  </label>
                  <label>
                    <span>Delivery Period</span>
                    <input value={draft.deliveryPeriod} onChange={(event) => updateDraft('deliveryPeriod', event.target.value)} />
                  </label>
                  <label>
                    <span>Packing &amp; Forwarding (₹)</span>
                    <input type="number" min="0" step="any" value={draft.packing} onChange={(event) => updateDraft('packing', event.target.value)} />
                  </label>
                  <label>
                    <span>Freight (₹)</span>
                    <input type="number" min="0" step="any" value={draft.freight} onChange={(event) => updateDraft('freight', event.target.value)} />
                  </label>
                  <label className="quotation-warranty">
                    <span>Warranty</span>
                    <input value={draft.warranty} onChange={(event) => updateDraft('warranty', event.target.value)} />
                  </label>
                </div>
                <label className="quotation-terms">
                  <span>Notes / Terms &amp; Conditions</span>
                  <textarea value={draft.terms} onChange={(event) => updateDraft('terms', event.target.value)} rows="4" />
                </label>
              </div>
              <div className="quotation-totals" aria-live="polite">
                <div><span>Subtotal</span><b>{money(totals.subtotal)}</b></div>
                <div><span>Discount</span><b>{money(totals.discount)}</b></div>
                <div><span>Taxable Amount</span><b>{money(totals.taxable)}</b></div>
                <div><span>CGST</span><b>{money(totals.cgst)}</b></div>
                <div><span>SGST</span><b>{money(totals.sgst)}</b></div>
                <div><span>Round Off</span><b>{money(totals.roundOff)}</b></div>
                <div className="quotation-grand-total"><span>Grand Total</span><b>{money(totals.grandTotal)}</b></div>
                <small>Intra-state — CGST + SGST</small>
              </div>
            </div>

            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn">Create Quotation</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
