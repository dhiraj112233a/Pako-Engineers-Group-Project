import React, { useEffect, useMemo, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, CPO_KEY, CUST_KEY, GST_SLAB_KEY, GST_SLAB_SEED, GLOBAL_SETTINGS_KEY, GLOBAL_SETTINGS_DEFAULT, fmtDate, today, nextCustomerPoNo } from '../../store/erpstore';
import '../../styles/customerPo.css';

const defaultTerms = 'Material as per approved drawing\nDelivery within 30 days\nPayment 30 days from invoice';

const newLine = (id) => ({
  id,
  drawing: '',
  hsn: '',
  material: '',
  deliveryDate: '',
  description: '',
  basicPrice: '',
  discountPct: '0',
  qty: '1',
  unit: 'NOS',
  settingCharges: '0',
  pfPct: '0',
});

const newDraft = () => ({
  customer: '',
  contact: '',
  plant: '',
  poType: 'Material',
  receivedPoNo: '',
  verbal: false,
  poDate: today(),
  lines: [newLine(1)],
  transportCharges: '0',
  otherCharges: '0',
  gstPct: '18',
  igst: false,
  paymentTerms: '',
  terms: defaultTerms,
});

const money = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const asNumber = (value) => Number(value) || 0;

function calculateLine(line) {
  const gross = asNumber(line.basicPrice) * asNumber(line.qty);
  const afterDiscount = gross * (1 - asNumber(line.discountPct) / 100);
  const pf = afterDiscount * asNumber(line.pfPct) / 100;
  const total = afterDiscount + asNumber(line.settingCharges) + pf;
  return { gross, afterDiscount, pf, total };
}

function calculatePo(po) {
  const itemsTotal = po.lines.reduce((sum, line) => sum + calculateLine(line).total, 0);
  const taxable = itemsTotal + asNumber(po.transportCharges) + asNumber(po.otherCharges);
  const tax = taxable * asNumber(po.gstPct) / 100;
  const beforeRoundOff = taxable + tax;
  const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
  return {
    itemsTotal,
    taxable,
    tax,
    roundOff,
    grandTotal: beforeRoundOff + roundOff,
  };
}

