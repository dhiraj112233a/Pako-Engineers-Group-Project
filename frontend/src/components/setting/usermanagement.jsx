import React, { useEffect, useMemo, useState } from 'react';
import { USERS_KEY, useStore } from '../../store/erpstore';
import '../../styles/usermanagement.css';

const MODULES = [
  'Dashboard',
  'Customers',
  'Vendors',
  'Items',
  'Transactions',
  'Production',
  'Stock',
  'Reports',
  'Settings',
];
const ROLES = ['Admin', 'Manager', 'Purchase', 'Production', 'Operator'];
const emptyUser = () => ({
  name: '',
  email: '',
  mobile: '',
  role: 'Operator',
  status: 'Active',
  position: '',
  department: '',
  loginAllowed: false,
  permissions: MODULES.reduce((all, module) => ({ ...all, [module]: false }), {}),
});
const permissionsForRole = (role) => Object.fromEntries(
  MODULES.map((module) => [
    module,
    role === 'Admin' || role === 'Manager' || (
      (role === 'Purchase' && ['Dashboard', 'Customers', 'Vendors', 'Items', 'Transactions', 'Stock', 'Reports'].includes(module)) ||
      (role === 'Production' && ['Dashboard', 'Items', 'Transactions', 'Production', 'Stock'].includes(module)) ||
      (role === 'Operator' && ['Dashboard', 'Production', 'Stock'].includes(module))
    ),
  ]),
);

