import React from 'react';

function Navbar({ user, role }) {
  const getRoleDisplayName = (r) => {
    switch (r) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'System Admin';
      case 'manager': return 'Store Manager';
      default: return 'User';
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
          Active Session Scope: <strong style={{ color: 'var(--primary-hover)' }}>{getRoleDisplayName(role)}</strong>
        </span>
      </div>

      <div className="topbar-right">
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Logged in as: <strong style={{ color: '#fff' }}>{user?.fullName || 'Administrator'}</strong>
        </span>
        <div className="user-avatar" style={{ border: '1.5px solid var(--primary)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyCentert: 'center', background: 'var(--bg-tertiary)', fontWeight: 700, fontSize: '14px' }}>
          👑
        </div>
      </div>
    </header>
  );
}

export default Navbar;
