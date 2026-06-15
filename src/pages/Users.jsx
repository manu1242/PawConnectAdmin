import React, { useState } from 'react';
import { Users, Search, Plus, Lock, Unlock, Trash2, Edit2, Mail } from 'lucide-react';

function UsersPage({ 
  users, 
  userSearch, 
  setUserSearch, 
  onToggleBlock, 
  onDeleteUser, 
  onEditUser,
  onResendCredentials,
  onCreateOwner, 
  isSuperAdmin 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newStoreName, setNewStoreName] = useState('');

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('user');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateOwner({
      fullName: newOwnerName,
      email: newOwnerEmail,
      phone: newOwnerPhone,
      storeName: newStoreName
    });
    setNewOwnerName('');
    setNewOwnerEmail('');
    setNewOwnerPhone('');
    setNewStoreName('');
    setShowCreateModal(false);
  };

  const handleEditClick = (u) => {
    setEditingUserId(u._id);
    setEditName(u.fullName);
    setEditEmail(u.email);
    setEditPhone(u.phone || '');
    setEditRole(u.role);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditUser(editingUserId, {
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      role: editRole
    });
    setShowEditModal(false);
  };

  // Filter users based on query
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.phone && u.phone.includes(userSearch)) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="card-panel animate-slide-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="card-title"><Users size={20} /> User Accounts Directory</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search users..." 
              style={{ paddingLeft: 36 }}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <button className="admin-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Register Store Owner
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Account Status</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 20 }}>
                  No user records found.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const isBlocked = u.lockUntil && new Date(u.lockUntil) > new Date();
                const status = isBlocked ? 'deactivated' : 'active';
                return (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 700 }}>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`status-indicator status-${status === 'active' ? 'active' : 'blocked'}`}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        
                        {/* Edit User Button */}
                        <button 
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '6px 10px' }}
                          title="Edit User Details"
                          onClick={() => handleEditClick(u)}
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Toggle Activate / Deactivate Button */}
                        <button 
                          className={`admin-btn ${isBlocked ? 'admin-btn-secondary' : ''}`}
                          style={{ 
                            padding: '6px 10px',
                            backgroundColor: isBlocked ? 'var(--success)' : 'rgba(239, 68, 68, 0.1)',
                            color: isBlocked ? '#fff' : 'var(--danger)'
                          }}
                          title={isBlocked ? 'Activate User Account' : 'Deactivate User Account'}
                          onClick={() => onToggleBlock(u._id)}
                        >
                          {isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>

                        {/* Resend Mail Button (only for Store Owners/Managers) */}
                        {u.role === 'manager' && (
                          <button 
                            className="admin-btn admin-btn-secondary"
                            style={{ 
                              padding: '6px 10px',
                              borderColor: 'var(--primary)',
                              color: 'var(--primary-hover)'
                            }}
                            title="Resend Welcome Email with New Password"
                            onClick={() => onResendCredentials(u._id)}
                          >
                            <Mail size={14} />
                          </button>
                        )}
                        
                        {/* Delete User Button (SuperAdmin Only) */}
                        {isSuperAdmin && (
                          <button 
                            className="admin-btn admin-btn-danger" 
                            style={{ padding: '6px 10px' }}
                            title="Delete User permanently"
                            onClick={() => onDeleteUser(u._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE OWNER MODAL */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card-panel animate-slide-in" style={{ width: '100%', maxWidth: '480px', margin: 20 }}>
            <h3 className="card-title">Register Store Owner & Credentials</h3>
            
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Store Owner Full Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Ramesh Chandra" 
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
                  <input 
                    type="email" 
                    className="admin-input" 
                    placeholder="ramesh@pawconnect.in" 
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone number</label>
                  <input 
                    type="tel" 
                    className="admin-input" 
                    placeholder="e.g. 9876543210" 
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Assigned Store Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. Happy Pets Sanctuary" 
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card-panel animate-slide-in" style={{ width: '100%', maxWidth: '480px', margin: 20 }}>
            <h3 className="card-title">Modify User Record details</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
                  <input 
                    type="email" 
                    className="admin-input" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone Number</label>
                  <input 
                    type="tel" 
                    className="admin-input" 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Platform Scope Role</label>
                  <select 
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <option value="user">General User (Customer)</option>
                    <option value="manager">Store Manager (Owner)</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
