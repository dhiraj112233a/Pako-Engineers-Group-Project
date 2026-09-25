import React from 'react';

const materials = [
  { id: 'M-010', name: 'Alloy Steel 42CrMo4', type: 'Metal', stock: '360 kg', value: '₹9.5K' },
  { id: 'M-011', name: 'Brass Rod 20mm', type: 'Metal', stock: '140 kg', value: '₹6.7K' },
  { id: 'M-012', name: 'Synthetic Oil', type: 'Chemical', stock: '180 L', value: '₹3.2K' },
  { id: 'M-013', name: 'Carbon Fiber Sheet', type: 'Composite', stock: '52 pcs', value: '₹11.1K' }
];

const Materials = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Materials</h2>
        </div>
        <button style={{ border: 'none', background: '#7c3aed', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Material
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[['Total Materials', '638'], ['Approved', '504'], ['Expiring Soon', '29'], ['Stock Value', '₹36.8L']].map(([label, value]) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', padding: '1rem 1.1rem' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Material Register</h3>
          <input type="text" placeholder="Search material" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f5f3ff' }}>
            <tr>
              {['Material ID', 'Material Name', 'Type', 'Stock', 'Value'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{material.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{material.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{material.type}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{material.stock}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 700 }}>{material.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Materials;
