import React from 'react';

function StatCard({ title, value, changeText, color = 'var(--primary)', icon: Icon }) {
  return (
    <div className="stat-box">
      <div>
        <div className="stat-label">{title}</div>
        <div className="stat-num">{value}</div>
        {changeText && <div style={{ fontSize: '11px', color: 'var(--success)' }}>{changeText}</div>}
      </div>
      {Icon && <Icon size={24} style={{ color }} />}
    </div>
  );
}

export default StatCard;
