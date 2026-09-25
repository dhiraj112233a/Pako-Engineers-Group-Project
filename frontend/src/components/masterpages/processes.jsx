import React from 'react';

const processes = [
  { id: 'PR-001', name: 'CNC Milling', dept: 'Production', owner: 'Shop Floor', status: 'Active' },
  { id: 'PR-002', name: 'Heat Treatment', dept: 'Thermal', owner: 'QA', status: 'Active' },
  { id: 'PR-003', name: 'Inspection', dept: 'Quality', owner: 'QC', status: 'Review' },
  { id: 'PR-004', name: 'Coating', dept: 'Surface', owner: 'Plant 2', status: 'Active' }
];

const Processes = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Processes</h2>
        </div>
        <button style={{ border: 'none', background: '#14b8a6', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Process
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Process Registry</h3>
          <input type="text" placeholder="Search process" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#ecfeff' }}>
            <tr>
              {['Process ID', 'Process Name', 'Department', 'Owner', 'Status'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{process.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{process.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{process.dept}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{process.owner}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: process.status === 'Active' ? '#dcfce7' : '#fef3c7', color: process.status === 'Active' ? '#166534' : '#92400e' }}>{process.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Processes;
