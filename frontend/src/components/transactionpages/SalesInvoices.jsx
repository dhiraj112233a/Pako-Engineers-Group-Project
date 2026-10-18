import React, { useEffect, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, INV_KEY, CUST_KEY, fmtDate, today, nextInvNo } from '../../store/erpstore';

const newDraft = () => ({
  customer: '',
  date: today(),
  basic: '',
  gstPct: '18',
  notes: '',
  status: 'Billed',
});

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SalesInvoices() {
  const [rows, setRows] = useStore(INV_KEY, []);
  const [customers] = useStore(CUST_KEY, []);
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(newDraft);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
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

  const save = (event) => {
    event.preventDefault();

    if (!draft.customer.trim()) {
      setError('Customer is required.');
      return;
    }
    if (!draft.date) {
      setError('Invoice date is required.');
      return;
    }
    const basic = Number(draft.basic);
    const gstPct = Number(draft.gstPct);
    if (!Number.isFinite(basic) || basic < 0) {
      setError('Basic value must be zero or more.');
      return;
    }
    if (!Number.isFinite(gstPct) || gstPct < 0 || gstPct > 100) {
      setError('GST percentage must be between 0 and 100.');
      return;
    }

    const tax = basic * gstPct / 100;
    const amount = basic + tax;

    setRows((list) => [{
      id: Date.now(),
      invNo: nextInvNo(list),
      customer: draft.customer.trim().toUpperCase(),
      date: draft.date,
      basic,
      gstPct,
      tax,
      amount,
      status: draft.status,
      notes: draft.notes.trim(),
    }, ...list]);
    setShow(false);
  };

  const remove = (row) => {
    if (window.confirm(`Delete ${row.invNo}?`)) {
      setRows((list) => list.filter((item) => item.id !== row.id));
    }
  };

  const columns = [
    { key: 'invNo', label: 'Invoice No', render: (row) => <b>{row.invNo}</b> },
    { key: 'date', label: 'Date', render: (row) => fmtDate(row.date) },
    { key: 'customer', label: 'Customer' },
    { key: 'basic', label: 'Basic', render: (row) => money(row.basic), num: true },
    { key: 'gstPct', label: 'GST %', render: (row) => `${Number(row.gstPct || 0).toFixed(2)}%`, num: true },
    { key: 'amount', label: 'Amount', render: (row) => money(row.amount), num: true },
    { key: 'status', label: 'Status', render: (row) => <span className="erp-pill">{row.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (row) => <button className="erp-link-btn" onClick={() => remove(row)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Sales Invoices"
        icon="fa-file-invoice"
        subtitle="Track customer invoices and their basic and GST values in one place."
        action="New Invoice"
        onAction={openForm}
        stats={[
          { label: 'Total invoices', value: rows.length },
          { label: 'Billed', value: rows.filter((row) => row.status === 'Billed').length, tone: 'blue' },
          { label: 'Basic value', value: money(rows.reduce((sum, row) => sum + Number(row.basic || 0), 0)) },
          { label: 'Tax', value: money(rows.reduce((sum, row) => sum + Number(row.tax || 0), 0)), tone: 'red' },
        ]}
        columns={columns}
        rows={rows}
        filters={[{ key: 'status', all: 'All statuses', options: ['Billed', 'Draft', 'Paid'] }]}
        empty="No invoices yet — click + New Invoice"
      />

      {show && (
        <div className="erp-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>New Sales Invoice</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            <div className="erp-form-grid">
              <label>
                <span>Customer *</span>
                {customers.length ? (
                  <select autoFocus value={draft.customer} onChange={(event) => updateDraft('customer', event.target.value)} required>
                    <option value="">Select customer...</option>
                    {customers.map((customer) => <option key={customer.id} value={customer.name}>{customer.name}</option>)}
                  </select>
                ) : (
                  <input autoFocus value={draft.customer} onChange={(event) => updateDraft('customer', event.target.value)} placeholder="Type customer name" required />
                )}
              </label>

              <label>
                <span>Invoice Date *</span>
                <input type="date" value={draft.date} onChange={(event) => updateDraft('date', event.target.value)} required />
              </label>

              <label>
                <span>Basic Amount *</span>
                <input type="number" min="0" step="0.01" value={draft.basic} onChange={(event) => updateDraft('basic', event.target.value)} placeholder="0.00" required />
              </label>

              <label>
                <span>GST %</span>
                <input type="number" min="0" max="100" step="0.01" value={draft.gstPct} onChange={(event) => updateDraft('gstPct', event.target.value)} />
              </label>

              <label className="full">
                <span>Status</span>
                <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)}>
                  {['Draft', 'Billed', 'Paid'].map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>

              <label className="full">
                <span>Notes</span>
                <textarea value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} rows="3" placeholder="Internal notes or remarks" />
              </label>
            </div>

            {error && <div className="erp-error">{error}</div>}

            <div className="erp-modal-actions">
              <button type="button" className="erp-btn secondary" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn">Save Invoice</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
