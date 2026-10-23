import React, { useState } from 'react';
import "../../styles/Master.css";

function MaterialGroups() {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');

  const addGroup = () => {
    if (groupName.trim() === '') {
      alert('Please enter material group name');
      return;
    }

    const newGroup = {
      id: Date.now(),
      groupName,
      description,
      status
    };

    setGroups([...groups, newGroup]);

    setGroupName('');
    setDescription('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteGroup = (id) => {
    setGroups(
      groups.filter((group) => group.id !== id)
    );
  };

  const filteredGroups = groups.filter((group) =>
    group.groupName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Material Groups</h1>

          <p className="page-description">
            Manage material groups
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Group
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Groups</p>
          <h2>{groups.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              groups.filter(
                (group) => group.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              groups.filter(
                (group) => group.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search material group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Material Group</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredGroups.length === 0 ? (

              <tr>
                <td colSpan="5" className="no-data">
                  No material groups found
                </td>
              </tr>

            ) : (

              filteredGroups.map((group, index) => (

                <tr key={group.id}>

                  <td>{index + 1}</td>

                  <td>
                    {group.groupName}
                  </td>

                  <td>
                    {group.description || '—'}
                  </td>

                  <td>

                    <span
                      className={
                        group.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {group.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteGroup(group.id)
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
                <h2>Add Material Group</h2>
                <p>Enter material group details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>


            <div className="form-group">

              <label>Material Group Name *</label>

              <input
                type="text"
                value={groupName}
                onChange={(e) =>
                  setGroupName(e.target.value)
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
                onClick={addGroup}
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

export default MaterialGroups;