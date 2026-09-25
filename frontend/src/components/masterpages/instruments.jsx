import React from 'react';

const instruments = [
  { id: 'IN-001', name: 'Micrometer 0-25', dept: 'QA', status: 'Calibrated', nextDue: '2026-11-12' },
  { id: 'IN-002', name: 'Vernier Caliper', dept: 'Production', status: 'Due Soon', nextDue: '2026-10-20' },
  { id: 'IN-003', name: 'Height Gauge', dept: 'Quality', status: 'Calibrated', nextDue: '2026-12-03' },
  { id: 'IN-004', name: 'Dial Indicator', dept: 'Inspection', status: 'Overdue', nextDue: '2026-09-01' }
];

const Instruments = () => (
  <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
          <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Instruments</h2>
        </div>
        <button style={{ border: 'none', background: '#0ea5e9', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Instrument
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>Calibration Register</h3>
          <input type="text" placeholder="Search instrument" style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f0f9ff' }}>
            <tr>
              {['Instrument ID', 'Instrument Name', 'Department', 'Status', 'Next Due'].map((header) => (
                <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {instruments.map((instrument) => (
              <tr key={instrument.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{instrument.id}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{instrument.name}</td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{instrument.dept}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: instrument.status === 'Calibrated' ? '#dcfce7' : instrument.status === 'Due Soon' ? '#fef3c7' : '#fee2e2', color: instrument.status === 'Calibrated' ? '#166534' : instrument.status === 'Due Soon' ? '#92400e' : '#991b1b' }}>{instrument.status}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{instrument.nextDue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default Instruments;