export default function CustomerPo() {
  const [rows, setRows] = useStore(CPO_KEY, []);
  const [customers] = useStore(CUST_KEY, []);
  const [gstSlabs] = useStore(GST_SLAB_KEY, GST_SLAB_SEED);
  const [globalSettings] = useStore(GLOBAL_SETTINGS_KEY, GLOBAL_SETTINGS_DEFAULT);
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
  const gstRates = [...new Set(gstSlabs.map((slab) => Number(slab.cgst) + Number(slab.sgst) || Number(slab.igst)))].sort((a, b) => a - b);
  if (!gstRates.includes(Number(draft.gstPct))) gstRates.push(Number(draft.gstPct));
  gstRates.sort((a, b) => a - b);

  const openForm = () => {
    setDraft({ ...newDraft(), paymentTerms: globalSettings.customerDefaults?.paymentTerms || '' });
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

  const customerChange = (value) => {
    const selected = customers.find((customer) => customer.name === value);
    setDraft((current) => ({
      ...current,
      customer: value,
      contact: selected?.contact || '',
    }));
    setError('');
  };

  const save = (event) => {
    event.preventDefault();
    if (!draft.customer.trim()) {
      setError('Customer is required.');
      return;
    }
    if (!draft.verbal && !draft.receivedPoNo.trim()) {
      setError('Enter the received PO number or mark the PO as verbal.');
      return;
    }
    if (!draft.poDate) {
      setError('PO date is required.');
      return;
    }
    const invalidLine = draft.lines.find((line) => (
      !line.drawing.trim() ||
      !Number.isFinite(Number(line.basicPrice)) || Number(line.basicPrice) <= 0 ||
      !Number.isFinite(Number(line.qty)) || Number(line.qty) <= 0 ||
      !Number.isFinite(Number(line.discountPct)) || Number(line.discountPct) < 0 || Number(line.discountPct) > 100 ||
      !Number.isFinite(Number(line.settingCharges)) || Number(line.settingCharges) < 0 ||
      !Number.isFinite(Number(line.pfPct)) || Number(line.pfPct) < 0 || Number(line.pfPct) > 100
    ));
    if (invalidLine) {
      setError('Each line needs a drawing number, a price and a quantity above zero. Discount and P&F must be between 0 and 100.');
      return;
    }
    if (
      !Number.isFinite(Number(draft.transportCharges)) || Number(draft.transportCharges) < 0 ||
      !Number.isFinite(Number(draft.otherCharges)) || Number(draft.otherCharges) < 0
    ) {
      setError('Transport and other charges must be zero or more.');
      return;
    }

    setRows((list) => [{
      id: Date.now(),
      poNo: nextCustomerPoNo(list),
      customer: draft.customer.trim().toUpperCase(),
      contact: draft.contact.trim(),
      plant: draft.plant.trim(),
      poType: draft.poType,
      receivedPoNo: draft.verbal ? 'Verbal' : draft.receivedPoNo.trim(),
      verbal: draft.verbal,
      poDate: draft.poDate,
      lines: draft.lines.map((line) => ({
        ...line,
        drawing: line.drawing.trim(),
        hsn: line.hsn.trim(),
        material: line.material.trim(),
        description: line.description.trim(),
        basicPrice: Number(line.basicPrice),
        discountPct: Number(line.discountPct),
        qty: Number(line.qty),
        settingCharges: Number(line.settingCharges),
        pfPct: Number(line.pfPct),
      })),
      transportCharges: Number(draft.transportCharges),
      otherCharges: Number(draft.otherCharges),
      gstPct: Number(draft.gstPct),
      igst: draft.igst,
      paymentTerms: draft.paymentTerms.trim(),
      terms: draft.terms.trim(),
      ...calculatePo(draft),
      status: 'Received',
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
    { key: 'receivedPoNo', label: 'Customer PO No.' },
    { key: 'poDate', label: 'PO Date', render: (po) => fmtDate(po.poDate) },
    { key: 'customer', label: 'Customer' },
    { key: 'lines', label: 'Lines', render: (po) => po.lines.length },
    { key: 'grandTotal', label: 'Grand Total', num: true, render: (po) => <b>{money(po.grandTotal)}</b> },
    { key: 'status', label: 'Status', render: (po) => <span className="erp-pill good">{po.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (po) => <button className="erp-link-btn customer-po-delete" onClick={() => remove(po)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Customer PO" icon="fa-cart-shopping"
        subtitle="Record customer purchase orders, line-item pricing, charges and GST totals."
        action="Create Customer PO" onAction={openForm}
        stats={[
          { label: 'Total POs', value: rows.length },
          { label: 'Received', value: rows.filter((po) => po.status === 'Received').length, tone: 'blue' },
          { label: 'Material POs', value: rows.filter((po) => po.poType === 'Material').length },
          { label: 'PO value', value: money(rows.reduce((sum, po) => sum + po.grandTotal, 0)), tone: 'blue' },
        ]}
        columns={columns} rows={rows}
        empty="No customer POs yet — click + Create Customer PO"
      />

      {show && (
        <div className="erp-overlay customer-po-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal customer-po-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>Create Customer PO</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            <div className="customer-po-fields">
              <label>
                <span>Customer *</span>
                {customers.length ? (
                  <select autoFocus value={draft.customer} onChange={(event) => customerChange(event.target.value)}>
                    <option value="">Select customer...</option>
                    {customers.map((customer) => <option key={customer.id} value={customer.name}>{customer.name}</option>)}
                  </select>
                ) : (
                  <input autoFocus list="customer-po-customers" value={draft.customer} onChange={(event) => customerChange(event.target.value)} placeholder="Type customer name" />
                )}
                {!customers.length && (
                  <datalist id="customer-po-customers">
                    {customers.map((customer) => <option key={customer.id} value={customer.name} />)}
                  </datalist>
                )}
              </label>
              <label>
                <span>Contact Person</span>
                <input list="customer-po-contacts" value={draft.contact} onChange={(event) => updateDraft('contact', event.target.value)} placeholder="Contact person" />
                <datalist id="customer-po-contacts">
                  {[...new Set(customers.map((customer) => customer.contact).filter(Boolean))].map((contact) => <option key={contact} value={contact} />)}
                </datalist>
              </label>
              <label>
                <span>Plant</span>
                <input value={draft.plant} onChange={(event) => updateDraft('plant', event.target.value)} placeholder="Plant / delivery location" />
              </label>
              <label>
                <span>PO Type</span>
                <select value={draft.poType} onChange={(event) => updateDraft('poType', event.target.value)}>
                  {['Material', 'Service'].map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label>
                <span>Received PO No. {!draft.verbal && '*'}</span>
                <input value={draft.receivedPoNo} onChange={(event) => updateDraft('receivedPoNo', event.target.value)} placeholder={draft.verbal ? 'Verbal PO' : 'Enter customer PO number'} disabled={draft.verbal} />
                <span className="customer-po-verbal">
                  <input type="checkbox" checked={draft.verbal} onChange={(event) => updateDraft('verbal', event.target.checked)} />
                  Verbal
                </span>
              </label>
              <label>
                <span>PO Date *</span>
                <input type="date" value={draft.poDate} onChange={(event) => updateDraft('poDate', event.target.value)} />
              </label>
            </div>

            <section className="customer-po-lines-section">
              <div className="customer-po-section-heading">
                <h4>Line Items ({draft.lines.length})</h4>
                <button type="button" className="erp-link-btn" onClick={addLine}>+ Add Line</button>
              </div>
              {draft.lines.map((line, index) => {
                const lineTotals = calculateLine(line);
                return (
                  <div className="customer-po-line" key={line.id}>
                    <div className="customer-po-line-heading">
                      <strong>#{index + 1}</strong>
                      <span>{line.drawing || 'No drawing selected'}</span>
                      {draft.lines.length > 1 && <button type="button" className="customer-po-remove-line" onClick={() => removeLine(line.id)}>Remove</button>}
                      <b>{money(lineTotals.total)}</b>
                    </div>
                    <div className="customer-po-line-fields">
                      <label className="po-drawing">
                        <span>Drawing No. *</span>
                        <input value={line.drawing} onChange={(event) => updateLine(line.id, 'drawing', event.target.value)} placeholder="Search or type new drawing..." />
                      </label>
                      <label>
                        <span>HSN</span>
                        <input value={line.hsn} onChange={(event) => updateLine(line.id, 'hsn', event.target.value)} />
                      </label>
                      <label>
                        <span>Material</span>
                        <input value={line.material} onChange={(event) => updateLine(line.id, 'material', event.target.value)} placeholder="e.g. EN8" />
                      </label>
                      <label>
                        <span>Delivery Date</span>
                        <input type="date" value={line.deliveryDate} onChange={(event) => updateLine(line.id, 'deliveryDate', event.target.value)} />
                      </label>
                      <label className="po-description">
                        <span>Description</span>
                        <input value={line.description} onChange={(event) => updateLine(line.id, 'description', event.target.value)} />
                      </label>
                      <label>
                        <span>Basic Price *</span>
                        <input type="number" min="0.01" step="any" value={line.basicPrice} onChange={(event) => updateLine(line.id, 'basicPrice', event.target.value)} />
                      </label>
                      <label>
                        <span>Discount %</span>
                        <input type="number" min="0" max="100" step="any" value={line.discountPct} onChange={(event) => updateLine(line.id, 'discountPct', event.target.value)} />
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
                        <span>Setting Charges</span>
                        <input type="number" min="0" step="any" value={line.settingCharges} onChange={(event) => updateLine(line.id, 'settingCharges', event.target.value)} />
                      </label>
                      <label>
                        <span>P&amp;F %</span>
                        <input type="number" min="0" max="100" step="any" value={line.pfPct} onChange={(event) => updateLine(line.id, 'pfPct', event.target.value)} />
                      </label>
                      <div className="customer-po-line-calc">
                        After discount: <b>{money(lineTotals.afterDiscount)}</b>
                        <span>P&amp;F: <b>{money(lineTotals.pf)}</b></span>
                        <span>Line: <b>{money(lineTotals.total)}</b></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <div className="customer-po-totals-layout">
              <div className="customer-po-charge-fields">
                <label>
                  <span>Transport Charges</span>
                  <input type="number" min="0" step="any" value={draft.transportCharges} onChange={(event) => updateDraft('transportCharges', event.target.value)} />
                </label>
                <label>
                  <span>Other Charges</span>
                  <input type="number" min="0" step="any" value={draft.otherCharges} onChange={(event) => updateDraft('otherCharges', event.target.value)} />
                </label>
                <label>
                  <span>GST Slab</span>
                  <select value={draft.gstPct} onChange={(event) => updateDraft('gstPct', event.target.value)}>
                    {gstRates.map((rate) => <option key={rate} value={rate}>{`GST ${rate}%`}</option>)}
                  </select>
                  <small>CGST + SGST: {draft.igst ? '0% + 0%' : `${asNumber(draft.gstPct) / 2}% + ${asNumber(draft.gstPct) / 2}%`} · IGST: {draft.igst ? `${draft.gstPct}%` : '0%'}</small>
                </label>
                <label className="customer-po-igst">
                  <input type="checkbox" checked={draft.igst} onChange={(event) => updateDraft('igst', event.target.checked)} />
                  IGST
                </label>
              </div>
              <div className="customer-po-totals" aria-live="polite">
                <div><span>Items Total</span><b>{money(totals.itemsTotal)}</b></div>
                <div><span>Taxable Amount</span><b>{money(totals.taxable)}</b></div>
                <div><span>Total Tax ({draft.gstPct}%)</span><b>{money(totals.tax)}</b></div>
                <div><span>Round Off</span><b>{money(totals.roundOff)}</b></div>
                <div className="customer-po-grand-total"><span>Grand Total</span><b>{money(totals.grandTotal)}</b></div>
              </div>
            </div>

            <div className="customer-po-terms-fields">
              <label>
                <span>Payment Terms</span>
                <input value={draft.paymentTerms} onChange={(event) => updateDraft('paymentTerms', event.target.value)} placeholder="e.g. 30 days from invoice" />
              </label>
              <label>
                <span>Order Acceptance — Terms &amp; Conditions</span>
                <textarea value={draft.terms} onChange={(event) => updateDraft('terms', event.target.value)} rows="4" placeholder="Enter one term per line..." />
                <small>Enter one term per line. Terms are saved with this PO.</small>
              </label>
            </div>

            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn">Create PO</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
