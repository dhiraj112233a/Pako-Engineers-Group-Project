import React from 'react';

const groups = [
  { id: 'MG-001', name: 'Ferrous Alloys', count: '18 items', owner: 'Engineering', status: 'Active' },
  { id: 'MG-002', name: 'Non-Ferrous', count: '12 items', owner: 'Procurement', status: 'Active' },
  { id: 'MG-003', name: 'Lubricants', count: '9 items', owner: 'QA', status: 'Review' },
  { id: 'MG-004', name: 'Composites', count: '7 items', owner: 'R&D', status: 'Active' }
];

const MaterialGroups = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Material Groups</h2>
        </div>
        <button style={{ border: 'none', background: '#2563eb', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + New Group
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Groups</h3>
          <input type="text" placeholder="Search group" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#eff6ff' }}>
            <tr>
              {['Group ID', 'Group Name', 'Items', 'Owner', 'Status'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{group.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{group.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{group.count}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{group.owner}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: group.status === 'Active' ? '#dcfce7' : '#fef3c7', color: group.status === 'Active' ? '#166534' : '#92400e' }}>{group.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default MaterialGroups;
