import React, { useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import ErpModal from '../ErpModal';
import { useStore, INV_KEY, CUST_KEY, fmtDate, today, nextInvNo } from '../../store/erpstore';

const inr = (n) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function SalesInvoices() {
  const [rows, setRows] = useStore(INV_KEY, []);
  const [customers] = useStore(CUST_KEY, []);
  const [show, setShow] = useState(false);

  // Pick from the Customer master when it has entries, otherwise type the name.
  const customerField = customers.length
    ? { key: 'customer', label: 'Customer', options: customers.map((c) => c.name), default: customers[0].name, wide: true }
    : { key: 'customer', label: 'Customer', required: true, wide: true, placeholder: 'Type customer name (or add customers in Master → Customers)' };

  const fields = [
    customerField,
    { key: 'date', label: 'Invoice date', type: 'date', required: true, default: today() },
    { key: 'basic', label: 'Basic amount (₹)', type: 'number', required: true },
    { key: 'gstPct', label: 'GST %', options: ['0', '5', '12', '18', '28'], default: '18' },
  ];

  const save = (v) => {
    const basic = Number(v.basic);
    if (!(basic > 0)) return 'Basic amount must be greater than 0';
    setRows((list) => [
      { id: Date.now(), invNo: nextInvNo(list), customer: v.customer.trim().toUpperCase(), date: v.date, basic, gstPct: Number(v.gstPct) },
      ...list,
    ]);
    setShow(false);
  };
  const remove = (r) => window.confirm(`Delete ${r.invNo}?`) && setRows((l) => l.filter((i) => i.id !== r.id));

  const data = rows.map((r) => ({ ...r, gst: (r.basic * r.gstPct) / 100, total: r.basic * (1 + r.gstPct / 100) }));
  const sum = (k) => data.reduce((s, r) => s + r[k], 0);

  const columns = [
    { key: 'invNo', label: 'Invoice No', render: (r) => <b>{r.invNo}</b> },
    { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) },
    { key: 'customer', label: 'Customer' },
    { key: 'basic', label: 'Basic', num: true, render: (r) => inr(r.basic) },
    { key: 'gstPct', label: 'GST %', num: true, render: (r) => `${r.gstPct}%` },
    { key: 'gst', label: 'GST', num: true, render: (r) => inr(r.gst) },
    { key: 'total', label: 'Total', num: true, render: (r) => <b>{inr(r.total)}</b> },
    { key: 'actions', label: '', sortable: false, render: (r) => <button className="erp-link-btn" style={{ color: '#b91c1c' }} onClick={() => remove(r)}>Delete</button> },
  ];

  return (
    <>
      <ErpTablePage
        title="Sales Invoices" icon="fa-file-invoice-dollar"
        subtitle="Every invoice you add here updates the Dashboard sales, GST, targets and customer-wise charts."
        action="New Invoice" onAction={() => setShow(true)}
        stats={[
          { label: 'Invoices', value: data.length },
          { label: 'Basic', value: inr(sum('basic')), tone: 'blue' },
          { label: 'GST', value: inr(sum('gst')) },
          { label: 'Total billed', value: inr(sum('total')) },
        ]}
        columns={columns} rows={data}
        empty="No invoices yet — click + New Invoice"
      />
      {show && <ErpModal title="New Sales Invoice" fields={fields} onSave={save} onClose={() => setShow(false)} submitLabel="Create" />}
    </>
  );
}