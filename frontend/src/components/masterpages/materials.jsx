import React, { useState } from 'react';
import "../../styles/Master.css";
import { MATERIALS_KEY, useStore } from '../../store/erpstore';

function Materials() {
  const [materials, setMaterials] = useStore(MATERIALS_KEY, []);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [materialName, setMaterialName] = useState('');
  const [materialGroup, setMaterialGroup] = useState('');
  const [materialSpec, setMaterialSpec] = useState('');
  const [unit, setUnit] = useState('Kg');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState('Active');

  const addMaterial = () => {
    if (materialName.trim() === '') {
      alert('Please enter material name');
      return;
    }

    const newMaterial = {
      id: Date.now(),
      materialName,
      materialGroup,
      materialSpec,
      unit,
      rate,
      status
    };

    setMaterials([...materials, newMaterial]);

    setMaterialName('');
    setMaterialGroup('');
    setMaterialSpec('');
    setUnit('Kg');
    setRate('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteMaterial = (id) => {
    setMaterials(
      materials.filter((material) => material.id !== id)
    );
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.materialName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      material.materialGroup
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      material.materialSpec
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Materials</h1>

          <p className="page-description">
            Manage material master
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Material
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Materials</p>
          <h2>{materials.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              materials.filter(
                (material) => material.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              materials.filter(
                (material) => material.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search material"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>
            <tr>
              <th>#</th>
              <th>Material Name</th>
              <th>Material Group</th>
              <th>Material Spec</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredMaterials.length === 0 ? (

              <tr>
                <td colSpan="8" className="no-data">
                  No materials found
                </td>
              </tr>

            ) : (

              filteredMaterials.map((material, index) => (

                <tr key={material.id}>

                  <td>{index + 1}</td>

                  <td>
                    {material.materialName}
                  </td>

                  <td>
                    {material.materialGroup || '—'}
                  </td>

                  <td>
                    {material.materialSpec || '—'}
                  </td>

                  <td>
                    {material.unit}
                  </td>

                  <td>
                    ₹{material.rate || 0}
                  </td>

                  <td>

                    <span
                      className={
                        material.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {material.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteMaterial(material.id)
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
                <h2>Add Material</h2>
                <p>Enter material details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>


            <div className="form-group">

              <label>Material Name *</label>

              <input
                type="text"
                value={materialName}
                onChange={(e) =>
                  setMaterialName(e.target.value)
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

              <label>Material Specification</label>

              <input
                type="text"
                value={materialSpec}
                onChange={(e) =>
                  setMaterialSpec(e.target.value)
                }
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>Unit</label>

                <select
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value)
                  }
                >
                  <option value="Kg">Kg</option>
                  <option value="Nos">Nos</option>
                  <option value="Meter">Meter</option>
                  <option value="Ton">Ton</option>
                </select>

              </div>


              <div className="form-group">

                <label>Rate ₹</label>

                <input
                  type="number"
                  value={rate}
                  onChange={(e) =>
                    setRate(e.target.value)
                  }
                />

              </div>

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
                onClick={addMaterial}
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

export default Materials;