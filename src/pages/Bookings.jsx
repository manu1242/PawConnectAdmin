import React, { useState } from 'react';
import { Calendar, Download, Search } from 'lucide-react';

function BookingsPage({ bookings, bookingFilter, setBookingFilter, onExport }) {
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b => {
    // Search matching
    const matchesSearch = 
      (b.bookingId && b.bookingId.toLowerCase().includes(search.toLowerCase())) ||
      (b.serviceName && b.serviceName.toLowerCase().includes(search.toLowerCase())) ||
      (b.userId?.fullName && b.userId.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (b.storeId?.name && b.storeId.name.toLowerCase().includes(search.toLowerCase())) ||
      (b.petDetails?.name && b.petDetails.name.toLowerCase().includes(search.toLowerCase()));

    // Status matching
    if (bookingFilter === 'all') return matchesSearch;
    return b.status === bookingFilter && matchesSearch;
  });

  return (
    <div className="card-panel animate-slide-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="card-title"><Calendar size={20} /> Booking ledger database</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search ID, customer, pet..." 
              style={{ paddingLeft: 36, width: '220px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13px'
            }}
          >
            <option value="all">All Booking Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button className="admin-btn" onClick={() => onExport(filtered)}>
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Pet Details</th>
              <th>Store Partner</th>
              <th>Service</th>
              <th>Appointment Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 20 }}>
                  No bookings found matching query.
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr key={b._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-hover)' }}>
                    {b.bookingId || b._id.substring(0, 8).toUpperCase()}
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.userId?.fullName || 'N/A'}</td>
                  <td>
                    <div>{b.petDetails?.name || 'N/A'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                      {b.petDetails?.breed} | {b.petDetails?.age}
                    </div>
                  </td>
                  <td>{b.storeId?.name || 'N/A'}</td>
                  <td>{b.serviceName}</td>
                  <td>
                    <div>{b.date}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{b.timeSlot}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{b.price}</td>
                  <td>
                    <span className={`role-badge role-${b.status === 'completed' ? 'manager' : b.status === 'confirmed' ? 'admin' : b.status === 'pending' ? 'user' : 'superadmin'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsPage;
