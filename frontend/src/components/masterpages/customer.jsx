import React, { useState } from 'react';
import "../../styles/Master.css";
import { CUST_KEY, useStore } from '../../store/erpstore';

function Customer() {

  const [customers, setCustomers] = useStore(CUST_KEY, []);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState('Active');
  const [value, setValue] = useState('');

  const addCustomer = () => {

    if (name.trim() === '') {
      alert('Please enter customer name');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      name: name,
      contact: contact,
      status: status,
      value: value
    };

    setCustomers([...customers, newCustomer]);

    setName('');
    setContact('');
    setStatus('Active');
    setValue('');

    setShowForm(false);
  };

  const deleteCustomer = (id) => {

    const newCustomers = customers.filter(
      (customer) => customer.id !== id
    );

    setCustomers(newCustomers);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Customers</h1>

          <p className="page-description">
            Manage your customers
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Customer
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              customers.filter(
                (customer) => customer.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Pending</p>
          <h2>
            {
              customers.filter(
                (customer) => customer.status === 'Pending'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              customers.filter(
                (customer) => customer.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredCustomers.length === 0 ? (

              <tr>
                <td colSpan="6" className="no-data">
                  No customers found
                </td>
              </tr>

            ) : (

              filteredCustomers.map((customer, index) => (

                <tr key={customer.id}>

                  <td>{index + 1}</td>

                  <td>{customer.name}</td>

                  <td>
                    {customer.contact || '—'}
                  </td>

                  <td>

                    <span
                      className={
                        customer.status === 'Active'
                          ? 'active-status'
                          : customer.status === 'Pending'
                            ? 'pending-status'
                            : 'inactive-status'
                      }
                    >
                      {customer.status}
                    </span>

                  </td>

                  <td>
                    {customer.value || '—'}
                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteCustomer(customer.id)
                      }
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


      {showForm && (

        <div className="popup-overlay">

          <div className="customer-form">

            <div className="form-header">

              <div>
                <h2>Add Customer</h2>
                <p>Enter customer details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>


            <div className="form-group">

              <label>Customer Name *</label>

              <input
                type="text"
                placeholder="Enter customer name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>


            <div className="form-group">

              <label>Contact Person</label>

              <input
                type="text"
                placeholder="Enter contact person"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />

            </div>


            <div className="form-group">

              <label>Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >

                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>

              </select>

            </div>


            <div className="form-group">

              <label>Value</label>

              <input
                type="text"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

            </div>


            <div className="form-buttons">

              <button
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={addCustomer}
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default Customer;