import React from 'react';
import StatCard from '../components/StatCard';
import { 
  Users, 
  Store, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Filter 
} from 'lucide-react';

function Dashboard({ 
  stats, 
  dateRange, 
  setDateRange, 
  pendingStores, 
  onApproveStore, 
  onRejectStore 
}) {
  return (
    <div className="animate-slide-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800 }}>Master Analytics Control</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Global platform metrics, registrations, and transactions</p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-stats">
        <StatCard 
          title="Total Registered Users" 
          value={stats.totalUsers} 
          changeText="+12% vs last month" 
          icon={Users} 
          color="var(--primary)" 
        />
        <StatCard 
          title="Active Partner Stores" 
          value={stats.totalStores} 
          changeText="+4 registered this week" 
          icon={Store} 
          color="var(--info)" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingStoresCount} 
          changeText="Requires action" 
          icon={Clock} 
          color="var(--warning)" 
        />
        <StatCard 
          title="System Bookings" 
          value={stats.totalBookings} 
          changeText="96% Completion Rate" 
          icon={Calendar} 
          color="var(--success)" 
        />
        <StatCard 
          title="Platform Earnings" 
          value={`₹${stats.totalRevenue}`} 
          changeText="Stable payout cycle" 
          icon={DollarSign} 
          color="var(--primary)" 
        />
      </div>

      {/* Charts section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }}>
        <div className="card-panel">
          <h3 className="card-title">
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> User Growth & Registration Volume
          </h3>
          <div className="chart-container">
            {[
              { label: 'Jun 07', val: 30 },
              { label: 'Jun 08', val: 45 },
              { label: 'Jun 09', val: 60 },
              { label: 'Jun 10', val: 50 },
              { label: 'Jun 11', val: 80 },
              { label: 'Jun 12', val: 120 },
              { label: 'Jun 13', val: stats.totalUsers || 145 }
            ].map((bar, i) => (
              <div key={i} className="chart-bar-wrapper">
                <div className="chart-bar" style={{ height: `${Math.min(100, (bar.val / 200) * 100)}%`, backgroundColor: 'var(--primary)' }}>
                  <span className="chart-bar-value">{bar.val}</span>
                </div>
                <span className="chart-bar-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-panel">
          <h3 className="card-title">
            <Calendar size={18} style={{ color: 'var(--success)' }} /> Booking Frequencies & Volume
          </h3>
          <div className="chart-container">
            {[
              { label: 'Mon', val: 15 },
              { label: 'Tue', val: 24 },
              { label: 'Wed', val: 32 },
              { label: 'Thu', val: 28 },
              { label: 'Fri', val: 45 },
              { label: 'Sat', val: 78 },
              { label: 'Sun', val: stats.totalBookings || 92 }
            ].map((bar, i) => (
              <div key={i} className="chart-bar-wrapper">
                <div className="chart-bar" style={{ height: `${Math.min(100, (bar.val / 150) * 100)}%`, backgroundColor: 'var(--success)' }}>
                  <span className="chart-bar-value">{bar.val}</span>
                </div>
                <span className="chart-bar-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Store Onboarding Approvals list */}
      <div className="card-panel">
        <h3 className="card-title"><Clock size={18} style={{ color: 'var(--warning)' }} /> Pending Store Approval Queue</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Owner ID / Contact</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingStores.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 20 }}>
                    No pending store registrations require approval at this time.
                  </td>
                </tr>
              ) : (
                pendingStores.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td>{s.ownerId?.fullName || s.ownerDetails?.fullName || s.ownerDetails?.name || (typeof s.ownerId === 'string' ? s.ownerId : 'N/A')}</td>
                    <td>{s.address}</td>
                    <td>{s.phone}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button 
                          className="admin-btn" 
                          style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--success)' }}
                          onClick={() => onApproveStore(s._id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => onRejectStore(s._id)}
                        >
                          Reject
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
    </div>
  );
}

export default Dashboard;
