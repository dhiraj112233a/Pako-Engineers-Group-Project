import React from 'react';

const machines = [
  { id: 'MC-01', name: 'CNC VMC-120', line: 'Line A', status: 'Running', utilization: '82%' },
  { id: 'MC-02', name: 'Lathe LT-7', line: 'Line B', status: 'Idle', utilization: '38%' },
  { id: 'MC-03', name: 'Grinding G-25', line: 'Line C', status: 'Running', utilization: '76%' },
  { id: 'MC-04', name: 'Drill D-9', line: 'Line A', status: 'Maintenance', utilization: '12%' }
];

const Machines = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Machines</h2>
        </div>
        <button style={{ border: 'none', background: '#f59e0b', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Machine
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Machine Fleet</h3>
          <input type="text" placeholder="Search machine" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fff7ed' }}>
            <tr>
              {['Machine ID', 'Machine Name', 'Line', 'Status', 'Utilization'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{machine.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{machine.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{machine.line}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: machine.status === 'Running' ? '#dcfce7' : machine.status === 'Idle' ? '#f3f4f6' : '#fef3c7', color: machine.status === 'Running' ? '#166534' : machine.status === 'Idle' ? '#374151' : '#92400e' }}>{machine.status}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 700 }}>{machine.utilization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Machines;
