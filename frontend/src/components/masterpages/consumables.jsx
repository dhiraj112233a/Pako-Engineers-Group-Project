import React, { useState } from "react";
import "../../styles/Master.css";

function Consumables() {

  const [consumables, setConsumables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState("Active");


  const addConsumable = () => {

    if (name === "") {
      alert("Please enter consumable name");
      return;
    }

    if (code === "") {
      alert("Please enter consumable code");
      return;
    }

    const newConsumable = {
      id: consumables.length + 1,
      name: name,
      code: code,
      unit: unit,
      status: status
    };

    setConsumables([
      ...consumables,
      newConsumable
    ]);

    setName("");
    setCode("");
    setUnit("");
    setStatus("Active");

    setShowForm(false);
  };


  const deleteConsumable = (id) => {

    const newConsumables = consumables.filter(
      (consumable) => consumable.id !== id
    );

    setConsumables(newConsumables);
  };


  const filteredConsumables = consumables.filter(
    (consumable) =>
      consumable.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      consumable.code
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  return (
    <div className="customer-page">

      {/* Header */}

      <div className="customer-header">

        <div>

          <p className="small-title">
            MASTER DATA
          </p>

          <h1>
            Consumables
          </h1>

          <p className="page-description">
            Manage your consumables
          </p>

        </div>


        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Consumable
        </button>

      </div>


      {/* Summary */}

      <div className="summary-container">

        <div className="summary-box">

          <p>
            Total Consumables
          </p>

          <h2>
            {consumables.length}
          </h2>

        </div>


        <div className="summary-box">

          <p>
            Active
          </p>

          <h2>
            {
              consumables.filter(
                (consumable) =>
                  consumable.status === "Active"
              ).length
            }
          </h2>

        </div>


        <div className="summary-box">

          <p>
            Inactive
          </p>

          <h2>
            {
              consumables.filter(
                (consumable) =>
                  consumable.status === "Inactive"
              ).length
            }
          </h2>

        </div>

      </div>


      {/* Add Consumable Form */}

      {showForm && (

        <div className="customer-form">

          <div className="form-header">

            <div>

              <h2>
                Add Consumable
              </h2>

              <p>
                Enter consumable details
              </p>

            </div>


            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              X
            </button>

          </div>


          {/* Consumable Name */}

          <div className="form-group">

            <label>
              Consumable Name
            </label>

            <input
              type="text"
              placeholder="Enter consumable name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* Consumable Code */}

          <div className="form-group">

            <label>
              Consumable Code
            </label>

            <input
              type="text"
              placeholder="Enter consumable code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
            />

          </div>


          {/* Unit */}

          <div className="form-group">

            <label>
              Unit
            </label>

            <input
              type="text"
              placeholder="Enter unit"
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
            />

          </div>


          {/* Status */}

          <div className="form-group">

            <label>
              Status
            </label>

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
              onClick={addConsumable}
            >
              Save Consumable
            </button>

          </div>

        </div>

      )}


      {/* Consumables Table */}

      <div className="customer-table-container">

        <div className="table-top">

          <h2>
            Consumable List
          </h2>


          <input
            type="text"
            placeholder="Search consumable"
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

              <th>
                Consumable ID
              </th>

              <th>
                Consumable Name
              </th>

              <th>
                Consumable Code
              </th>

              <th>
                Unit
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredConsumables.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >
                  No consumables found
                </td>

              </tr>

            ) : (

              filteredConsumables.map(
                (consumable) => (

                  <tr key={consumable.id}>

                    <td>
                      C-{consumable.id}
                    </td>

                    <td>
                      {consumable.name}
                    </td>

                    <td>
                      {consumable.code}
                    </td>

                    <td>
                      {consumable.unit || "—"}
                    </td>

                    <td>

                      <span
                        className={
                          consumable.status === "Active"
                            ? "active-status"
                            : "inactive-status"
                        }
                      >
                        {consumable.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteConsumable(
                            consumable.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Consumables;