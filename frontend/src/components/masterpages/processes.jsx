import React, { useState } from 'react';
import "../../styles/Master.css";
import { PROCESSES_KEY, useStore } from '../../store/erpstore';

function ProcessMaster() {

  const [processes, setProcesses] = useStore(PROCESSES_KEY, []);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [processCode, setProcessCode] = useState('');
  const [processName, setProcessName] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState('Active');

  const addProcess = () => {

    if (processName.trim() === '') {
      alert('Please enter process name');
      return;
    }

    const newProcess = {
      id: Date.now(),
      processCode,
      processName,
      description,
      rate,
      status
    };

    setProcesses([...processes, newProcess]);

    setProcessCode('');
    setProcessName('');
    setDescription('');
    setRate('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteProcess = (id) => {
    setProcesses(
      processes.filter((process) => process.id !== id)
    );
  };

  const filteredProcesses = processes.filter(
    (process) =>
      process.processName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      process.processCode
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Process Master</h1>

          <p className="page-description">
            Manage manufacturing processes
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Process
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Processes</p>
          <h2>{processes.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              processes.filter(
                (process) => process.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              processes.filter(
                (process) => process.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search process"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Process Code</th>
              <th>Process Name</th>
              <th>Description</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredProcesses.length === 0 ? (

              <tr>
                <td colSpan="7" className="no-data">
                  No processes found
                </td>
              </tr>

            ) : (

              filteredProcesses.map((process, index) => (

                <tr key={process.id}>

                  <td>{index + 1}</td>

                  <td>
                    {process.processCode || '—'}
                  </td>

                  <td>
                    {process.processName}
                  </td>

                  <td>
                    {process.description || '—'}
                  </td>

                  <td>
                    ₹{process.rate || 0}
                  </td>

                  <td>

                    <span
                      className={
                        process.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {process.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteProcess(process.id)
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
                <h2>Add Process</h2>
                <p>Enter process details</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                X
              </button>

            </div>


            <div className="form-group">

              <label>Process Code</label>

              <input
                type="text"
                value={processCode}
                onChange={(e) =>
                  setProcessCode(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>Process Name *</label>

              <input
                type="text"
                value={processName}
                onChange={(e) =>
                  setProcessName(e.target.value)
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

              <label>Rate ₹</label>

              <input
                type="number"
                value={rate}
                onChange={(e) =>
                  setRate(e.target.value)
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
                onClick={addProcess}
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

export default ProcessMaster;