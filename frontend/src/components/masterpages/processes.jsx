import React, { useState } from "react";
import "../../styles/Master.css";

function Processes() {

  const [processes, setProcesses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [processName, setProcessName] = useState("");
  const [processCode, setProcessCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");


  const addProcess = () => {

    if (processName === "") {
      alert("Please enter process name");
      return;
    }

    if (processCode === "") {
      alert("Please enter process code");
      return;
    }

    const newProcess = {
      id: processes.length + 1,
      name: processName,
      code: processCode,
      description: description,
      status: status
    };

    setProcesses([
      ...processes,
      newProcess
    ]);

    setProcessName("");
    setProcessCode("");
    setDescription("");
    setStatus("Active");

    setShowForm(false);
  };


  const deleteProcess = (id) => {

    const newProcesses = processes.filter(
      (process) => process.id !== id
    );

    setProcesses(newProcesses);
  };


  const filteredProcesses = processes.filter(
    (process) =>
      process.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      process.code
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
            Processes
          </h1>

          <p className="page-description">
            Manage your processes
          </p>

        </div>


        <button
          className="add-button"
          onClick={() => setShowForm(true)}
        >
          + Add Process
        </button>

      </div>


      {/* Summary */}

      <div className="summary-container">

        <div className="summary-box">

          <p>
            Total Processes
          </p>

          <h2>
            {processes.length}
          </h2>

        </div>


        <div className="summary-box">

          <p>
            Active
          </p>

          <h2>
            {
              processes.filter(
                (process) => process.status === "Active"
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
              processes.filter(
                (process) => process.status === "Inactive"
              ).length
            }
          </h2>

        </div>

      </div>


      {/* Add Process Form */}

      {showForm && (

        <div className="customer-form">

          <div className="form-header">

            <div>

              <h2>
                Add Process
              </h2>

              <p>
                Enter process details
              </p>

            </div>


            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              X
            </button>

          </div>


          {/* Process Name */}

          <div className="form-group">

            <label>
              Process Name
            </label>

            <input
              type="text"
              placeholder="Enter process name"
              value={processName}
              onChange={(e) =>
                setProcessName(e.target.value)
              }
            />

          </div>


          {/* Process Code */}

          <div className="form-group">

            <label>
              Process Code
            </label>

            <input
              type="text"
              placeholder="Enter process code"
              value={processCode}
              onChange={(e) =>
                setProcessCode(e.target.value)
              }
            />

          </div>


          {/* Description */}

          <div className="form-group">

            <label>
              Description
            </label>

            <input
              type="text"
              placeholder="Enter process description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
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
              onClick={addProcess}
            >
              Save Process
            </button>

          </div>

        </div>

      )}


      {/* Process Table */}

      <div className="customer-table-container">

        <div className="table-top">

          <h2>
            Process List
          </h2>


          <input
            type="text"
            placeholder="Search process"
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
                Process ID
              </th>

              <th>
                Process Name
              </th>

              <th>
                Process Code
              </th>

              <th>
                Description
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

            {filteredProcesses.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-data"
                >
                  No processes found
                </td>

              </tr>

            ) : (

              filteredProcesses.map(
                (process) => (

                  <tr key={process.id}>

                    <td>
                      P-{process.id}
                    </td>

                    <td>
                      {process.name}
                    </td>

                    <td>
                      {process.code}
                    </td>

                    <td>
                      {process.description || "—"}
                    </td>

                    <td>

                      <span
                        className={
                          process.status === "Active"
                            ? "active-status"
                            : "inactive-status"
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

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Processes;