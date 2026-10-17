import React, { useState } from 'react';
import "../../styles/Master.css";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState('');

  const [vendorName, setVendorName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Active');

  const addVendor = () => {
    if (vendorName.trim() === '') {
      alert('Please enter vendor name');
      return;
    }

    const newVendor = {
      id: Date.now(),
      vendorName,
      contactPerson,
      phone,
      email,
      gstNumber,
      address,
      status
    };

    setVendors([...vendors, newVendor]);
    setVendorName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setGstNumber('');
    setAddress('');
    setStatus('Active');
    setShowForm(false);
  };

  const deleteVendor = (id) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id));
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      vendor.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">
        <div>
          <p className="small-title">MASTER DATA</p>
          <h1>Vendors</h1>
          <p className="page-description">
            Manage vendors and suppliers
          </p>
        </div>

        <div className="master-buttons">
          <button
            className="view-button"
            onClick={() => setShowTable(true)}
          >
            View Vendors
          </button>

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Vendor
          </button>
        </div>
      </div>

      <div className="summary-container">
        <div className="summary-box">
          <p>Total Vendors</p>
          <h2>{vendors.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {vendors.filter((vendor) => vendor.status === 'Active').length}
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {vendors.filter((vendor) => vendor.status === 'Inactive').length}
          </h2>
        </div>
      </div>

      {showTable && (
        <div className="popup-overlay">
          <div className="table-popup">

            <div className="popup-table-header">
              <div>
                <h2>Vendor List</h2>
                <p>View and manage vendors</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowTable(false)}
              >
                X
              </button>
            </div>

            <div className="table-top">
              <h2>Vendors</h2>

              <input
                type="text"
                className="search-input"
                placeholder="Search vendor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="customer-table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Vendor Name</th>
                    <th>Contact Person</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>GST Number</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">
                        No vendors found
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor, index) => (
                      <tr key={vendor.id}>
                        <td>{index + 1}</td>
                        <td>{vendor.vendorName}</td>
                        <td>{vendor.contactPerson || '—'}</td>
                        <td>{vendor.phone || '—'}</td>
                        <td>{vendor.email || '—'}</td>
                        <td>{vendor.gstNumber || '—'}</td>
                        <td>{vendor.address || '—'}</td>

                        <td>
                          <span
                            className={
                              vendor.status === 'Active'
                                ? 'active-status'
                                : 'inactive-status'
                            }
                          >
                            {vendor.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="delete-button"
                            onClick={() => deleteVendor(vendor.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {showForm && (
        <div className="popup-overlay">
          <div className="customer-form">

            <div className="form-header">
              <div>
                <h2>Add Vendor</h2>
                <p>Enter vendor details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>
            </div>

            <div className="form-group">
              <label>Vendor Name *</label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>GST Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                className="form-textarea"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button className="save-button" onClick={addVendor}>
                Create
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Vendors;