import React, { useEffect, useState } from 'react';
import { VENDOR_TERMS_KEY, useStore } from '../../store/erpstore';
import '../../styles/vendorandtc.css';

const emptyTerm = () => ({ appliesTo: 'Vendor PO', title: '', content: '', isDefault: false });

export default function VendorTerms() {
  const [terms, setTerms] = useStore(VENDOR_TERMS_KEY, []);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyTerm);
  const [error, setError] = useState('');

  const closeForm = () => {
    setEditing(null);
    setError('');
  };

  useEffect(() => {
    if (!editing) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setEditing(null);
        setError('');
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [editing]);

  const openForm = (term = null) => {
    setDraft(term ? { ...term } : emptyTerm());
    setError('');
    setEditing(term || { id: null });
  };

  const save = (event) => {
    event.preventDefault();
    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }
    if (terms.some((term) => (
      term.id !== editing?.id &&
      term.appliesTo === draft.appliesTo &&
      term.title.trim().toLowerCase() === title.toLowerCase()
    ))) {
      setError('A term with this title already exists for Vendor PO.');
      return;
    }

    const savedTerm = { ...draft, title, content };
    if (editing?.id) {
      setTerms((list) => list.map((term) => (
        term.id === editing.id ? { ...term, ...savedTerm } : term
      )).map((term) => (
        savedTerm.isDefault && term.id !== editing.id ? { ...term, isDefault: false } : term
      )));
    } else {
      setTerms((list) => [
        ...list.map((term) => savedTerm.isDefault ? { ...term, isDefault: false } : term),
        { id: Math.max(0, ...list.map((term) => Number(term.id) || 0)) + 1, ...savedTerm },
      ]);
    }
    closeForm();
  };

  const remove = (term) => {
    if (window.confirm(`Delete "${term.title}"?`)) {
      setTerms((list) => list.filter((item) => item.id !== term.id));
    }
  };

  const filteredTerms = [...terms]
    .filter((term) => `${term.title} ${term.content} ${term.appliesTo}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.title.localeCompare(b.title));

  return (
    <div className="vendor-terms-page">
      <header className="vendor-terms-header">
        <div className="vendor-terms-heading">
          <span className="vendor-terms-icon"><i className="fas fa-file-lines" /></span>
          <div>
            <h1>Vendor T&amp;C</h1>
            <p>Reusable terms &amp; conditions for vendor POs</p>
          </div>
        </div>
        <div className="vendor-terms-header-actions">
          <span className="vendor-terms-count"><i className="fas fa-trash" /> {terms.length} Saved</span>
          <button className="erp-btn" onClick={() => openForm()}>+ Add Term</button>
        </div>
      </header>

      <div className="vendor-terms-search">
        <i className="fas fa-magnifying-glass" />
        <input
          type="search"
          placeholder="Search terms..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search vendor terms"
        />
      </div>

      <section className="vendor-terms-list" aria-label="Saved vendor terms">
        {filteredTerms.length ? filteredTerms.map((term) => (
          <article className={`vendor-term-card${term.isDefault ? ' is-default' : ''}`} key={term.id}>
            <div className="vendor-term-card-body">
              <h2>{term.title}</h2>
              <div className="vendor-term-badges">
                <span className="vendor-term-scope">{term.appliesTo}</span>
                {term.isDefault && <span className="vendor-term-default">Default</span>}
              </div>
              <p>{term.content}</p>
            </div>
            <div className="vendor-term-actions">
              <button type="button" aria-label={`Edit ${term.title}`} onClick={() => openForm(term)}>
                <i className="fas fa-pen" />
              </button>
              <button type="button" className="delete" aria-label={`Delete ${term.title}`} onClick={() => remove(term)}>
                <i className="fas fa-trash" />
              </button>
            </div>
          </article>
        )) : (
          <div className="vendor-terms-empty">
            {search ? 'No terms match your search.' : 'No vendor terms saved yet. Click + Add Term to create one.'}
          </div>
        )}
      </section>

      {editing && (
        <div className="erp-overlay vendor-terms-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <form className="erp-modal vendor-terms-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>{editing.id ? 'Edit Vendor Term' : 'Add Vendor Term'}</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={closeForm}>×</button>
            </div>

            <div className="vendor-terms-form-fields">
              <label>
                <span>Applies to *</span>
                <select value={draft.appliesTo} onChange={(event) => setDraft({ ...draft, appliesTo: event.target.value })}>
                  <option value="Vendor PO">Vendor PO</option>
                </select>
              </label>
              <label>
                <span>Title *</span>
                <input
                  autoFocus
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  placeholder="e.g. Standard Payment Terms"
                />
              </label>
              <label>
                <span>Content *</span>
                <textarea
                  rows="5"
                  value={draft.content}
                  onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                  placeholder="Terms & conditions text..."
                />
              </label>
            </div>

            <label className="vendor-terms-default-check">
              <input
                type="checkbox"
                checked={draft.isDefault}
                onChange={(event) => setDraft({ ...draft, isDefault: event.target.checked })}
              />
              Set as default for new Vendor POs
            </label>
            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="erp-btn">{editing.id ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}