export default function UserManagement() {
  const [users, setUsers] = useStore(USERS_KEY, []);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyUser);
  const [permissionsUser, setPermissionsUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [error, setError] = useState('');

  const closeForm = () => {
    setEditing(null);
    setError('');
  };

  useEffect(() => {
    if (!editing && !permissionsUser) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setEditing(null);
        setPermissionsUser(null);
        setError('');
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [editing, permissionsUser]);

  const openForm = (user = null) => {
    setDraft(user
      ? { ...emptyUser(), ...user, permissions: { ...permissionsForRole(user.role), ...user.permissions } }
      : emptyUser());
    setError('');
    setEditing(user || { id: null });
  };

  const save = (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    const email = draft.email.trim();
    if (!name) {
      setError('Name is required.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (email && users.some((user) => (
      user.id !== editing?.id && user.email?.toLowerCase() === email.toLowerCase()
    ))) {
      setError('A user with this email address already exists.');
      return;
    }
    const user = {
      ...draft,
      name,
      email,
      mobile: draft.mobile.trim(),
      position: draft.position.trim(),
      department: draft.department.trim(),
    };
    if (editing?.id) {
      setUsers((list) => list.map((item) => item.id === editing.id ? { ...item, ...user } : item));
    } else {
      setUsers((list) => [{ id: Date.now(), ...user }, ...list]);
    }
    closeForm();
  };

  const changeRole = (role) => {
    setDraft((current) => ({ ...current, role, permissions: permissionsForRole(role) }));
  };

  const openPermissions = (user) => {
    setPermissionsUser(user);
    setPermissions({ ...permissionsForRole(user.role), ...user.permissions });
  };

  const savePermissions = (event) => {
    event.preventDefault();
    setUsers((list) => list.map((user) => (
      user.id === permissionsUser.id ? { ...user, permissions } : user
    )));
    setPermissionsUser(null);
  };

  const toggleStatus = (user) => {
    setUsers((list) => list.map((item) => (
      item.id === user.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item
    )));
  };

  const remove = (user) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      setUsers((list) => list.filter((item) => item.id !== user.id));
    }
  };

  const filteredUsers = useMemo(() => users.filter((user) => (
    `${user.name} ${user.role} ${user.email} ${user.mobile} ${user.position} ${user.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )), [users, search]);

  return (
    <div className="user-management-page">
      <header className="user-management-header">
        <div className="user-management-heading">
          <span className="user-management-icon"><i className="fas fa-users-gear" /></span>
          <div>
            <h1>User Management</h1>
            <p>Manage users, roles &amp; per-module permissions</p>
          </div>
        </div>
        <div className="user-management-header-actions">
          <span className="user-management-help" title="Permissions are saved locally for this app. They do not configure external authentication.">
            <i className="fas fa-circle-info" /> How it works
          </span>
          <button type="button" className="erp-btn" onClick={() => openForm()}>+ Add User</button>
        </div>
      </header>

      <label className="user-management-search">
        <i className="fas fa-magnifying-glass" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users..."
          aria-label="Search users"
        />
      </label>

      <div className="user-management-table-wrap">
        <table className="user-management-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                  {(user.position || user.department) && (
                    <small>{[user.position, user.department].filter(Boolean).join(' · ')}</small>
                  )}
                  {user.loginAllowed && <small className="user-management-login-flag">Portal login allowed</small>}
                </td>
                <td><span className="user-management-role">{user.role}</span></td>
                <td>
                  {user.email && <span>{user.email}</span>}
                  {user.mobile && <small>{user.mobile}</small>}
                  {!user.email && !user.mobile && '—'}
                </td>
                <td><span className={`user-management-status ${user.status === 'Active' ? 'active' : 'inactive'}`}>{user.status}</span></td>
                <td>
                  <div className="user-management-row-actions">
                    <button type="button" aria-label={`Edit ${user.name}`} title="Edit user" onClick={() => openForm(user)}>
                      <i className="fas fa-pen" />
                    </button>
                    <button type="button" aria-label={`Manage permissions for ${user.name}`} title="Module permissions" onClick={() => openPermissions(user)}>
                      <i className="fas fa-key" />
                    </button>
                    <button type="button" aria-label={`${user.status === 'Active' ? 'Deactivate' : 'Activate'} ${user.name}`} title={user.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(user)}>
                      <i className={`fas ${user.status === 'Active' ? 'fa-ban' : 'fa-circle-check'}`} />
                    </button>
                    <button type="button" className="delete" aria-label={`Delete ${user.name}`} title="Delete user" onClick={() => remove(user)}>
                      <i className="fas fa-xmark" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td className="user-management-empty" colSpan="5">{search ? 'No users match your search.' : 'No users yet. Click + Add User to create one.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="erp-overlay user-management-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <form className="erp-modal user-management-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>{editing.id ? 'Edit User' : 'Add User'}</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={closeForm}>×</button>
            </div>
            <div className="user-management-form-grid">
              <label className="user-management-full">
                <span>Name *</span>
                <input autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
              </label>
              <label>
                <span>Mobile</span>
                <input type="tel" value={draft.mobile} onChange={(event) => setDraft({ ...draft, mobile: event.target.value })} />
              </label>
              <label>
                <span>Role</span>
                <select value={draft.role} onChange={(event) => changeRole(event.target.value)}>
                  {ROLES.map((role) => <option key={role}>{role}</option>)}
                </select>
              </label>
              <label>
                <span>Status</span>
                <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
              <label>
                <span>Position</span>
                <input value={draft.position} onChange={(event) => setDraft({ ...draft, position: event.target.value })} />
              </label>
              <label>
                <span>Department</span>
                <input value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })} />
              </label>
            </div>
            <label className="user-management-login-check">
              <input type="checkbox" checked={draft.loginAllowed} onChange={(event) => setDraft({ ...draft, loginAllowed: event.target.checked })} />
              Allow login to portal
            </label>
            <p className="user-management-note">Login access is stored as a user setting; authentication is not configured by this form.</p>
            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="erp-btn">{editing.id ? 'Save' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {permissionsUser && (
        <div className="erp-overlay user-management-overlay" onMouseDown={(event) => event.target === event.currentTarget && setPermissionsUser(null)}>
          <form className="erp-modal user-permissions-modal" onSubmit={savePermissions}>
            <div className="erp-modal-head">
              <h3>Module Permissions — {permissionsUser.name}</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={() => setPermissionsUser(null)}>×</button>
            </div>
            <p className="user-management-note">Choose which sections this user should be assigned access to.</p>
            <div className="user-permissions-list">
              {MODULES.map((module) => (
                <label key={module}>
                  <span>{module}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(permissions[module])}
                    onChange={(event) => setPermissions({ ...permissions, [module]: event.target.checked })}
                  />
                </label>
              ))}
            </div>
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={() => setPermissionsUser(null)}>Cancel</button>
              <button type="submit" className="erp-btn">Save Permissions</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}