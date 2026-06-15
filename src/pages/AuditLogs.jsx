import React from 'react';
import { ShieldCheck } from 'lucide-react';

function AuditLogsPage({ logs }) {
  return (
    <div className="card-panel animate-slide-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="card-title"><ShieldCheck size={20} style={{ color: 'var(--danger)' }} /> Audit Security Logs</h2>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>System operation tracking (Immutable log entries)</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action Code</th>
              <th>Target Component</th>
              <th>IP Origin</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 20 }}>
                  No security audit events recorded.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log._id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {new Date(log.timestamp || log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.actor}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: log.action.includes('BLOCK') || log.action.includes('SUSPEND') || log.action.includes('REJECT') ? 'var(--warning)' : 'var(--info)'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.target}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>{log.ip || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogsPage;
