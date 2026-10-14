import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, CPO_KEY } from '../../store/erpstore';
import '../../styles/purchaseList.css';

const materialType = (order) => order.poType || 'Material';

export default function PurchaseList() {
  const [customerOrders] = useStore(CPO_KEY, []);
  const [view, setView] = useState('material');
  const [customerFilter, setCustomerFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const acceptedOrders = customerOrders.filter((order) => order.status === 'Received');
  const customers = [...new Set(acceptedOrders.map((order) => order.customer).filter(Boolean))].sort();
  const types = [...new Set(acceptedOrders.map(materialType))].sort();

  const lines = acceptedOrders.flatMap((order) => (order.lines || []).map((line) => ({
    id: `${order.id}-${line.id}`,
    orderId: order.id,
    poNo: order.poNo,
    customer: order.customer,
    type: materialType(order),
    material: line.material || line.drawing || 'Unspecified material',
    make: line.make || '—',
    shapeSize: line.shapeSize || line.description || '—',
    hsn: line.hsn || '—',
    qty: Number(line.qty) || 0,
    unit: line.unit || 'NOS',
    drawing: line.drawing || '—',
  })));

  const filteredLines = lines.filter((line) => (
    (!customerFilter || line.customer === customerFilter) &&
    (!typeFilter || line.type === typeFilter) &&
    (!search || [
      line.material, line.make, line.shapeSize, line.hsn, line.poNo, line.customer, line.drawing,
    ].join(' ').toLowerCase().includes(search.toLowerCase()))
  ));

  const grouped = new Map();
  filteredLines.forEach((line) => {
    const key = [line.type, line.material.toLowerCase(), line.make.toLowerCase(), line.shapeSize.toLowerCase(), line.hsn, line.unit].join('|');
    const group = grouped.get(key) || {
      id: key,
      type: line.type,
      material: line.material,
      make: line.make,
      shapeSize: line.shapeSize,
      hsn: line.hsn,
      qty: 0,
      unit: line.unit,
      orders: new Set(),
    };
    group.qty += line.qty;
    group.orders.add(line.poNo);
    grouped.set(key, group);
  });
  const materialRows = [...grouped.values()].map((group) => ({
    ...group,
    orderCount: group.orders.size,
    orderRefs: [...group.orders].join(', '),
  }));
  const orderRows = filteredLines;
  const rows = view === 'material' ? materialRows : orderRows;
  const totalQty = rows.reduce((sum, row) => sum + row.qty, 0);
  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'material', label: 'Material / Group', render: (row) => <b>{row.material}</b> },
    { key: 'make', label: 'Make' },
    { key: 'shapeSize', label: 'Shape / Size' },
    { key: 'hsn', label: 'HSN' },
    { key: 'orders', label: 'Orders', render: (row) => view === 'material' ? `${row.orderCount} · ${row.orderRefs}` : row.poNo },
    { key: 'qty', label: 'Required Qty', num: true },
    { key: 'unit', label: 'Unit' },
  ];

  return (
    <div className="erp-page purchase-list-page">
      <div className="erp-head">
        <div>
          <h1><i className="fas fa-cart-shopping"></i>Purchase List</h1>
          <p>Material &amp; material-group requirements from accepted customer orders.</p>
        </div>
        <button className="erp-btn" onClick={() => navigate('/vendor-po')}>Create Vendor PO</button>
      </div>

      <div className="erp-grid purchase-list-stats">
        <div className="erp-card blue"><small>Accepted Orders</small><b>{new Set(filteredLines.map((line) => line.poNo)).size}</b></div>
        <div className="erp-card"><small>Materials / Groups</small><b>{materialRows.length}</b></div>
        <div className="erp-card"><small>Requirement Lines</small><b>{filteredLines.length}</b></div>
      </div>

      <div className="erp-tools purchase-list-tools">
        <input type="text" placeholder="Search material / group / drawing / PO..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)}>
          <option value="">All customers</option>
          {customers.map((customer) => <option key={customer}>{customer}</option>)}
        </select>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="">All material types</option>
          {types.map((type) => <option key={type}>{type}</option>)}
        </select>
        <div className="purchase-list-view-toggle" role="group" aria-label="Purchase list view">
          <button type="button" className={view === 'material' ? 'active' : ''} aria-pressed={view === 'material'} onClick={() => setView('material')}>By Material</button>
          <button type="button" className={view === 'line' ? 'active' : ''} aria-pressed={view === 'line'} onClick={() => setView('line')}>By Line</button>
        </div>
      </div>

      <div className="erp-table-wrap">
        <table className="erp-table purchase-list-table">
          <thead>
            <tr>{columns.map((column) => <th key={column.key} className={column.num ? 'num' : ''}>{column.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="erp-empty" colSpan={columns.length}>{search || customerFilter || typeFilter ? 'No material requirements match your filters' : 'No material requirement found from accepted orders'}</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} className={column.num ? 'num' : ''}>
                    {column.render ? column.render(row) : row[column.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="erp-count">
        <span>Showing {rows.length} of {view === 'material' ? materialRows.length : lines.length}</span>
        <span>Total required quantity: {totalQty.toLocaleString('en-IN')}</span>
      </div>
      <p className="erp-foot">© 2026, Pako Engineers — All Rights Reserved · v1.0.0</p>
    </div>
  );
}
