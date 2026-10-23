import React, { useState } from 'react';
import "../../styles/Master.css";

function MaterialSpecs() {
  const [specs, setSpecs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [specName, setSpecName] = useState('');
  const [materialGroup, setMaterialGroup] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');

  const addSpec = () => {
    if (specName.trim() === '') {
      alert('Please enter material specification');
      return;
    }

    const newSpec = {
      id: Date.now(),
      specName,
      materialGroup,
      grade,
      description,
      status
    };

    setSpecs([...specs, newSpec]);

    setSpecName('');
    setMaterialGroup('');
    setGrade('');
    setDescription('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteSpec = (id) => {
    setSpecs(
      specs.filter((spec) => spec.id !== id)
    );
  };

  const filteredSpecs = specs.filter(
    (spec) =>
      spec.specName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      spec.materialGroup
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      spec.grade
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Material Specifications</h1>

          <p className="page-description">
            Manage material specifications
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Specification
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Specifications</p>
          <h2>{specs.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              specs.filter(
                (spec) => spec.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              specs.filter(
                (spec) => spec.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search specification"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Material Specification</th>
              <th>Material Group</th>
              <th>Grade</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredSpecs.length === 0 ? (

              <tr>
                <td colSpan="7" className="no-data">
                  No specifications found
                </td>
              </tr>

            ) : (

              filteredSpecs.map((spec, index) => (

                <tr key={spec.id}>

                  <td>{index + 1}</td>

                  <td>
                    {spec.specName}
                  </td>

                  <td>
                    {spec.materialGroup || '—'}
                  </td>

                  <td>
                    {spec.grade || '—'}
                  </td>

                  <td>
                    {spec.description || '—'}
                  </td>

                  <td>

                    <span
                      className={
                        spec.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {spec.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteSpec(spec.id)
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
                <h2>Add Material Specification</h2>
                <p>Enter specification details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>


            <div className="form-group">

              <label>Material Specification *</label>

              <input
                type="text"
                value={specName}
                onChange={(e) =>
                  setSpecName(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>Material Group</label>

              <select
                value={materialGroup}
                onChange={(e) =>
                  setMaterialGroup(e.target.value)
                }
              >

                <option value="">
                  Select Material Group
                </option>

                <option value="Steel">
                  Steel
                </option>

                <option value="Stainless Steel">
                  Stainless Steel
                </option>

                <option value="Aluminium">
                  Aluminium
                </option>

                <option value="Brass">
                  Brass
                </option>

                <option value="Cast Iron">
                  Cast Iron
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>Grade</label>

              <input
                type="text"
                value={grade}
                onChange={(e) =>
                  setGrade(e.target.value)
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


            <div className="form-buttons">

              <button
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={addSpec}
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

export default MaterialSpecs;