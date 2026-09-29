import React, { useState } from "react";
import "../../styles/Master.css";

function Machines() {

  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [machineType, setMachineType] = useState("");
  const [status, setStatus] = useState("Active");


  const addMachine = () => {

    if (machineName === "") {
      alert("Please enter machine name");
      return;
    }

    if (machineCode === "") {
      alert("Please enter machine code");
      return;
    }

    const newMachine = {
      id: machines.length + 1,
      name: machineName,
      code: machineCode,
      type: machineType,
      status: status
    };

    setMachines([
      ...machines,
      newMachine
    ]);

    setMachineName("");
    setMachineCode("");
    setMachineType("");
    setStatus("Active");

    setShowForm(false);
  };


  const deleteMachine = (id) => {

    const newMachines = machines.filter(
      (machine) => machine.id !== id
    );

    setMachines(newMachines);
  };


  const filteredMachines = machines.filter(
    (machine) =>
      machine.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      machine.code
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
            Machines
          </h1>

          <p className="page-description">
            Manage your machines
          </p>

        </div>


        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Machine
        </button>

      </div>


      {/* Summary */}

      <div className="summary-container">

        <div className="summary-box">

          <p>
            Total Machines
          </p>

          <h2>
            {machines.length}
          </h2>

        </div>


        <div className="summary-box">

          <p>
            Active
          </p>

          <h2>
            {
              machines.filter(
                (machine) => machine.status === "Active"
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
              machines.filter(
                (machine) => machine.status === "Inactive"
              ).length
            }
          </h2>

        </div>

      </div>


      {/* Add Machine Form */}

      {showForm && (

        <div className="customer-form">

          <div className="form-header">

            <div>

              <h2>
                Add Machine
              </h2>

              <p>
                Enter machine details
              </p>

            </div>


            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              X
            </button>

          </div>


          {/* Machine Name */}

          <div className="form-group">

            <label>
              Machine Name
            </label>

            <input
              type="text"
              placeholder="Enter machine name"
              value={machineName}
              onChange={(e) =>
                setMachineName(e.target.value)
              }
            />

          </div>


          {/* Machine Code */}

          <div className="form-group">

            <label>
              Machine Code
            </label>

            <input
              type="text"
              placeholder="Enter machine code"
              value={machineCode}
              onChange={(e) =>
                setMachineCode(e.target.value)
              }
            />

          </div>


          {/* Machine Type */}

          <div className="form-group">

            <label>
              Machine Type
            </label>

            <input
              type="text"
              placeholder="Enter machine type"
              value={machineType}
              onChange={(e) =>
                setMachineType(e.target.value)
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
              onClick={addMachine}
            >
              Save Machine
            </button>

          </div>

        </div>

      )}


      {/* Machine Table */}

      <div className="customer-table-container">

        <div className="table-top">

          <h2>
            Machine List
          </h2>


          <input
            type="text"
            placeholder="Search machine"
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
                Machine ID
              </th>

              <th>
                Machine Name
              </th>

              <th>
                Machine Code
              </th>

              <th>
                Machine Type
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

            {filteredMachines.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >
                  No machines found
                </td>

              </tr>

            ) : (

              filteredMachines.map(
                (machine) => (

                  <tr key={machine.id}>

                    <td>
                      M-{machine.id}
                    </td>

                    <td>
                      {machine.name}
                    </td>

                    <td>
                      {machine.code}
                    </td>

                    <td>
                      {machine.type || "—"}
                    </td>

                    <td>

                      <span
                        className={
                          machine.status === "Active"
                            ? "active-status"
                            : "inactive-status"
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

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Machines;