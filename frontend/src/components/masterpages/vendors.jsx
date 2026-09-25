import React from 'react';

const vendors = [
  { id: 'V-201', name: 'SteelCore Supply', contact: 'Prakash Rao', status: 'Active', value: '₹5.8L' },
  { id: 'V-202', name: 'Precision Forge', contact: 'Asha Jain', status: 'Pending', value: '₹3.4L' },
  { id: 'V-203', name: 'Northline Metals', contact: 'Karan Shah', status: 'Active', value: '₹6.1L' },
  { id: 'V-204', name: 'Orbit Components', contact: 'Meera Nair', status: 'Inactive', value: '₹1.2L' }
];

const Vendors = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Vendors</h2>
        </div>
        <button style={{ border: 'none', background: '#0f766e', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Vendor
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[['Total Vendors', '192'], ['Active', '146'], ['Pending', '21'], ['Annual Spend', '₹42.3L']].map(([label, value]) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', padding: '1rem 1.1rem' }}>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Vendor List</h3>
          <input type="text" placeholder="Search vendor" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#ecfeff' }}>
            <tr>
              {['Vendor ID', 'Vendor Name', 'Contact Person', 'Status', 'Value'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{vendor.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{vendor.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{vendor.contact}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: vendor.status === 'Active' ? '#dcfce7' : vendor.status === 'Pending' ? '#fef3c7' : '#f3f4f6', color: vendor.status === 'Active' ? '#166534' : vendor.status === 'Pending' ? '#92400e' : '#374151' }}>{vendor.status}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 700 }}>{vendor.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Vendors;
