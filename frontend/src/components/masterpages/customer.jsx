import React, { useState } from 'react';
import "../../styles/Master.css";
import { useStore, CUST_KEY } from '../../store/erpstore';

function Customer() {

  // Customer list (saved in localStorage so the Dashboard and Invoices can use it)
  const [customers, setCustomers] = useStore(CUST_KEY, []);

  // Show or hide Add Customer form
  const [showForm, setShowForm] = useState(false);

  // Search box
  const [search, setSearch] = useState('');

  // Form values
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState('Active');
  const [value, setValue] = useState('');


  // Add customer
  const addCustomer = () => {

    if (name.trim() === '') {
      alert('Please enter customer name');
      return;
    }

    const newCustomer = {
      id: Math.max(100, ...customers.map((c) => c.id)) + 1,
      name: name.trim().toUpperCase(),
      contact: contact,
      status: status,
      value: value
    };

    setCustomers([...customers, newCustomer]);

    // Clear form
    setName('');
    setContact('');
    setStatus('Active');
    setValue('');

    // Close form
    setShowForm(false);
  };


  // Delete customer
  const deleteCustomer = (id) => {

    const newCustomers = customers.filter(
      (customer) => customer.id !== id
    );

    setCustomers(newCustomers);
  };


  // Search customers
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase())
  );


  return (

    <div className="customer-page">

      {/* PAGE HEADER */}

      <div className="customer-header">

        <div>
          <p className="small-title">
            MASTER DATA
          </p>

          <h1>
            Customers
          </h1>

          <p className="page-description">
            Manage your customers
          </p>
        </div>


        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Customer
        </button>

      </div>


      {/* SUMMARY */}

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
          <p>Total Value</p>
          <h2>₹0</h2>
        </div>

      </div>


      {/* ADD CUSTOMER FORM */}

      {showForm && (

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


          {/* CUSTOMER NAME */}

          <div className="form-group">

            <label>
              Customer Name
            </label>

            <input
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>


          {/* CONTACT */}

          <div className="form-group">

            <label>
              Contact Person
            </label>

            <input
              type="text"
              placeholder="Enter contact person"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

          </div>


          {/* STATUS */}

          <div className="form-group">

            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >

              <option value="Active">
                Active
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* VALUE */}

          <div className="form-group">

            <label>
              Value
            </label>

            <input
              type="text"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

          </div>


          {/* FORM BUTTONS */}

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
              Save Customer
            </button>

          </div>

        </div>

      )}


      {/* CUSTOMER TABLE */}

      <div className="customer-table-container">

        <div className="table-top">

          <h2>
            Customer List
          </h2>


          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

        </div>


        <table>

          <thead>

            <tr>

              <th>
                Customer ID
              </th>

              <th>
                Customer Name
              </th>

              <th>
                Contact Person
              </th>

              <th>
                Status
              </th>

              <th>
                Value
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredCustomers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >
                  No customers found
                </td>

              </tr>

            ) : (

              filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td>
                    C-{customer.id}
                  </td>

                  <td>
                    {customer.name}
                  </td>

                  <td>
                    {customer.contact}
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

    </div>

  );
}

export default Customer;