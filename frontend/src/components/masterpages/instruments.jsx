import React, { useState } from 'react';
import "../../styles/Master.css";

function Instruments() {
  const [instruments, setInstruments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const [instrumentName, setInstrumentName] = useState('');
  const [instrumentCode, setInstrumentCode] = useState('');
  const [range, setRange] = useState('');
  const [leastCount, setLeastCount] = useState('');
  const [make, setMake] = useState('');
  const [calibrationDate, setCalibrationDate] = useState('');
  const [status, setStatus] = useState('Active');

  const addInstrument = () => {
    if (instrumentName.trim() === '') {
      alert('Please enter instrument name');
      return;
    }

    const newInstrument = {
      id: Date.now(),
      instrumentName,
      instrumentCode,
      range,
      leastCount,
      make,
      calibrationDate,
      status
    };

    setInstruments([...instruments, newInstrument]);

    setInstrumentName('');
    setInstrumentCode('');
    setRange('');
    setLeastCount('');
    setMake('');
    setCalibrationDate('');
    setStatus('Active');

    setShowForm(false);
  };

  const deleteInstrument = (id) => {
    setInstruments(
      instruments.filter((instrument) => instrument.id !== id)
    );
  };

  const filteredInstruments = instruments.filter(
    (instrument) =>
      instrument.instrumentName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      instrument.instrumentCode
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="customer-page">

      <div className="customer-header">

        <div>
          <p className="small-title">MASTER DATA</p>

          <h1>Instruments</h1>

          <p className="page-description">
            Manage measuring instruments
          </p>
        </div>

        <div className="master-buttons">

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Instrument
          </button>

        </div>

      </div>


      <div className="summary-container">

        <div className="summary-box">
          <p>Total Instruments</p>
          <h2>{instruments.length}</h2>
        </div>

        <div className="summary-box">
          <p>Active</p>
          <h2>
            {
              instruments.filter(
                (instrument) => instrument.status === 'Active'
              ).length
            }
          </h2>
        </div>

        <div className="summary-box">
          <p>Inactive</p>
          <h2>
            {
              instruments.filter(
                (instrument) => instrument.status === 'Inactive'
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="table-top">

        <input
          type="text"
          className="search-input"
          placeholder="Search instrument"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      <div className="customer-table-container">

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Instrument Code</th>
              <th>Instrument Name</th>
              <th>Range</th>
              <th>Least Count</th>
              <th>Make</th>
              <th>Calibration Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredInstruments.length === 0 ? (

              <tr>
                <td colSpan="9" className="no-data">
                  No instruments found
                </td>
              </tr>

            ) : (

              filteredInstruments.map((instrument, index) => (

                <tr key={instrument.id}>

                  <td>{index + 1}</td>

                  <td>
                    {instrument.instrumentCode || '—'}
                  </td>

                  <td>
                    {instrument.instrumentName}
                  </td>

                  <td>
                    {instrument.range || '—'}
                  </td>

                  <td>
                    {instrument.leastCount || '—'}
                  </td>

                  <td>
                    {instrument.make || '—'}
                  </td>

                  <td>
                    {instrument.calibrationDate || '—'}
                  </td>

                  <td>

                    <span
                      className={
                        instrument.status === 'Active'
                          ? 'active-status'
                          : 'inactive-status'
                      }
                    >
                      {instrument.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteInstrument(instrument.id)
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
                <h2>Add Instrument</h2>
                <p>Enter instrument details</p>
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

                <label>Instrument Code</label>

                <input
                  type="text"
                  value={instrumentCode}
                  onChange={(e) =>
                    setInstrumentCode(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>Instrument Name *</label>

                <input
                  type="text"
                  value={instrumentName}
                  onChange={(e) =>
                    setInstrumentName(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>Range</label>

                <input
                  type="text"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                />

              </div>

              <div className="form-group">

                <label>Least Count</label>

                <input
                  type="text"
                  value={leastCount}
                  onChange={(e) =>
                    setLeastCount(e.target.value)
                  }
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

              <label>Calibration Date</label>

              <input
                type="date"
                value={calibrationDate}
                onChange={(e) =>
                  setCalibrationDate(e.target.value)
                }
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

              <button
                className="save-button"
                onClick={addInstrument}
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

export default Instruments;