import React, { useState } from 'react';
import "../../styles/Master.css";

function Tools() {
  const [tools, setTools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState('');

  const [toolCode, setToolCode] = useState('');
  const [toolName, setToolName] = useState('');
  const [toolType, setToolType] = useState('');
  const [size, setSize] = useState('');
  const [make, setMake] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Active');

  const addTool = () => {
    if (toolName.trim() === '') {
      alert('Please enter tool name');
      return;
    }

    const newTool = {
      id: Date.now(),
      toolCode,
      toolName,
      toolType,
      size,
      make,
      quantity,
      status
    };

    setTools([...tools, newTool]);
    setToolCode('');
    setToolName('');
    setToolType('');
    setSize('');
    setMake('');
    setQuantity('');
    setStatus('Active');
    setShowForm(false);
  };

  const deleteTool = (id) => {
    setTools(tools.filter((tool) => tool.id !== id));
  };

  const filteredTools = tools.filter(
    (tool) =>
      tool.toolName.toLowerCase().includes(search.toLowerCase()) ||
      tool.toolCode.toLowerCase().includes(search.toLowerCase()) ||
      tool.toolType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">
        <div>
          <p className="small-title">MASTER DATA</p>
          <h1>Tools</h1>
          <p className="page-description">
            Manage tools and equipment
          </p>
        </div>

        <div className="master-buttons">
          <button
            className="view-button"
            onClick={() => setShowTable(true)}
          >
            View Tools
          </button>

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Tool
          </button>
        </div>
      </div>

      <div className="summary-container">
        <div className="summary-box">
          <p>Total Tools</p>
          <h2>{tools.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {tools.filter((tool) => tool.status === 'Active').length}
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {tools.filter((tool) => tool.status === 'Inactive').length}
          </h2>
        </div>
      </div>

      {showTable && (
        <div className="popup-overlay">
          <div className="table-popup">

            <div className="popup-table-header">
              <div>
                <h2>Tool List</h2>
                <p>View and manage tools</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowTable(false)}
              >
                X
              </button>
            </div>

            <div className="table-top">
              <h2>Tools</h2>

              <input
                type="text"
                className="search-input"
                placeholder="Search tool"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="customer-table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tool Code</th>
                    <th>Tool Name</th>
                    <th>Tool Type</th>
                    <th>Size</th>
                    <th>Make</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTools.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">
                        No tools found
                      </td>
                    </tr>
                  ) : (
                    filteredTools.map((tool, index) => (
                      <tr key={tool.id}>
                        <td>{index + 1}</td>
                        <td>{tool.toolCode || '—'}</td>
                        <td>{tool.toolName}</td>
                        <td>{tool.toolType || '—'}</td>
                        <td>{tool.size || '—'}</td>
                        <td>{tool.make || '—'}</td>
                        <td>{tool.quantity || 0}</td>

                        <td>
                          <span
                            className={
                              tool.status === 'Active'
                                ? 'active-status'
                                : 'inactive-status'
                            }
                          >
                            {tool.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="delete-button"
                            onClick={() => deleteTool(tool.id)}
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
        </div>
      )}

      {showForm && (
        <div className="popup-overlay">
          <div className="customer-form">

            <div className="form-header">
              <div>
                <h2>Add Tool</h2>
                <p>Enter tool details</p>
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
                <label>Tool Code</label>
                <input
                  type="text"
                  value={toolCode}
                  onChange={(e) => setToolCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Tool Name *</label>
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tool Type</label>
              <select
                value={toolType}
                onChange={(e) => setToolType(e.target.value)}
              >
                <option value="">Select Tool Type</option>
                <option value="Cutting Tool">Cutting Tool</option>
                <option value="Drilling Tool">Drilling Tool</option>
                <option value="Milling Tool">Milling Tool</option>
                <option value="Turning Tool">Turning Tool</option>
                <option value="Grinding Tool">Grinding Tool</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Size</label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Make</label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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

              <button className="save-button" onClick={addTool}>
                Create
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Tools;