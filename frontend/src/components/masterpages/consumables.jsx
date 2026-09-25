import React from 'react';

const consumables = [
  { id: 'CS-001', name: 'Cutting Oil', category: 'Lubricant', stock: '180 L', status: 'Available' },
  { id: 'CS-002', name: 'Coolant Mix', category: 'Coolant', stock: '96 L', status: 'Low' },
  { id: 'CS-003', name: 'Safety Gloves', category: 'Safety', stock: '52 pairs', status: 'Available' },
  { id: 'CS-004', name: 'Cleaning Wipes', category: 'Maintenance', stock: '30 packs', status: 'Review' }
];

const Consumables = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Consumables</h2>
        </div>
        <button style={{ border: 'none', background: '#0f766e', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Consumable
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Stock Register</h3>
          <input type="text" placeholder="Search consumable" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#ecfeff' }}>
            <tr>
              {['Consumable ID', 'Name', 'Category', 'Stock', 'Status'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {consumables.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{item.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{item.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.category}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{item.stock}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: item.status === 'Available' ? '#dcfce7' : item.status === 'Low' ? '#fef3c7' : '#f3f4f6', color: item.status === 'Available' ? '#166534' : item.status === 'Low' ? '#92400e' : '#374151' }}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Consumables;
