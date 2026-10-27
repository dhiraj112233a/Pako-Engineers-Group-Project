import { useMemo, useState } from 'react';
import ErpTablePage from './ErpTablePage';
import { useStore, INV_KEY, fyLabel, fyOf, fyIndex, today } from '../store/erpstore';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;
const invoiceTax = (invoice) => Number(invoice.tax ?? (
  Number(invoice.basic || 0) * Number(invoice.gstPct || 0) / 100
));
const invoiceTotal = (invoice) => Number(invoice.amount ?? (
  Number(invoice.basic || 0) + invoiceTax(invoice)
));

export default function Reports({ type }) {
  const [invoices] = useStore(INV_KEY, []);
  const currentYear = fyOf(today());
  const years = [...new Set([
    currentYear,
    ...invoices
      .filter((invoice) => /^\d{4}-\d{2}-\d{2}$/.test(invoice.date || ''))
      .map((invoice) => fyOf(invoice.date)),
  ])].sort((a, b) => b - a);
  const [financialYear, setFinancialYear] = useState(currentYear);
  const isGstReport = type === 'gst';

  const yearInvoices = useMemo(() => invoices.filter((invoice) => (
    /^\d{4}-\d{2}-\d{2}$/.test(invoice.date || '') &&
    fyOf(invoice.date) === financialYear
  )), [financialYear, invoices]);

  const monthlyRows = useMemo(() => MONTHS.map((month, index) => {
    const monthInvoices = yearInvoices.filter((invoice) => fyIndex(invoice.date) === index);
    const taxable = monthInvoices.reduce((sum, invoice) => sum + Number(invoice.basic || 0), 0);
    const tax = monthInvoices.reduce((sum, invoice) => sum + invoiceTax(invoice), 0);
    return {
      id: month,
      month,
      invoices: monthInvoices.length,
      taxable,
      tax,
      total: monthInvoices.reduce((sum, invoice) => sum + invoiceTotal(invoice), 0),
    };
  }), [yearInvoices]);

  const reportRows = isGstReport
    ? yearInvoices.map((invoice, index) => ({
      ...invoice,
      id: invoice.id ?? `${invoice.invNo ?? invoice.date}-${index}`,
      invoiceNumber: invoice.invNo || '—',
      taxRate: `${Number(invoice.gstPct || 0).toFixed(2)}%`,
      taxable: Number(invoice.basic || 0),
      tax: invoiceTax(invoice),
      total: invoiceTotal(invoice),
    }))
    : monthlyRows;

  const totalTaxable = reportRows.reduce((sum, row) => sum + row.taxable, 0);
  const totalTax = reportRows.reduce((sum, row) => sum + row.tax, 0);
  const totalAmount = reportRows.reduce((sum, row) => sum + row.total, 0);
  const columns = isGstReport
    ? [
      { key: 'invoiceNumber', label: 'Invoice No.' },
      { key: 'date', label: 'Date' },
      { key: 'customer', label: 'Customer' },
      { key: 'taxable', label: 'Taxable Value', num: true, render: (row) => money(row.taxable) },
      { key: 'taxRate', label: 'GST Rate', num: true },
      { key: 'tax', label: 'GST Amount', num: true, render: (row) => money(row.tax) },
      { key: 'total', label: 'Invoice Total', num: true, render: (row) => money(row.total) },
      { key: 'status', label: 'Status' },
    ]
    : [
      { key: 'month', label: 'Month' },
      { key: 'invoices', label: 'Invoices', num: true },
      { key: 'taxable', label: 'Taxable Sales', num: true, render: (row) => money(row.taxable) },
      { key: 'tax', label: 'GST Collected', num: true, render: (row) => money(row.tax) },
      { key: 'total', label: 'Total Sales', num: true, render: (row) => money(row.total) },
    ];

  return (
    <>
      <ErpTablePage
        title={isGstReport ? 'GST Report' : 'Sales Report'}
        icon={isGstReport ? 'fa-file-invoice-dollar' : 'fa-chart-line'}
        subtitle={isGstReport
          ? 'Review invoice-level taxable values and GST amounts for the selected financial year.'
          : 'Review monthly sales, invoice counts, and GST totals for the selected financial year.'}
        controls={(
          <label className="erp-report-year">
            <span>Financial year</span>
            <select
              aria-label="Report financial year"
              value={financialYear}
              onChange={(event) => setFinancialYear(Number(event.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>FY {fyLabel(year)}</option>
              ))}
            </select>
          </label>
        )}
        stats={[
          { label: 'Financial year', value: `FY ${fyLabel(financialYear)}`, tone: 'blue' },
          { label: 'Invoices', value: isGstReport ? reportRows.length : yearInvoices.length },
          { label: isGstReport ? 'Taxable value' : 'Taxable sales', value: money(totalTaxable) },
          { label: 'GST amount', value: money(totalTax) },
          { label: isGstReport ? 'Invoice total' : 'Total sales', value: money(totalAmount) },
        ]}
        columns={columns}
        rows={reportRows}
        empty={isGstReport
          ? `No invoices recorded for FY ${fyLabel(financialYear)}`
          : `No sales recorded for FY ${fyLabel(financialYear)}`}
      />
    </>
  );
}
