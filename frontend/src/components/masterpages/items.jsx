import React, { useState } from 'react';
import "../../styles/Master.css";

function Items() {

  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [drawingNumber, setDrawingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [oldDrawing, setOldDrawing] = useState('');
  const [revision, setRevision] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [basicPrice, setBasicPrice] = useState('');
  const [itemType, setItemType] = useState('Material');

  const addItem = () => {

    if (drawingNumber.trim() === '') {
      alert('Please enter drawing number');
      return;
    }

    const newItem = {
      id: Date.now(),
      drawingNumber,
      description,
      oldDrawing,
      revision,
      hsnCode,
      basicPrice,
      itemType
    };

    setItems([...items, newItem]);

    setDrawingNumber('');
    setDescription('');
    setOldDrawing('');
    setRevision('');
    setHsnCode('');
    setBasicPrice('');
    setItemType('Material');

    setShowForm(false);
  };

  const deleteItem = (id) => {
    setItems(
      items.filter((item) => item.id !== id)
    );
  };

  const filteredItems = items.filter(
    (item) =>
      item.drawingNumber
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Items</h1>

          <p className="page-description">
            Manage item master
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
          <p>Materials</p>
          <h2>
            {
              items.filter(
                (item) => item.itemType === 'Material'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Finished Goods</p>
          <h2>
            {
              items.filter(
                (item) => item.itemType === 'Finished Good'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Bought Out</p>
          <h2>
            {
              items.filter(
                (item) => item.itemType === 'Bought Out'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Drawing No.</th>
              <th>Description</th>
              <th>Old Drawing</th>
              <th>Revision</th>
              <th>HSN Code</th>
              <th>Item Type</th>
              <th>Basic Price</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredItems.length === 0 ? (

              <tr>
                <td colSpan="9" className="no-data">
                  No items found
                </td>
              </tr>

            ) : (

              filteredItems.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    {item.drawingNumber}
                  </td>

                  <td>
                    {item.description || '—'}
                  </td>

                  <td>
                    {item.oldDrawing || '—'}
                  </td>

                  <td>
                    {item.revision || '—'}
                  </td>

                  <td>
                    {item.hsnCode || '—'}
                  </td>

                  <td>
                    {item.itemType}
                  </td>

                  <td>
                    ₹{item.basicPrice || 0}
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
                <h2>Add Item</h2>
                <p>Enter item details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>


            <div className="form-group">

              <label>Drawing Number *</label>

              <input
                type="text"
                value={drawingNumber}
                onChange={(e) =>
                  setDrawingNumber(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>Description</label>

              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>Old Drawing No.</label>

                <input
                  type="text"
                  value={oldDrawing}
                  onChange={(e) =>
                    setOldDrawing(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>Revision</label>

                <input
                  type="text"
                  value={revision}
                  onChange={(e) =>
                    setRevision(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>HSN Code</label>

                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) =>
                    setHsnCode(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>Basic Price ₹</label>

                <input
                  type="number"
                  value={basicPrice}
                  onChange={(e) =>
                    setBasicPrice(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>Item Type</label>

              <select
                value={itemType}
                onChange={(e) =>
                  setItemType(e.target.value)
                }
              >

                <option value="Material">
                  Material
                </option>

                <option value="Finished Good">
                  Finished Good
                </option>

                <option value="Bought Out">
                  Bought Out
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>Drawing PDF / Image</label>

              <input type="file" />

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

export default Items;