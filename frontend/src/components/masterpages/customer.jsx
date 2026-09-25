import React from 'react';

const customers = [
  { id: 'C-101', name: 'Apex Industries', contact: 'Ravi Shah', status: 'Active', value: '₹2.4L' },
  { id: 'C-102', name: 'Metro Tools', contact: 'Nisha Patel', status: 'Pending', value: '₹1.8L' },
  { id: 'C-103', name: 'Prime Castings', contact: 'Anil Mehta', status: 'Active', value: '₹3.1L' },
  { id: 'C-104', name: 'Greenline Works', contact: 'Simran Khatri', status: 'Inactive', value: '₹96K' }
];

const Customer = () => {
  return (
    <section style={{ padding: '2rem', background: '#f5f7fb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ margin: 0, color: '#5b6475', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Data</p>
            <h2 style={{ margin: '0.35rem 0 0', color: '#1f2937', fontSize: '2rem' }}>Customers</h2>
          </div>

          <button style={{ border: 'none', background: '#1d4ed8', color: '#fff', borderRadius: '8px', padding: '0.8rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}>
            + Add Customer
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            ['Total Customers', '284'],
            ['Active', '216'],
            ['Pending', '38'],
            ['Revenue', '₹18.4L']
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', padding: '1rem 1.1rem' }}>
              <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '0.5rem' }}>{label}</div>
              <div style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#1f2937' }}>Customer List</h3>
            <input
              type="text"
              placeholder="Search customer"
              style={{ padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '220px', outline: 'none' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#eef2ff' }}>
              <tr>
                {['Customer ID', 'Customer Name', 'Contact Person', 'Status', 'Value'].map((header) => (
                  <th key={header} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 600 }}>{customer.id}</td>
                  <td style={{ padding: '0.9rem 1rem', color: '#1f2937' }}>{customer.name}</td>
                  <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{customer.contact}</td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background:
                          customer.status === 'Active'
                            ? '#dcfce7'
                            : customer.status === 'Pending'
                              ? '#fef3c7'
                              : '#f3f4f6',
                        color:
                          customer.status === 'Active'
                            ? '#166534'
                            : customer.status === 'Pending'
                              ? '#92400e'
                              : '#374151'
                      }}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#1f2937', fontWeight: 700 }}>{customer.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Customer;
