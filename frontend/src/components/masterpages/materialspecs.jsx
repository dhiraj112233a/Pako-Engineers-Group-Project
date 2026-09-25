import React from 'react';

const specs = [
  { id: 'SP-101', name: 'Spec-42CRMO', version: 'v1.8', status: 'Approved', lastUpdated: '2026-09-15' },
  { id: 'SP-102', name: 'Spec-BRASS-20', version: 'v2.1', status: 'Draft', lastUpdated: '2026-09-10' },
  { id: 'SP-103', name: 'Spec-OIL-SYN', version: 'v1.4', status: 'Approved', lastUpdated: '2026-09-08' },
  { id: 'SP-104', name: 'Spec-CARBON-A3', version: 'v3.0', status: 'Review', lastUpdated: '2026-09-18' }
];

const MaterialSpecs = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Material Specs</h2>
        </div>
        <button style={{ border: 'none', background: '#0ea5e9', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + New Spec
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Specification Library</h3>
          <input type="text" placeholder="Search spec" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f0f9ff' }}>
            <tr>
              {['Spec ID', 'Spec Name', 'Version', 'Status', 'Last Updated'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{spec.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{spec.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{spec.version}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: spec.status === 'Approved' ? '#dcfce7' : spec.status === 'Review' ? '#fef3c7' : '#f3f4f6', color: spec.status === 'Approved' ? '#166534' : spec.status === 'Review' ? '#92400e' : '#374151' }}>{spec.status}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{spec.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default MaterialSpecs;
