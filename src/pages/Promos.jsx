import React, { useState } from 'react';
import { Tag, Search, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

function PromosPage({
  promos,
  stores = [],
  onCreatePromo,
  onUpdatePromo,
  onTogglePromoActive,
  onDeletePromo
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState('');
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [displayOnHome, setDisplayOnHome] = useState(false);
  const [active, setActive] = useState(true);
  const [storeId, setStoreId] = useState('');

  // Edit states
  const [editingPromoId, setEditingPromoId] = useState(null);

  const resetForm = () => {
    setCode('');
    setTitle('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(0);
    setMaxDiscount('');
    setMinOrderValue(0);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setUsageLimit('');
    setBannerImage('');
    setDisplayOnHome(false);
    setActive(true);
    setStoreId('');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreatePromo({
      code,
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      minOrderValue: Number(minOrderValue),
      startDate,
      endDate: endDate || undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      bannerImage,
      displayOnHome,
      active,
      storeId: storeId || undefined
    });
    resetForm();
    setShowCreateModal(false);
  };

  const handleEditClick = (p) => {
    setEditingPromoId(p._id);
    setCode(p.code);
    setTitle(p.title);
    setDescription(p.description);
    setDiscountType(p.discountType);
    setDiscountValue(p.discountValue);
    setMaxDiscount(p.maxDiscount || '');
    setMinOrderValue(p.minOrderValue || 0);
    setStartDate(p.startDate ? p.startDate.split('T')[0] : '');
    setEndDate(p.endDate ? p.endDate.split('T')[0] : '');
    setUsageLimit(p.usageLimit || '');
    setBannerImage(p.bannerImage || '');
    setDisplayOnHome(p.displayOnHome || false);
    setActive(p.active);
    setStoreId(p.storeId?._id || p.storeId || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdatePromo(editingPromoId, {
      code,
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      minOrderValue: Number(minOrderValue),
      startDate,
      endDate: endDate || undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      bannerImage,
      displayOnHome,
      active,
      storeId: storeId || null
    });
    resetForm();
    setShowEditModal(false);
  };

  const filteredPromos = promos.filter(p =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card-panel animate-slide-in">
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="card-title"><Tag size={20} /> Promo Codes & Banner Promotions</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="admin-input"
              placeholder="Search promo codes..."
              style={{ paddingLeft: 36 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="admin-btn" onClick={() => { resetForm(); setShowCreateModal(true); }}>
            <Plus size={16} /> Create Promo Code
          </button>
        </div>
      </div>

      {/* Promos Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Campaign Info</th>
              <th>Applicable Store</th>
              <th>Discount Value</th>
              <th>Display Home Banner</th>
              <th>Usage Stats</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromos.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 20 }}>
                  No promo codes defined yet.
                </td>
              </tr>
            ) : (
              filteredPromos.map(p => {
                const isExpired = p.endDate && new Date(p.endDate) < new Date();
                const discountDisplay = p.discountType === 'percentage' ? `${p.discountValue}%` : `₹${p.discountValue}`;
                return (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 14 }}>{p.code}</td>
                    <td>
                      <div>
                        <strong>{p.title}</strong>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                          {p.description}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {p.storeId?.name || (typeof p.storeId === 'object' && p.storeId !== null ? p.storeId.name : p.storeId) || 'Global (All Stores)'}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {discountDisplay}
                      {p.minOrderValue > 0 && (
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 400 }}>
                          Min: ₹{p.minOrderValue}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`status-indicator status-${p.displayOnHome ? 'active' : 'blocked'}`}>
                        {p.displayOnHome ? 'YES' : 'NO'}
                      </span>
                      {p.bannerImage && (
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', marginLeft: 8, display: 'inline-block', textDecoration: 'underline' }}>
                          <a href={p.bannerImage} target="_blank" rel="noopener noreferrer">View Banner</a>
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {p.usedCount} used
                        {p.usageLimit ? ` / ${p.usageLimit} max` : ' (Unlimited)'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 11 }}>
                        Start: {p.startDate ? p.startDate.split('T')[0] : 'N/A'}
                        {p.endDate && (
                          <div style={{ color: isExpired ? '#ef4444' : 'var(--text-secondary)', marginTop: 2 }}>
                            End: {p.endDate.split('T')[0]} {isExpired && '(Expired)'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-indicator status-${p.active && !isExpired ? 'active' : 'blocked'}`}>
                        {p.active && !isExpired ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '6px 10px' }}
                          title="Edit Details"
                          onClick={() => handleEditClick(p)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{
                            padding: '6px 10px',
                            backgroundColor: p.active ? 'rgba(239, 68, 68, 0.1)' : 'var(--success-light)',
                            color: p.active ? 'var(--danger)' : 'var(--success)',
                            borderColor: p.active ? 'var(--danger)' : 'var(--success)'
                          }}
                          title={p.active ? 'Deactivate Code' : 'Activate Code'}
                          onClick={() => onTogglePromoActive(p._id)}
                        >
                          {p.active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 10px' }}
                          title="Delete Code Permanently"
                          onClick={() => onDeletePromo(p._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
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
          <div className="card-panel animate-slide-in" style={{ width: '100%', maxWidth: '580px', margin: 20, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="card-title"><Plus size={18} /> Create New Promo Offer</h3>
            
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Promo Code *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. PAW20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Offer Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Get 20% Off"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Offer Description *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Valid on first service booking on the app"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Store (Optional - blank for Global)</label>
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="admin-input"
                    style={{ background: 'var(--bg-secondary)', color: '#fff' }}
                  >
                    <option value="">Global (Valid at all stores)</option>
                    {stores.map(st => (
                      <option key={st._id} value={st._id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="admin-input"
                    style={{ background: 'var(--bg-secondary)', color: '#fff' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Price (₹)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Discount Value *</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Min Order Value (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Max Discount (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="Optional limit"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Start Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>End Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Usage Limit</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="e.g. 100 uses"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Banner Image URL (optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://images.unsplash.com/..."
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, gridColumn: 'span 2', marginTop: 10 }}>
                  <input
                    type="checkbox"
                    id="displayOnHome"
                    checked={displayOnHome}
                    onChange={(e) => setDisplayOnHome(e.target.checked)}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <label htmlFor="displayOnHome" style={{ fontSize: '13px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                    Display as Banner on Customer App Home Screen
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  Create Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
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
          <div className="card-panel animate-slide-in" style={{ width: '100%', maxWidth: '580px', margin: 20, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="card-title"><Edit2 size={18} /> Modify Promo Offer Details</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Promo Code *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Offer Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Offer Description *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Store (Optional - blank for Global)</label>
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="admin-input"
                    style={{ background: 'var(--bg-secondary)', color: '#fff' }}
                  >
                    <option value="">Global (Valid at all stores)</option>
                    {stores.map(st => (
                      <option key={st._id} value={st._id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="admin-input"
                    style={{ background: 'var(--bg-secondary)', color: '#fff' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Price (₹)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Discount Value *</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Min Order Value (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Max Discount (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Start Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>End Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Usage Limit</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Banner Image URL (optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, gridColumn: 'span 2', marginTop: 10 }}>
                  <input
                    type="checkbox"
                    id="editDisplayOnHome"
                    checked={displayOnHome}
                    onChange={(e) => setDisplayOnHome(e.target.checked)}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <label htmlFor="editDisplayOnHome" style={{ fontSize: '13px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                    Display as Banner on Customer App Home Screen
                  </label>
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

export default PromosPage;
