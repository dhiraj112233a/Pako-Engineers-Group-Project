import React, { useEffect, useState } from 'react';
import ErpTablePage from '../ErpTablePage';
import { GST_SLAB_KEY, GST_SLAB_SEED, useStore } from '../../store/erpstore';
import '../../styles/gstsetting.css';

const emptySlab = () => ({ name: '', cgst: '0', sgst: '0', igst: '0' });
const formatRate = (rate) => `${Number(rate).toFixed(2)}%`;

export default function GSTSettings() {
  const [slabs, setSlabs] = useStore(GST_SLAB_KEY, GST_SLAB_SEED);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptySlab);
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

  const openForm = (slab = null) => {
    setDraft(slab
      ? { name: slab.name, cgst: String(slab.cgst), sgst: String(slab.sgst), igst: String(slab.igst) }
      : emptySlab());
    setError('');
    setEditing(slab || { id: null });
  };

  const save = (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    const rates = {
      cgst: Number(draft.cgst),
      sgst: Number(draft.sgst),
      igst: Number(draft.igst),
    };
    const hasSplitRates = rates.cgst > 0 || rates.sgst > 0;
    const hasIgst = rates.igst > 0;
    if (!name) {
      setError('Name is required.');
      return;
    }
    if ([draft.cgst, draft.sgst, draft.igst].some((rate) => String(rate).trim() === '')) {
      setError('All tax rates are required.');
      return;
    }
    if (Object.values(rates).some((rate) => !Number.isFinite(rate) || rate < 0 || rate > 100)) {
      setError('Tax rates must be between 0 and 100.');
      return;
    }
    if (hasSplitRates && (rates.cgst === 0 || rates.sgst === 0)) {
      setError('Enter both CGST and SGST, or enter IGST only.');
      return;
    }
    if (hasIgst && hasSplitRates) {
      setError('A slab cannot combine CGST/SGST and IGST.');
      return;
    }
    if (slabs.some((slab) => slab.id !== editing?.id && slab.name.trim().toLowerCase() === name.toLowerCase())) {
      setError('A GST slab with this name already exists.');
      return;
    }

    if (editing?.id) {
      setSlabs((list) => list.map((slab) => (
        slab.id === editing.id ? { ...slab, name, ...rates } : slab
      )));
    } else {
      setSlabs((list) => [
        ...list,
        { id: Math.max(0, ...list.map((slab) => Number(slab.id) || 0)) + 1, name, ...rates },
      ]);
    }
    closeForm();
  };

  const remove = (slab) => {
    if (window.confirm(`Delete ${slab.name}?`)) {
      setSlabs((list) => list.filter((item) => item.id !== slab.id));
    }
  };

  const rows = [...slabs].sort((a, b) => a.id - b.id);
  const columns = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Name', render: (slab) => <b>{slab.name}</b> },
    { key: 'cgst', label: 'CGST %', num: true, render: (slab) => formatRate(slab.cgst) },
    { key: 'sgst', label: 'SGST %', num: true, render: (slab) => formatRate(slab.sgst) },
    { key: 'total', label: 'Total GST', num: true, render: (slab) => formatRate(Number(slab.cgst) + Number(slab.sgst) + Number(slab.igst)) },
    { key: 'igst', label: 'IGST %', num: true, render: (slab) => formatRate(slab.igst) },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (slab) => (
        <div className="gst-slab-actions">
          <button className="erp-link-btn" onClick={() => openForm(slab)}>Edit</button>
          <button className="erp-link-btn gst-slab-delete" onClick={() => remove(slab)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ErpTablePage
        title="GST Setting" icon="fa-percent"
        subtitle="Manage GST tax slabs for customer orders."
        action="Add Slab" onAction={() => openForm()}
        stats={[{ label: 'GST Slabs', value: slabs.length, tone: 'blue' }]}
        columns={columns} rows={rows}
        empty="No GST slabs yet — click + Add Slab"
      />
      {editing && (
        <div className="erp-overlay gst-setting-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <form className="erp-modal gst-setting-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>{editing.id ? 'Edit GST Slab' : 'Add GST Slab'}</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={closeForm}>×</button>
            </div>
            <div className="erp-form-grid">
              <label className="wide">
                <span>Name *</span>
                <input autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. GST 18%" />
              </label>
              {['cgst', 'sgst', 'igst'].map((key) => (
                <label key={key}>
                  <span>{key.toUpperCase()} % *</span>
                  <input type="number" min="0" max="100" step="any" required value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
                </label>
              ))}
            </div>
            <div className="gst-setting-summary">
              Total GST (CGST + SGST): <b>{formatRate(Number(draft.cgst || 0) + Number(draft.sgst || 0))}</b>
              {' · '}IGST: <b>{formatRate(draft.igst || 0)}</b>
            </div>
            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="erp-btn">{editing.id ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}