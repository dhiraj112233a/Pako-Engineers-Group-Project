import React, { useState } from 'react';
import "../../styles/Master.css";
import { MACHINES_KEY, useStore } from '../../store/erpstore';

function Machines() {
  const [machines, setMachines] = useStore(MACHINES_KEY, []);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [machineName, setMachineName] = useState('');
  const [machineCode, setMachineCode] = useState('');
  const [machineType, setMachineType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState('Active');

  const addMachine = () => {
    if (machineName.trim() === '') {
      alert('Please enter machine name');
      return;
    }

    const newMachine = {
      id: Date.now(),
      machineName,
      machineCode,
      machineType,
      capacity,
      rate,
      status
    };

    setMachines([...machines, newMachine]);

    setMachineName('');
    setMachineCode('');
    setMachineType('');
    setCapacity('');
    setRate('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteMachine = (id) => {
    setMachines(
      machines.filter((machine) => machine.id !== id)
    );
  };

  const filteredMachines = machines.filter(
    (machine) =>
      machine.machineName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      machine.machineCode
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Machines</h1>

          <p className="page-description">
            Manage machine master
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Machine
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Machines</p>
          <h2>{machines.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              machines.filter(
                (machine) => machine.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              machines.filter(
                (machine) => machine.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search machine"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Machine Code</th>
              <th>Machine Name</th>
              <th>Machine Type</th>
              <th>Capacity</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredMachines.length === 0 ? (

              <tr>
                <td colSpan="8" className="no-data">
                  No machines found
                </td>
              </tr>

            ) : (

              filteredMachines.map((machine, index) => (

                <tr key={machine.id}>

                  <td>{index + 1}</td>

                  <td>
                    {machine.machineCode || '—'}
                  </td>

                  <td>
                    {machine.machineName}
                  </td>

                  <td>
                    {machine.machineType || '—'}
                  </td>

                  <td>
                    {machine.capacity || '—'}
                  </td>

                  <td>
                    ₹{machine.rate || 0}
                  </td>

                  <td>

                    <span
                      className={
                        machine.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {machine.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteMachine(machine.id)
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
                <h2>Add Machine</h2>
                <p>Enter machine details</p>
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

                <label>Machine Code</label>

                <input
                  type="text"
                  value={machineCode}
                  onChange={(e) =>
                    setMachineCode(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>Machine Name *</label>

                <input
                  type="text"
                  value={machineName}
                  onChange={(e) =>
                    setMachineName(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>Machine Type</label>

              <input
                type="text"
                value={machineType}
                onChange={(e) =>
                  setMachineType(e.target.value)
                }
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>Capacity</label>

                <input
                  type="text"
                  value={capacity}
                  onChange={(e) =>
                    setCapacity(e.target.value)
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

            </div>


            <div className="form-group">

              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
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
                onClick={addMachine}
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

export default Machines;