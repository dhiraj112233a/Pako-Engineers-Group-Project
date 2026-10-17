import React, { useState } from "react";
import "../styles/DocumentVault.css";

function DocumentVault() {
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");

  const [documentName, setDocumentName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Active");

  const uploadDocument = () => {
    if (documentName.trim() === "") {
      alert("Please enter document name");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    const newDocument = {
      id: Date.now(),
      documentName,
      documentNumber,
      category,
      description,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      status,
      uploadDate: new Date().toLocaleDateString()
    };

    setDocuments([...documents, newDocument]);

    setDocumentName("");
    setDocumentNumber("");
    setCategory("");
    setDescription("");
    setFile(null);
    setStatus("Active");
    setShowUpload(false);
  };

  const deleteDocument = (id) => {
    const documentToDelete = documents.find(
      (document) => document.id === id
    );

    if (documentToDelete) {
      URL.revokeObjectURL(documentToDelete.fileUrl);
    }

    setDocuments(
      documents.filter((document) => document.id !== id)
    );
  };

  const filteredDocuments = documents.filter(
    (document) =>
      document.documentName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      document.documentNumber
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      document.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="vault-page">

      <div className="vault-header">

        <div>
          <p className="vault-small-title">DOCUMENT MANAGEMENT</p>

          <h1>Document Vault</h1>

          <p className="vault-description">
            Store and manage company documents
          </p>
        </div>

        <button
          className="upload-document-button"
          onClick={() => setShowUpload(true)}
        >
          + Upload Document
        </button>

      </div>

      <div className="vault-summary">

        <div className="vault-summary-card">
          <p>Total Documents</p>
          <h2>{documents.length}</h2>
        </div>

        <div className="vault-summary-card">
          <p>Active Documents</p>
          <h2>
            {
              documents.filter(
                (document) => document.status === "Active"
              ).length
            }
          </h2>
        </div>

        <div className="vault-summary-card">
          <p>Quality Documents</p>
          <h2>
            {
              documents.filter(
                (document) => document.category === "Quality"
              ).length
            }
          </h2>
        </div>

        <div className="vault-summary-card">
          <p>Drawings</p>
          <h2>
            {
              documents.filter(
                (document) => document.category === "Drawing"
              ).length
            }
          </h2>
        </div>

      </div>

      <div className="vault-table-card">

        <div className="vault-table-top">

          <div>
            <h2>Documents</h2>
            <p>All uploaded company documents</p>
          </div>

          <input
            type="text"
            className="vault-search"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="vault-table-wrapper">

          <table>

            <thead>
              <tr>
                <th>#</th>
                <th>Document No.</th>
                <th>Document Name</th>
                <th>Category</th>
                <th>File</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDocuments.length === 0 ? (

                <tr>
                  <td colSpan="8" className="vault-no-data">
                    No documents uploaded
                  </td>
                </tr>

              ) : (

                filteredDocuments.map((document, index) => (

                  <tr key={document.id}>

                    <td>{index + 1}</td>

                    <td>
                      {document.documentNumber || "—"}
                    </td>

                    <td>
                      <div className="document-name">
                        {document.documentName}
                      </div>
                    </td>

                    <td>
                      <span className="category-badge">
                        {document.category || "Other"}
                      </span>
                    </td>

                    <td>{document.fileName}</td>

                    <td>{document.uploadDate}</td>

                    <td>
                      <span
                        className={
                          document.status === "Active"
                            ? "vault-active"
                            : "vault-inactive"
                        }
                      >
                        {document.status}
                      </span>
                    </td>

                    <td>

                      <div className="vault-actions">

                        <a
                          href={document.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="view-document-button"
                        >
                          View
                        </a>

                        <button
                          className="delete-document-button"
                          onClick={() =>
                            deleteDocument(document.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {showUpload && (

        <div className="vault-overlay">

          <div className="vault-form">

            <div className="vault-form-header">

              <div>
                <h2>Upload Document</h2>
                <p>Add a document to the vault</p>
              </div>

              <button
                className="vault-close"
                onClick={() => setShowUpload(false)}
              >
                X
              </button>

            </div>

            <div className="vault-form-row">

              <div className="vault-form-group">

                <label>Document Name *</label>

                <input
                  type="text"
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) =>
                    setDocumentName(e.target.value)
                  }
                />

              </div>

              <div className="vault-form-group">

                <label>Document Number</label>

                <input
                  type="text"
                  placeholder="Enter document number"
                  value={documentNumber}
                  onChange={(e) =>
                    setDocumentNumber(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="vault-form-group">

              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >

                <option value="">
                  Select Category
                </option>

                <option value="Drawing">
                  Drawing
                </option>

                <option value="Quality">
                  Quality
                </option>

                <option value="Production">
                  Production
                </option>

                <option value="Purchase">
                  Purchase
                </option>

                <option value="Inspection">
                  Inspection
                </option>

                <option value="Certificate">
                  Certificate
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div className="vault-form-group">

              <label>Description</label>

              <textarea
                placeholder="Enter document description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>

            <div className="vault-form-group">

              <label>Select File *</label>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />

            </div>

            <div className="vault-form-group">

              <label>Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            <div className="vault-form-buttons">

              <button
                className="vault-cancel"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </button>

              <button
                className="vault-save"
                onClick={uploadDocument}
              >
                Upload Document
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default DocumentVault;