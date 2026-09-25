import React from 'react';

const items = [
  { id: 'IT-001', name: 'Precision Shaft 220', category: 'Machinery', stock: '142 pcs', value: '₹18.6K' },
  { id: 'IT-002', name: 'Bearing Set 310', category: 'Components', stock: '87 pcs', value: '₹9.2K' },
  { id: 'IT-003', name: 'Tool Holder A12', category: 'Tools', stock: '66 pcs', value: '₹12.4K' },
  { id: 'IT-004', name: 'Cutting Fluid X', category: 'Consumables', stock: '320 L', value: '₹7.8K' }
];

const Items = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Items</h2>
        </div>
        <button style={{ border: 'none', background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Item
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[['Total Items', '1,248'], ['In Stock', '946'], ['Low Stock', '142'], ['Inventory Value', '₹18.4L']].map(([label, value]) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', padding: '1rem 1.1rem' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Item Inventory</h3>
          <input type="text" placeholder="Search item" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#eff6ff' }}>
            <tr>
              {['Item ID', 'Item Name', 'Category', 'Stock', 'Value'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{item.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{item.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.category}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{item.stock}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 700 }}>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Items;
