import React, { useMemo, useState } from 'react';
import { useStore, CPO_KEY, DISPATCH_KEY, fmtDate, today } from '../../store/erpstore';
import '../../styles/pendingList.css';

const safeDate = (date) => (date ? fmtDate(date) : '—');
const quantityText = (qty, unit) => `${qty} ${unit || 'NOS'}`;
const cleanPdfText = (value) => String(value ?? '—')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^\x20-\x7E]/g, ' ')
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');
const pdfCell = (value, width) => {
  const text = cleanPdfText(value).replace(/\s+/g, ' ').trim();
  return text.length > width ? `${text.slice(0, width - 3)}...` : text;
};

function buildPendingPdf(rows, summary) {
  const pageSize = 34;
  const chunks = [];
  for (let index = 0; index < rows.length; index += pageSize) {
    chunks.push(rows.slice(index, index + pageSize));
  }
  if (!chunks.length) chunks.push([]);

  const pageIds = chunks.map((_, index) => 5 + index * 2);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ];

  chunks.forEach((pageRows, pageIndex) => {
    const pageId = pageIds[pageIndex];
    const contentId = pageId + 1;
    const commands = [];
    const text = (value, x, y, size = 8, font = 'F1') => {
      commands.push(`BT /${font} ${size} Tf ${x} ${y} Td (${cleanPdfText(value)}) Tj ET`);
    };
    commands.push('0.12 0.30 0.60 rg');
    text('PENDING CUSTOMER ORDERS', 32, 565, 16, 'F2');
    commands.push('0 0 0 rg');
    text(`Generated: ${safeDate(today())}`, 32, 548, 9);
    text(`Open orders: ${summary.orders}   Pending lines: ${summary.lines}   Pending qty: ${summary.qty}   Pending PO value: INR ${summary.value.toFixed(2)}`, 32, 532, 9);

    const headers = [
      ['#', 32], ['CUSTOMER', 54], ['PO NO.', 184], ['PO DATE', 254], ['DA NO.', 314],
      ['DRAWING NO.', 382], ['MATERIAL', 510], ['QTY', 625], ['DELIVERY', 680], ['STATUS', 745],
    ];
    commands.push('0.90 0.94 0.98 rg 30 508 782 16 re f');
    commands.push('0 0 0 rg');
    headers.forEach(([label, x]) => text(label, x, 513, 7, 'F2'));

    let y = 496;
    pageRows.forEach((row, rowIndex) => {
      const values = [
        [String(pageIndex * pageSize + rowIndex + 1), 32, 3],
        [pdfCell(row.customer, 23), 54, 7],
        [pdfCell(row.poNo, 12), 184, 7],
        [pdfCell(safeDate(row.poDate), 10), 254, 7],
        [pdfCell(row.challanNo || '—', 11), 314, 7],
        [pdfCell(row.drawing, 21), 382, 7],
        [pdfCell(row.material, 18), 510, 7],
        [pdfCell(quantityText(row.pendingQty, row.unit), 11), 625, 7],
        [pdfCell(safeDate(row.deliveryDate), 10), 680, 7],
        [pdfCell(row.status, 10), 745, 7],
      ];
      values.forEach(([value, x, size]) => text(value, x, y, size));
      commands.push('0.86 0.89 0.92 RG 30 ' + (y - 5) + ' m 812 ' + (y - 5) + ' l S');
      y -= 13;
    });

    if (!pageRows.length) text('No pending items found.', 32, 490, 10);
    text(`Page ${pageIndex + 1} of ${chunks.length}`, 755, 22, 8);
    const stream = commands.join('\n');
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`);
  });

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

export default function PendingList() {
  const [customerOrders] = useStore(CPO_KEY, []);
  const [challans] = useStore(DISPATCH_KEY, []);
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  const pendingRows = useMemo(() => {
    const dispatched = new Map();
    challans.forEach((challan) => {
      (challan.lines || []).forEach((line) => {
        const key = `${challan.customerPoId}:${line.customerPoLineId}`;
        const entry = dispatched.get(key) || { qty: 0, challanNo: '' };
        entry.qty += Number(line.qty) || 0;
        if (!entry.challanNo) entry.challanNo = challan.challanNo || '';
        dispatched.set(key, entry);
      });
    });

    return customerOrders
      .filter((order) => order.status === 'Received')
      .flatMap((order) => (order.lines || []).map((line) => {
        const deliveryDate = line.deliveryDate || order.requiredBy || '';
        const shipped = dispatched.get(`${order.id}:${line.id}`) || { qty: 0, challanNo: '' };
        const pendingQty = Math.max(0, Number(line.qty) - shipped.qty);
        if (!pendingQty) return null;
        return {
          id: `${order.id}-${line.id}`,
          customer: order.customer,
          poNo: order.poNo,
          poDate: order.poDate,
          challanNo: shipped.challanNo,
          drawing: line.drawing || '—',
          material: line.material || '—',
          pendingQty,
          unit: line.unit || 'NOS',
          deliveryDate,
          status: deliveryDate && deliveryDate < today() ? 'Overdue' : shipped.qty ? 'Partial' : 'Pending',
          orderTotal: Number(order.grandTotal) || 0,
        };
      }))
      .filter(Boolean);
  }, [customerOrders, challans]);

  const customers = [...new Set(pendingRows.map((row) => row.customer).filter(Boolean))].sort();
  const rows = pendingRows.filter((row) => (
    (!customerFilter || row.customer === customerFilter) &&
    (!search || [
      row.customer, row.poNo, row.challanNo, row.drawing, row.material, row.status,
    ].join(' ').toLowerCase().includes(search.toLowerCase()))
  ));
  const pendingOrderIds = new Set(rows.map((row) => row.poNo));
  const summary = {
    orders: pendingOrderIds.size,
    lines: rows.length,
    qty: rows.reduce((sum, row) => sum + row.pendingQty, 0),
    value: [...new Map(rows.map((row) => [row.poNo, row.orderTotal])).values()].reduce((sum, value) => sum + value, 0),
  };

  const downloadPdf = () => {
    const blob = buildPendingPdf(rows, summary);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'pending-list.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="erp-page pending-list-page">
      <div className="erp-head">
        <div>
          <h1><i className="fas fa-clock"></i>Pending List</h1>
          <p>Open customer orders — not yet delivered / completed.</p>
        </div>
        <button className="pending-pdf-button" onClick={downloadPdf} aria-label="Download pending list as PDF">
          <i className="fas fa-file-pdf"></i> PDF
        </button>
      </div>

      <div className="erp-grid pending-list-stats">
        <div className="erp-card blue"><small>Open Orders</small><b>{summary.orders}</b></div>
        <div className="erp-card"><small>Pending Lines</small><b>{summary.lines}</b></div>
        <div className="erp-card pending-green"><small>Pending Qty</small><b>{summary.qty.toLocaleString('en-IN')}</b></div>
        <div className="erp-card pending-purple"><small>Pending PO Value</small><b>₹{summary.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></div>
      </div>

      <div className="erp-tools pending-list-tools">
        <input type="text" placeholder="Search customer / PO / drawing / item..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)}>
          <option value="">All customers</option>
          {customers.map((customer) => <option key={customer}>{customer}</option>)}
        </select>
        {(search || customerFilter) && <button className="erp-link-btn" onClick={() => { setSearch(''); setCustomerFilter(''); }}>Clear filters</button>}
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table pending-list-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>PO No.</th>
              <th>PO Date</th>
              <th>DA No.</th>
              <th>Drawing No.</th>
              <th>Material</th>
              <th className="num">Qty</th>
              <th>Delivery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr><td className="erp-empty" colSpan="10">{search || customerFilter ? 'No pending items match your filters' : 'No pending customer orders'}</td></tr>
            ) : rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td><b>{row.customer}</b></td>
                <td>{row.poNo}</td>
                <td>{safeDate(row.poDate)}</td>
                <td>{row.challanNo || '—'}</td>
                <td>{row.drawing}</td>
                <td>{row.material}</td>
                <td className="num">{quantityText(row.pendingQty, row.unit)}</td>
                <td>{safeDate(row.deliveryDate)}</td>
                <td><span className={`erp-pill ${row.status === 'Overdue' ? 'bad' : row.status === 'Partial' ? 'warn' : ''}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="erp-count">
        <span>Showing {rows.length} of {pendingRows.length} pending lines</span>
        <span>Pending PO value: ₹{summary.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <p className="erp-foot">© 2026, Pako Engineers — All Rights Reserved · v1.0.0</p>
    </div>
  );
}
