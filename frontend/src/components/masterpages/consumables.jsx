import React, { useState } from 'react';
import "../../styles/Master.css";
import { CONSUMABLES_KEY, useStore } from '../../store/erpstore';

function Consumables() {
  const [consumables, setConsumables] = useStore(CONSUMABLES_KEY, []);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [unit, setUnit] = useState('Nos');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('Active');

  const addConsumable = () => {
    if (name.trim() === '') {
      alert('Please enter consumable name');
      return;
    }

    const newConsumable = {
      id: Date.now(),
      name,
      code,
      unit,
      price,
      stock,
      status
    };

    setConsumables([...consumables, newConsumable]);

    setName('');
    setCode('');
    setUnit('Nos');
    setPrice('');
    setStock('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteConsumable = (id) => {
    setConsumables(
      consumables.filter((item) => item.id !== id)
    );
  };

  const filteredConsumables = consumables.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">
        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Consumables</h1>

          <p className="page-description">
            Manage consumable items
          </p>
        </div>

        <div className="master-buttons">
          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Consumable
          </button>
        </div>
      </div>

      <div className="summary-container">

        <div className="summary-box">
          <p>Total Consumables</p>
          <h2>{consumables.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              consumables.filter(
                (item) => item.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              consumables.filter(
                (item) => item.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>

      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="customer-table-container">

        <table>

          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Consumable Name</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredConsumables.length === 0 ? (

              <tr>
                <td colSpan="8" className="no-data">
                  No consumables found
                </td>
              </tr>

            ) : (

              filteredConsumables.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    {item.code || '—'}
                  </td>

                  <td>
                    {item.name}
                  </td>

                  <td>
                    {item.unit}
                  </td>

                  <td>
                    ₹{item.price || 0}
                  </td>

                  <td>
                    {item.stock || 0}
                  </td>

                  <td>
                    <span
                      className={
                        item.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteConsumable(item.id)
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
                <h2>Add Consumable</h2>
                <p>Enter consumable details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Code</label>

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

              </div>

              <div className="form-group">

                <label>Consumable Name *</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>

            </div>

            <div className="form-group">

              <label>Unit</label>

              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="Nos">Nos</option>
                <option value="Kg">Kg</option>
                <option value="Litre">Litre</option>
                <option value="Meter">Meter</option>
              </select>

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Price ₹</label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

              </div>

              <div className="form-group">

                <label>Stock</label>

                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />

              </div>

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

              <button
                className="save-button"
                onClick={addConsumable}
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

export default Consumables;