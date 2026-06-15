import React from 'react';
import { Settings } from 'lucide-react';

function PermissionsPage() {
  return (
    <div className="card-panel animate-slide-in">
      <h2 className="card-title"><Settings size={20} /> RBAC Permission Scope Assignment</h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Configure route guards and API query filters per user security scope.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ border: '1px solid var(--border-color)' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.1)' }}>
              <th>Module / Operations</th>
              <th style={{ textAlign: 'center' }}>Super Admin</th>
              <th style={{ textAlign: 'center' }}>System Admin</th>
              <th style={{ textAlign: 'center' }}>Store Owner</th>
              <th style={{ textAlign: 'center' }}>Customer / User</th>
            </tr>
          </thead>
          <tbody>
            {[
              { module: 'Global Audit Log Access', roles: [true, false, false, false] },
              { module: 'Add/Remove Sub-Admins', roles: [true, false, false, false] },
              { module: 'Block/Delete General Users', roles: [true, true, false, false] },
              { module: 'Approve/Reject Store Onboarding', roles: [true, true, false, false] },
              { module: 'Register/Edit Store Catalog', roles: [false, false, true, false] },
              { module: 'Confirm/Complete Store Bookings', roles: [false, false, true, false] },
              { module: 'Book Service / Manage Own Profile', roles: [false, false, false, true] }
            ].map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{row.module}</td>
                {row.roles.map((allowed, rIdx) => (
                  <td key={rIdx} style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={allowed} 
                      readOnly 
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PermissionsPage;
