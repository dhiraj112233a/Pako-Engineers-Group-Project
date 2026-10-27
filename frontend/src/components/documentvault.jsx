import React, { useEffect, useState } from "react";
import "../styles/documentvault.css";
import { deleteDocumentFile, getDocumentFile, saveDocumentFile } from "../services/documentFiles";

const DOCUMENTS_KEY = "pakoLocal.documentMetadata";

function readDocuments() {
  try {
    const stored = localStorage.getItem(DOCUMENTS_KEY);
    const documents = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(documents)) throw new Error("Stored documents are not a list.");
    return documents;
  } catch (error) {
    console.error("Could not read saved document details:", error);
    return [];
  }
}

function writeDocuments(documents) {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
}

function DocumentVault() {
  const [documents, setDocuments] = useState(readDocuments);
  const [fileUrls, setFileUrls] = useState({});
  const [unavailableFiles, setUnavailableFiles] = useState([]);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");

  const [documentName, setDocumentName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    Promise.all(documents.map(async (document) => {
      const file = await getDocumentFile(document.id);
      if (!file) return [document.id, null];
      const url = URL.createObjectURL(file);
      createdUrls.push(url);
      return [document.id, url];
    }))
      .then((entries) => {
        if (cancelled) return;
        setFileUrls(Object.fromEntries(entries.filter(([, url]) => url)));
        setUnavailableFiles(entries.filter(([, url]) => !url).map(([id]) => id));
      })
      .catch((storageError) => {
        if (cancelled) return;
        console.error("Could not load saved document files:", storageError);
        setError("Saved files could not be opened from this browser.");
      });

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [documents]);

  const uploadDocument = async () => {
    if (documentName.trim() === "") {
      setError("Please enter a document name.");
      return;
    }

    if (!file) {
      setError("Please select a file.");
      return;
    }

    const id = Date.now();
    try {
      await saveDocumentFile(id, file);
    } catch (storageError) {
      console.error("Could not store uploaded document:", storageError);
      setError("The file could not be saved in this browser. Check available storage and try again.");
      return;
    }

    const newDocument = {
      id,
      documentName: documentName.trim(),
      documentNumber: documentNumber.trim(),
      category,
      description: description.trim(),
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      status,
      uploadDate: new Date().toISOString().slice(0, 10)
    };

    const updatedDocuments = [...documents, newDocument];
    try {
      writeDocuments(updatedDocuments);
    } catch (storageError) {
      console.error("Could not save document details:", storageError);
      try {
        await deleteDocumentFile(id);
      } catch (cleanupError) {
        console.error("Could not remove the unsaved document file:", cleanupError);
      }
      setError("Document details could not be saved in this browser.");
      return;
    }
    setDocuments(updatedDocuments);

    setDocumentName("");
    setDocumentNumber("");
    setCategory("");
    setDescription("");
    setFile(null);
    setStatus("Active");
    setError("");
    setShowUpload(false);
  };

  const deleteDocument = async (id) => {
    try {
      const updatedDocuments = documents.filter((document) => document.id !== id);
      writeDocuments(updatedDocuments);
      await deleteDocumentFile(id);
      setDocuments(updatedDocuments);
    } catch (storageError) {
      console.error("Could not delete stored document:", storageError);
      try {
        writeDocuments(documents);
      } catch (rollbackError) {
        console.error("Could not restore document details after a failed delete:", rollbackError);
      }
      setError("The file could not be deleted from this browser.");
      return;
    }

    setError("");
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

          <p className="vault-description">Store and manage company documents</p>
        </div>

        <button
          type="button"
          className="upload-document-button"
          onClick={() => { setError(""); setShowUpload(true); }}
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
            type="search"
            className="vault-search"
            placeholder="Search documents..."
            aria-label="Search documents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <p className="vault-storage-note">
          Files are stored in this browser and remain available after refresh on this device. They are not synced between devices.
        </p>
        {error && <p className="vault-error" role="alert">{error}</p>}

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

                        {fileUrls[document.id] ? (
                          <a
                            href={fileUrls[document.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-document-button"
                          >
                            View
                          </a>
                        ) : (
                          <span className="vault-file-missing">
                            {unavailableFiles.includes(document.id) ? "Unavailable" : "Loading"}
                          </span>
                        )}

                        <button
                          type="button"
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