import React, { useState, useEffect } from 'react';
import api from './services/api';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import StoresPage from './pages/Stores';
import BookingsPage from './pages/Bookings';
import AuditLogsPage from './pages/AuditLogs';
import PermissionsPage from './pages/Permissions';

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('admin_user') || 'null'));
  
  // Tab states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('7days');
  const userRole = user?.role || 'superadmin';

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');

  // Real Database Data
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Loaders & Alerts
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Auto-clear alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Load database statistics and collections
  const loadDatabaseData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await api.get('/auth/users');
      if (usersRes.data.success && usersRes.data.data?.users) {
        setUsers(usersRes.data.data.users);
      }

      // Fetch stores
      const storesRes = await api.get('/stores/admin');
      if (storesRes.data.success && storesRes.data.data?.stores) {
        setStores(storesRes.data.data.stores);
      }

      // Fetch bookings
      const bookingsRes = await api.get('/bookings/all-bookings');
      if (bookingsRes.data.success && bookingsRes.data.data?.bookings) {
        setBookings(bookingsRes.data.data.bookings);
      }

      // Fetch audit logs
      const logsRes = await api.get('/auth/audit-logs');
      if (logsRes.data.success && logsRes.data.data?.logs) {
        setAuditLogs(logsRes.data.data.logs);
      }
    } catch (err) {
      console.error('Failed to load real data from backend:', err);
      showAlert('danger', 'Error connecting to backend database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, [token]);

  const showAlert = (type, text) => {
    setAlert({ type, text });
  };

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    showAlert('success', 'Authenticated successfully! Loading platform logs...');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
    showAlert('info', 'Logged out from Control Console.');
  };

  // Action: Toggle Block Status
  const handleToggleBlock = async (userId) => {
    try {
      const res = await api.patch(`/auth/users/${userId}/status`);
      if (res.data.success) {
        showAlert('success', res.data.message || 'User status updated!');
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', 'Failed to toggle user status.');
    }
  };

  // Action: Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await api.delete(`/auth/users/${userId}`);
      if (res.data.success) {
        showAlert('success', 'User removed from platform.');
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', 'Failed to delete user.');
    }
  };

  // Action: Update Store Status
  const handleUpdateStoreStatus = async (storeId, nextStatus, reason = '', adminNotes = '') => {
    try {
      const res = await api.patch(`/stores/admin/${storeId}/status`, { 
        status: nextStatus,
        reason: reason || undefined,
        adminNotes: adminNotes || undefined
      });
      if (res.data.success) {
        showAlert('success', `Store status changed to ${nextStatus}!`);
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', err.response?.data?.message || 'Failed to update store status.');
    }
  };

  // Action: Review Store Document
  const handleReviewDocument = async (storeId, documentType, status, note = '') => {
    try {
      const res = await api.patch(`/stores/admin/${storeId}/documents/${documentType}`, {
        status,
        note
      });
      if (res.data.success) {
        showAlert('success', `Document ${documentType} marked as ${status}!`);
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', err.response?.data?.message || 'Failed to review document.');
    }
  };

  // Action: Toggle Store Featured Status
  const handleToggleFeatured = async (storeId, isFeatured) => {
    try {
      const res = await api.patch(`/stores/admin/${storeId}/featured`, { featured: !isFeatured });
      if (res.data.success) {
        showAlert('success', `Store featured status updated!`);
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', err.response?.data?.message || 'Failed to update featured status.');
    }
  };

  // Action: Delete Store
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to permanently delete this store?')) return;
    try {
      const res = await api.delete(`/stores/admin/${storeId}`);
      if (res.data.success) {
        showAlert('success', 'Store deleted successfully.');
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', 'Failed to delete store.');
    }
  };

  const generateCompliantPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "@$!%*?&";
    
    const uChar = uppercase[Math.floor(Math.random() * uppercase.length)];
    const lChar = lowercase[Math.floor(Math.random() * lowercase.length)];
    const numChar = numbers[Math.floor(Math.random() * numbers.length)];
    const specChar = special[Math.floor(Math.random() * special.length)];
    
    let rest = "";
    const all = uppercase + lowercase + numbers + special;
    for (let i = 0; i < 8; i++) {
      rest += all[Math.floor(Math.random() * all.length)];
    }
    
    return `Paw${uChar}${lChar}${numChar}${specChar}${rest}`;
  };

  // Action: Create Store Owner (Manager)
  const handleCreateOwner = async (ownerData) => {
    try {
      const compliantPassword = generateCompliantPassword();
      // 1. Register owner account
      const res = await api.post('/auth/register', {
        fullName: ownerData.fullName,
        email: ownerData.email,
        phone: ownerData.phone,
        password: compliantPassword,
        role: 'manager'
      });

      if (res.data.success) {
        showAlert('success', `Store Owner account created for ${ownerData.fullName}! Welcome email sent with their unique password.`);
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', err.response?.data?.message || 'Failed to register store owner.');
    }
  };

  // Action: Edit User Details
  const handleEditUser = async (userId, updatedData) => {
    try {
      const res = await api.put(`/auth/users/${userId}`, updatedData);
      if (res.data.success) {
        showAlert('success', 'User details updated successfully!');
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', err.response?.data?.message || 'Failed to update user details.');
    }
  };

  // Action: Resend Welcome Credentials (with new temporary password)
  const handleResendCredentials = async (userId) => {
    try {
      showAlert('info', 'Regenerating password and sending welcome email...');
      const res = await api.post(`/auth/users/${userId}/resend-credentials`);
      if (res.data.success) {
        showAlert('success', res.data.message || 'Welcome credentials sent!');
        loadDatabaseData();
      }
    } catch (err) {
      console.error(err);
      showAlert('danger', err.response?.data?.message || 'Failed to resend credentials.');
    }
  };

  // Action: Export Bookings
  const handleExport = (filteredBookings) => {
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + ['Booking ID,Customer,Pet,Service,Date,Time,Price,Status,Store'].join(',') + '\n'
      + filteredBookings.map(b => [
          b.bookingId || b._id.substring(0, 8).toUpperCase(),
          b.userId?.fullName || 'N/A',
          b.petDetails?.name || 'N/A',
          b.serviceName,
          b.date,
          b.timeSlot,
          b.price,
          b.status,
          b.storeId?.name || 'N/A'
        ].join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PawConnect_Bookings_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert('success', 'Bookings CSV report generated successfully!');
  };

  // Computed platform statistics
  const computeStats = () => {
    const pendingStoresCount = stores.filter(s => s.status === 'pending').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.price || 0), 0);

    return {
      totalUsers: users.length,
      totalStores: stores.length,
      pendingStoresCount,
      totalBookings: bookings.length,
      totalRevenue
    };
  };

  // Authentication Guard
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const stats = computeStats();
  const pendingStores = stores.filter(s => s.status === 'pending');

  return (
    <div className="admin-shell">
      
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        userRole={userRole}
      />

      {/* Main Work Area */}
      <div className="main-wrapper">
        
        {/* Header Navigation Profile bar */}
        <Navbar user={user} role={userRole} />

        {/* Global Action Loader and Banner notifications */}
        {alert && (
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '40px',
            zIndex: 100,
            background: alert.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
            border: `1.5px solid ${alert.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            color: alert.type === 'success' ? 'var(--success)' : 'var(--danger)',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
          }}>
            {alert.text}
          </div>
        )}

        {/* Main Pages router */}
        <main className="content-body">
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
              Syncing live data from backend...
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard 
              stats={stats}
              dateRange={dateRange}
              setDateRange={setDateRange}
              pendingStores={pendingStores}
              onApproveStore={(id) => handleUpdateStoreStatus(id, 'approved')}
              onRejectStore={(id) => {
                const reason = window.prompt('Please enter the reason for rejection:');
                if (reason === null) return;
                if (!reason.trim() || reason.trim().length < 3) {
                  window.alert('A valid reason (minimum 3 characters) is required to reject a store.');
                  return;
                }
                handleUpdateStoreStatus(id, 'rejected', reason.trim());
              }}
            />
          )}

          {activeTab === 'users' && (
            <UsersPage 
              users={users}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              onToggleBlock={handleToggleBlock}
              onDeleteUser={handleDeleteUser}
              onEditUser={handleEditUser}
              onResendCredentials={handleResendCredentials}
              onCreateOwner={handleCreateOwner}
              isSuperAdmin={userRole === 'admin' || userRole === 'superadmin'}
            />
          )}

          {activeTab === 'stores' && (
            <StoresPage 
              stores={stores}
              storeSearch={storeSearch}
              setStoreSearch={setStoreSearch}
              onUpdateStatus={handleUpdateStoreStatus}
              onDeleteStore={handleDeleteStore}
              onReviewDocument={handleReviewDocument}
              onToggleFeatured={handleToggleFeatured}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsPage 
              bookings={bookings}
              bookingFilter={bookingFilter}
              setBookingFilter={setBookingFilter}
              onExport={handleExport}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogsPage logs={auditLogs} />
          )}

          {activeTab === 'permissions' && (
            <PermissionsPage />
          )}
        </main>

      </div>
    </div>
  );
}

export default App;
