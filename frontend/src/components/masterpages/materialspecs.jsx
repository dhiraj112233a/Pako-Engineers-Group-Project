import React, { useState } from "react";
import "../../styles/Master.css";

function MaterialSpecs() {

  const [materialSpecs, setMaterialSpecs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [materialName, setMaterialName] = useState("");
  const [specification, setSpecification] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState("Active");

  const addMaterialSpec = () => {

    if (materialName === "") {
      alert("Please enter material name");
      return;
    }

    if (specification === "") {
      alert("Please enter specification");
      return;
    }

    const newMaterialSpec = {
      id: materialSpecs.length + 1,
      materialName: materialName,
      specification: specification,
      unit: unit,
      status: status
    };

    setMaterialSpecs([
      ...materialSpecs,
      newMaterialSpec
    ]);

    setMaterialName("");
    setSpecification("");
    setUnit("");
    setStatus("Active");

    setShowForm(false);
  };


  const deleteMaterialSpec = (id) => {

    const newMaterialSpecs = materialSpecs.filter(
      (materialSpec) => materialSpec.id !== id
    );

    setMaterialSpecs(newMaterialSpecs);
  };


  const filteredMaterialSpecs = materialSpecs.filter(
    (materialSpec) =>
      materialSpec.materialName
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      materialSpec.specification
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
            Material Specs
          </h1>

          <p className="page-description">
            Manage material specifications
          </p>

        </div>


        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Material Spec
        </button>

      </div>


      {/* Summary */}

      <div className="summary-container">

        <div className="summary-box">

          <p>
            Total Specs
          </p>

          <h2>
            {materialSpecs.length}
          </h2>

        </div>


        <div className="summary-box">

          <p>
            Active
          </p>

          <h2>
            {
              materialSpecs.filter(
                (spec) => spec.status === "Active"
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
              materialSpecs.filter(
                (spec) => spec.status === "Inactive"
              ).length
            }
          </h2>

        </div>

      </div>


      {/* Add Material Specification Form */}

      {showForm && (

        <div className="customer-form">

          <div className="form-header">

            <div>

              <h2>
                Add Material Specification
              </h2>

              <p>
                Enter material specification details
              </p>

            </div>


            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              X
            </button>

          </div>


          {/* Material Name */}

          <div className="form-group">

            <label>
              Material Name
            </label>

            <input
              type="text"
              placeholder="Enter material name"
              value={materialName}
              onChange={(e) =>
                setMaterialName(e.target.value)
              }
            />

          </div>


          {/* Specification */}

          <div className="form-group">

            <label>
              Specification
            </label>

            <input
              type="text"
              placeholder="Enter specification"
              value={specification}
              onChange={(e) =>
                setSpecification(e.target.value)
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


          {/* Form Buttons */}

          <div className="form-buttons">

            <button
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>


            <button
              className="save-button"
              onClick={addMaterialSpec}
            >
              Save Material Spec
            </button>

          </div>

        </div>

      )}


      {/* Material Specs Table */}

      <div className="customer-table-container">

        <div className="table-top">

          <h2>
            Material Specification List
          </h2>


          <input
            type="text"
            placeholder="Search material"
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
                Spec ID
              </th>

              <th>
                Material Name
              </th>

              <th>
                Specification
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

            {filteredMaterialSpecs.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >
                  No material specifications found
                </td>

              </tr>

            ) : (

              filteredMaterialSpecs.map(
                (materialSpec) => (

                  <tr key={materialSpec.id}>

                    <td>
                      MS-{materialSpec.id}
                    </td>

                    <td>
                      {materialSpec.materialName}
                    </td>

                    <td>
                      {materialSpec.specification}
                    </td>

                    <td>
                      {materialSpec.unit || "—"}
                    </td>

                    <td>

                      <span
                        className={
                          materialSpec.status === "Active"
                            ? "active-status"
                            : "inactive-status"
                        }
                      >
                        {materialSpec.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteMaterialSpec(
                            materialSpec.id
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

export default MaterialSpecs;