import React, { useState } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Building2,
  MapPin,
  Users,
  X
} from 'lucide-react';

import '../../styles/customer.css';

const Customer = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    gst: '',
    location: '',
    plant: '',
    contacts: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter customer name.');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      pan: formData.pan,
      gst: formData.gst,
      location: formData.location,
      plant: formData.plant,
      contacts: formData.contacts || 0
    };

    setCustomers([...customers, newCustomer]);

    setFormData({
      name: '',
      pan: '',
      gst: '',
      location: '',
      plant: '',
      contacts: ''
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCustomers(
      customers.filter((customer) => customer.id !== id)
    );
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      {/* HEADER */}

      <div className="customer-header">

        <div className="customer-title-section">

          <div className="customer-title-icon">
            <Building2 size={22} />
          </div>

          <div>
            <h1>Customers</h1>
            <p>Manage customer accounts, contacts & plants</p>
          </div>

        </div>

        <button className="help-button">
          ? How it works?
        </button>

      </div>


      {/* TOOLBAR */}

      <div className="customer-toolbar">

        <div className="customer-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <div className="customer-actions">

          <button className="deleted-button">
            <Trash2 size={15} />
            Deleted
          </button>

          <button
            className="add-customer-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={17} />
            Add Customer
          </button>

        </div>

      </div>


      {/* ADD CUSTOMER FORM */}

      {showForm && (

        <div className="customer-form-container">

          <div className="customer-form-header">

            <div>
              <h2>Add Customer</h2>
              <p>Enter customer details</p>
            </div>

            <button
              className="close-form-button"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>

          </div>


          <form onSubmit={handleSaveCustomer}>

            <div className="customer-form-grid">

              <div className="form-group">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={handleInputChange}
                />

              </div>


              <div className="form-group">

                <label>
                  PAN
                </label>

                <input
                  type="text"
                  name="pan"
                  placeholder="Enter PAN"
                  value={formData.pan}
                  onChange={handleInputChange}
                />

              </div>


              <div className="form-group">

                <label>
                  GST
                </label>

                <input
                  type="text"
                  name="gst"
                  placeholder="Enter GST number"
                  value={formData.gst}
                  onChange={handleInputChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Corporate Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter corporate location"
                  value={formData.location}
                  onChange={handleInputChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Plant Address
                </label>

                <input
                  type="text"
                  name="plant"
                  placeholder="Enter plant address"
                  value={formData.plant}
                  onChange={handleInputChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Contacts
                </label>

                <input
                  type="number"
                  name="contacts"
                  min="0"
                  placeholder="Number of contacts"
                  value={formData.contacts}
                  onChange={handleInputChange}
                />

              </div>

            </div>


            <div className="customer-form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-customer-button"
              >
                <Plus size={17} />
                Save Customer
              </button>

            </div>

          </form>

        </div>

      )}


      {/* CUSTOMER TABLE */}

      <div className="customer-table-container">

        <table className="customer-table">

          <thead>

            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>PAN</th>
              <th>GST</th>
              <th>Corp Location</th>
              <th>Plant Address</th>
              <th>Contacts</th>
            </tr>

          </thead>


          <tbody>

            {filteredCustomers.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-customer-table"
                >
                  <Building2 size={32} />

                  <strong>
                    No customers found
                  </strong>

                  <span>
                    Click "Add Customer" to create a customer.
                  </span>

                </td>

              </tr>

            ) : (

              filteredCustomers.map((customer, index) => (

                <tr key={customer.id}>

                  <td>

                    <div className="row-number">
                      {index + 1}
                    </div>

                  </td>


                  <td>

                    <div className="customer-name">

                      <div className="small-building-icon">
                        <Building2 size={15} />
                      </div>

                      <div>

                        <strong>
                          {customer.name}
                        </strong>

                        <span>
                          #{customer.id}
                        </span>

                      </div>

                    </div>

                  </td>


                  <td>
                    {customer.pan || '—'}
                  </td>


                  <td>
                    {customer.gst || '—'}
                  </td>


                  <td>

                    <div className="location-cell">

                      <MapPin size={14} />

                      {customer.location || '—'}

                    </div>

                  </td>


                  <td>
                    {customer.plant || '—'}
                  </td>


                  <td>

                    <div className="contact-cell">

                      <div className="table-actions">

                        <button title="Edit">
                          <Pencil size={14} />
                        </button>

                        <button title="View">
                          <Eye size={14} />
                        </button>

                        <button
                          title="Delete"
                          onClick={() =>
                            handleDelete(customer.id)
                          }
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>


                      <span className="contact-count">

                        <Users size={13} />

                        {customer.contacts}

                      </span>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Customer;