import React from 'react';
import { 
  Activity, 
  Users, 
  Store, 
  Calendar, 
  ShieldCheck, 
  Settings, 
  LogOut 
} from 'lucide-react';

function Sidebar({ activeTab, setActiveTab, onLogout, userRole, onRoleSwitch }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'stores', name: 'Store Control', icon: Store },
    { id: 'bookings', name: 'Bookings Manager', icon: Calendar },
    { id: 'audit', name: 'Audit Logs', icon: ShieldCheck },
    { id: 'permissions', name: 'Roles & Permissions', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>🛡️</span> PawConnect Control
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <IconComponent size={18} /> {item.name}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="menu-item" 
          onClick={onLogout}
          style={{ width: '100%', color: 'var(--danger)', display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
