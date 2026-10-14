import React, { useEffect, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import { useStore, ENQ_KEY, CUST_KEY, fmtDate, today, nextEnqNo } from '../../store/erpstore';
import '../../styles/CustomerEnquiry.css';

const newItem = (id) => ({
  id,
  item: '',
  qty: '1',
  unit: 'NOS',
  description: '',
  targetPrice: '',
  requiredBy: '',
  remarks: '',
});

const newDraft = () => ({
  customer: '',
  contact: '',
  date: today(),
  reference: '',
  source: 'Email',
  priority: 'Medium',
  requiredBy: '',
  notes: '',
  items: [newItem(1)],
});

const priorityTone = { High: 'bad', Medium: 'warn', Low: 'good' };

export default function CustomerEnquiry() {
  const [rows, setRows] = useStore(ENQ_KEY, []);
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

  const openForm = () => {
    setDraft(newDraft());
    setError('');
    setShow(true);
  };

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const updateItem = (id, key, value) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, [key]: value } : item),
    }));
    setError('');
  };

  const addItem = () => {
    setDraft((current) => ({
      ...current,
      items: [...current.items, newItem(Math.max(0, ...current.items.map((item) => item.id)) + 1)],
    }));
  };

  const removeItem = (id) => {
    setDraft((current) => ({
      ...current,
      items: current.items.length > 1 ? current.items.filter((item) => item.id !== id) : current.items,
    }));
  };

  const save = (event) => {
    event.preventDefault();
    if (!draft.customer.trim()) {
      setError('Customer is required.');
      return;
    }
    if (!draft.date) {
      setError('Enquiry date is required.');
      return;
    }
    const invalidItem = draft.items.find((item) => (
      !item.item.trim() || !Number.isFinite(Number(item.qty)) || Number(item.qty) <= 0 ||
      (item.targetPrice !== '' && (!Number.isFinite(Number(item.targetPrice)) || Number(item.targetPrice) < 0))
    ));
    if (invalidItem) {
      setError('Each item needs an item name and a quantity greater than zero. Target price must be zero or more.');
      return;
    }

    setRows((list) => [{
      id: Date.now(),
      enquiryNo: nextEnqNo(list),
      customer: draft.customer.trim().toUpperCase(),
      contact: draft.contact.trim(),
      date: draft.date,
      reference: draft.reference.trim(),
      source: draft.source,
      priority: draft.priority,
      requiredBy: draft.requiredBy,
      notes: draft.notes.trim(),
      items: draft.items.map((item) => ({
        ...item,
        item: item.item.trim(),
        qty: Number(item.qty),
        targetPrice: item.targetPrice === '' ? '' : Number(item.targetPrice),
      })),
      status: 'Open',
    }, ...list]);
    setShow(false);
  };

  const remove = (row) => {
    if (window.confirm(`Delete ${row.enquiryNo}?`)) {
      setRows((list) => list.filter((item) => item.id !== row.id));
    }
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
  const contactSuggestions = [...new Set(customers.map((customer) => customer.contact).filter(Boolean))];

  const columns = [
    { key: 'enquiryNo', label: 'Enquiry No', render: (row) => <b>{row.enquiryNo}</b> },
    { key: 'date', label: 'Date', render: (row) => fmtDate(row.date) },
    { key: 'customer', label: 'Customer' },
    { key: 'items', label: 'Items', render: (row) => row.items.length },
    { key: 'requiredBy', label: 'Required By', render: (row) => fmtDate(row.requiredBy) },
    { key: 'priority', label: 'Priority', render: (row) => <span className={`erp-pill ${priorityTone[row.priority] || ''}`}>{row.priority}</span> },
    { key: 'status', label: 'Status', render: (row) => <span className="erp-pill">{row.status}</span> },
    { key: 'actions', label: '', sortable: false, render: (row) => <button className="erp-link-btn enquiry-delete" onClick={() => remove(row)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Customer Enquiry" icon="fa-file-invoice"
        subtitle="Capture customer requirements and track each enquiry from the first request."
        action="New Enquiry" onAction={openForm}
        stats={[
          { label: 'Total enquiries', value: rows.length },
          { label: 'Open', value: rows.filter((row) => row.status === 'Open').length, tone: 'blue' },
          { label: 'Quoted', value: rows.filter((row) => row.status === 'Quoted').length },
          { label: 'High priority', value: rows.filter((row) => row.priority === 'High').length, tone: 'red' },
        ]}
        columns={columns} rows={rows}
        filters={[{ key: 'status', all: 'All statuses', options: ['Open', 'Quoted', 'Closed'] }]}
        empty="No enquiries yet — click + New Enquiry"
      />

      {show && (
        <div className="erp-overlay enquiry-overlay" onMouseDown={(event) => event.target === event.currentTarget && setShow(false)}>
          <form className="erp-modal enquiry-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>New Customer Enquiry</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setShow(false)}>×</button>
            </div>

            <div className="enquiry-fields">
              <label>
                <span>Customer *</span>
                {customers.length ? (
                  <select autoFocus value={draft.customer} onChange={(event) => customerChange(event.target.value)} required>
                    <option value="">Select customer...</option>
                    {customers.map((customer) => <option key={customer.id} value={customer.name}>{customer.name}</option>)}
                  </select>
                ) : (
                  <input autoFocus value={draft.customer} onChange={(event) => customerChange(event.target.value)} placeholder="Type customer name" required />
                )}
              </label>
              <label>
                <span>Contact Person</span>
                <input list="enquiry-contacts" value={draft.contact} onChange={(event) => updateDraft('contact', event.target.value)} placeholder="Contact person" />
                <datalist id="enquiry-contacts">
                  {contactSuggestions.map((contact) => <option key={contact} value={contact} />)}
                </datalist>
              </label>
              <label>
                <span>Enquiry Date *</span>
                <input type="date" value={draft.date} onChange={(event) => updateDraft('date', event.target.value)} required />
              </label>
              <label>
                <span>Reference No.</span>
                <input value={draft.reference} onChange={(event) => updateDraft('reference', event.target.value)} placeholder="Customer ref / RFQ no." />
              </label>
              <label>
                <span>Source</span>
                <select value={draft.source} onChange={(event) => updateDraft('source', event.target.value)}>
                  {['Email', 'Phone', 'Website', 'Referral', 'Other'].map((source) => <option key={source}>{source}</option>)}
                </select>
              </label>
              <label>
                <span>Priority</span>
                <select value={draft.priority} onChange={(event) => updateDraft('priority', event.target.value)}>
                  {['Low', 'Medium', 'High'].map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </label>
              <label>
                <span>Required By</span>
                <input type="date" value={draft.requiredBy} onChange={(event) => updateDraft('requiredBy', event.target.value)} />
              </label>
            </div>

            <section className="enquiry-items-section">
              <div className="enquiry-section-heading">
                <h4>Enquiry Items ({draft.items.length})</h4>
                <button type="button" className="erp-link-btn" onClick={addItem}>+ Add Line</button>
              </div>
              {draft.items.map((item, index) => (
                <div className="enquiry-item-card" key={item.id}>
                  <div className="enquiry-item-heading">
                    <strong>#{index + 1}</strong>
                    <span>{item.item || 'No item selected'}</span>
                    {draft.items.length > 1 && <button type="button" className="enquiry-remove-line" onClick={() => removeItem(item.id)}>Remove</button>}
                  </div>
                  <div className="enquiry-item-fields">
                    <label className="enquiry-item-name">
                      <span>Item / Drawing No. *</span>
                      <input value={item.item} onChange={(event) => updateItem(item.id, 'item', event.target.value)} placeholder="Search master or type new..." required />
                    </label>
                    <label>
                      <span>Qty *</span>
                      <input type="number" min="0.01" step="any" value={item.qty} onChange={(event) => updateItem(item.id, 'qty', event.target.value)} required />
                    </label>
                    <label>
                      <span>Unit</span>
                      <select value={item.unit} onChange={(event) => updateItem(item.id, 'unit', event.target.value)}>
                        {['NOS', 'SET', 'KG', 'MTR', 'LOT'].map((unit) => <option key={unit}>{unit}</option>)}
                      </select>
                    </label>
                    <label className="enquiry-item-description">
                      <span>Description</span>
                      <input value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} />
                    </label>
                    <label>
                      <span>Target Price</span>
                      <input type="number" min="0" step="any" value={item.targetPrice} onChange={(event) => updateItem(item.id, 'targetPrice', event.target.value)} placeholder="Optional" />
                    </label>
                    <label>
                      <span>Required By</span>
                      <input type="date" value={item.requiredBy} onChange={(event) => updateItem(item.id, 'requiredBy', event.target.value)} />
                    </label>
                    <label className="enquiry-item-remarks">
                      <span>Remarks</span>
                      <input value={item.remarks} onChange={(event) => updateItem(item.id, 'remarks', event.target.value)} />
                    </label>
                  </div>
                </div>
              ))}
            </section>

            <label className="enquiry-notes">
              <span>Notes</span>
              <textarea value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} placeholder="Any additional context for this enquiry..." rows="3" />
            </label>

            {error && <p className="erp-err">{error}</p>}

            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setShow(false)}>Cancel</button>
              <button type="submit" className="erp-btn">Create Enquiry</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
