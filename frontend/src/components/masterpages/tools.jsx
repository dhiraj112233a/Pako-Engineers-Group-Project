import React from 'react';

const tools = [
  { id: 'TL-101', name: 'End Mill 6mm', category: 'Cutting Tool', qty: '28 pcs', status: 'Active' },
  { id: 'TL-102', name: 'Drill Bit 8mm', category: 'Cutting Tool', qty: '43 pcs', status: 'Low' },
  { id: 'TL-103', name: 'Fixture Clamp', category: 'Holding', qty: '16 pcs', status: 'Active' },
  { id: 'TL-104', name: 'Gauge Block', category: 'Inspection', qty: '11 pcs', status: 'Review' }
];

const Tools = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Tools</h2>
        </div>
        <button style={{ border: 'none', background: '#ef4444', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Tool
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Tool Catalogue</h3>
          <input type="text" placeholder="Search tool" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fef2f2' }}>
            <tr>
              {['Tool ID', 'Tool Name', 'Category', 'Quantity', 'Status'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{tool.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{tool.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{tool.category}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{tool.qty}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: tool.status === 'Active' ? '#dcfce7' : tool.status === 'Low' ? '#fef3c7' : '#f3f4f6', color: tool.status === 'Active' ? '#166534' : tool.status === 'Low' ? '#92400e' : '#374151' }}>{tool.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Tools;
