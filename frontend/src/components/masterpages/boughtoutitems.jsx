import React, { useState } from 'react';
import "../../styles/Master.css";

function BoughtOutItems() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('Nos');
  const [supplier, setSupplier] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('Active');

  const addItem = () => {
    if (itemName.trim() === '') {
      alert('Please enter item name');
      return;
    }

    const newItem = {
      id: Date.now(),
      itemCode,
      itemName,
      description,
      unit,
      supplier,
      price,
      status
    };

    setItems([...items, newItem]);

    setItemCode('');
    setItemName('');
    setDescription('');
    setUnit('Nos');
    setSupplier('');
    setPrice('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">
        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Bought Out Items</h1>

          <p className="page-description">
            Manage bought out items
          </p>
        </div>

        <div className="master-buttons">
          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="summary-container">

        <div className="summary-box">
          <p>Total Items</p>
          <h2>{items.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {items.filter((item) => item.status === 'Active').length}
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {items.filter((item) => item.status === 'Inactive').length}
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
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Supplier</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredItems.length === 0 ? (

              <tr>
                <td colSpan="9" className="no-data">
                  No bought out items found
                </td>
              </tr>

            ) : (

              filteredItems.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    {item.itemCode || '—'}
                  </td>

                  <td>
                    {item.itemName}
                  </td>

                  <td>
                    {item.description || '—'}
                  </td>

                  <td>
                    {item.unit}
                  </td>

                  <td>
                    {item.supplier || '—'}
                  </td>

                  <td>
                    ₹{item.price || 0}
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
                      onClick={() => deleteItem(item.id)}
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
                <h2>Add Bought Out Item</h2>
                <p>Enter item details</p>
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

                <label>Item Code</label>

                <input
                  type="text"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                />

              </div>

              <div className="form-group">

                <label>Item Name *</label>

                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />

              </div>

            </div>

            <div className="form-group">

              <label>Description</label>

              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Unit</label>

                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="Nos">Nos</option>
                  <option value="Kg">Kg</option>
                  <option value="Meter">Meter</option>
                  <option value="Set">Set</option>
                </select>

              </div>

              <div className="form-group">

                <label>Price ₹</label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

              </div>

            </div>

            <div className="form-group">

              <label>Supplier</label>

              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
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

              <button
                className="save-button"
                onClick={addItem}
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

export default BoughtOutItems;