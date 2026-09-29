import React, { useState } from "react";
import "../../styles/Master.css";

function Items() {

  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");

  const addItem = () => {

    if (itemName === "") {
      alert("Please enter item name");
      return;
    }

    if (itemCode === "") {
      alert("Please enter item code");
      return;
    }

    const newItem = {
      id: items.length + 1,
      name: itemName,
      code: itemCode,
      category: category,
      status: status
    };

    setItems([...items, newItem]);

    setItemName("");
    setItemCode("");
    setCategory("");
    setStatus("Active");

    setShowForm(false);
  };

  const deleteItem = (id) => {

    const newItems = items.filter(
      (item) => item.id !== id
    );

    setItems(newItems);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      {/* Header */}

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Items</h1>

          <p className="page-description">
            Manage your items
          </p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Item
        </button>

      </div>


      {/* Summary */}

      <div className="summary-container">

        <div className="summary-box">
          <p>Total Items</p>
          <h2>{items.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>

          <h2>
            {
              items.filter(
                (item) => item.status === "Active"
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>

          <h2>
            {
              items.filter(
                (item) => item.status === "Inactive"
              ).length
            }
          </h2>
        </div>

      </div>


      {/* Add Item Form */}

      {showForm && (

        <div className="customer-form">

          <div className="form-header">

            <div>
              <h2>Add Item</h2>

              <p>
                Enter item details
              </p>
            </div>

            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              X
            </button>

          </div>


          {/* Item Name */}

          <div className="form-group">

            <label>Item Name</label>

            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) =>
                setItemName(e.target.value)
              }
            />

          </div>


          {/* Item Code */}

          <div className="form-group">

            <label>Item Code</label>

            <input
              type="text"
              placeholder="Enter item code"
              value={itemCode}
              onChange={(e) =>
                setItemCode(e.target.value)
              }
            />

          </div>


          {/* Category */}

          <div className="form-group">

            <label>Category</label>

            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />

          </div>


          {/* Status */}

          <div className="form-group">

            <label>Status</label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* Buttons */}

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
              Save Item
            </button>

          </div>

        </div>

      )}


      {/* Item Table */}

      <div className="customer-table-container">

        <div className="table-top">

          <h2>Item List</h2>

          <input
            type="text"
            placeholder="Search item"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-input"
          />

        </div>


        <table>

          <thead>

            <tr>

              <th>Item ID</th>

              <th>Item Name</th>

              <th>Item Code</th>

              <th>Category</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {filteredItems.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >
                  No items found
                </td>

              </tr>

            ) : (

              filteredItems.map((item) => (

                <tr key={item.id}>

                  <td>
                    I-{item.id}
                  </td>

                  <td>
                    {item.name}
                  </td>

                  <td>
                    {item.code}
                  </td>

                  <td>
                    {item.category || "—"}
                  </td>

                  <td>

                    <span
                      className={
                        item.status === "Active"
                          ? "active-status"
                          : "inactive-status"
                      }
                    >
                      {item.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteItem(item.id)
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

export default Items;