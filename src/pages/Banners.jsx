import React, { useState } from 'react';
import { Image, Search, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

function BannersPage({
  banners = [],
  onCreateBanner,
  onUpdateBanner,
  onToggleBannerActive,
  onDeleteBanner
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Edit states
  const [editingBannerId, setEditingBannerId] = useState(null);

  const resetForm = () => {
    setTitle('');
    setImageUrl('');
    setLinkUrl('');
    setDisplayOrder(0);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    onCreateBanner({
      title,
      imageUrl,
      linkUrl: linkUrl || undefined,
      displayOrder: Number(displayOrder)
    });
    resetForm();
    setShowCreateModal(false);
  };

  const handleEditClick = (b) => {
    setEditingBannerId(b._id);
    setTitle(b.title);
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl || '');
    setDisplayOrder(b.displayOrder || 0);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateBanner(editingBannerId, {
      title,
      imageUrl,
      linkUrl: linkUrl || undefined,
      displayOrder: Number(displayOrder)
    });
    resetForm();
    setShowEditModal(false);
  };

  const filteredBanners = banners.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = banners.filter(b => b.active).length;

  return (
    <div className="card-panel animate-slide-in">
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image size={22} /> Home Screen Banner Manager
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Manage banners displaying on the customer app home screen. 
            <strong style={{ color: activeCount >= 5 ? 'var(--warning)' : 'var(--success)', marginLeft: 8 }}>
              Active: {activeCount}/5 Banners
            </strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="admin-input"
              placeholder="Search banners..."
              style={{ paddingLeft: 36 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="admin-btn" onClick={() => { resetForm(); setShowCreateModal(true); }}>
            <Plus size={16} /> Create Banner
          </button>
        </div>
      </div>

      {/* Grid of Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filteredBanners.length === 0 ? (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-tertiary)', padding: 40 }}>
            No banners defined yet. Click "Create Banner" to get started!
          </div>
        ) : (
          filteredBanners.map(b => (
            <div 
              key={b._id} 
              style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: 14, 
                border: `1.5px solid ${b.active ? 'var(--primary)' : 'var(--border-color)'}`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image Container */}
              <div style={{ height: 160, width: '100%', background: '#000', position: 'relative' }}>
                <img 
                  src={b.imageUrl} 
                  alt={b.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: b.active ? 1 : 0.4 }} 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';
                  }}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    padding: '4px 10px', 
                    borderRadius: 20, 
                    fontSize: 11, 
                    fontWeight: 700, 
                    background: b.active ? 'rgba(74, 222, 128, 0.9)' : 'rgba(239, 68, 68, 0.9)', 
                    color: '#000' 
                  }}
                >
                  {b.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <span 
                  style={{ 
                    position: 'absolute', 
                    bottom: 12, 
                    left: 12, 
                    padding: '2px 8px', 
                    borderRadius: 4, 
                    fontSize: 11, 
                    fontWeight: 700, 
                    background: 'rgba(0,0,0,0.7)', 
                    color: '#fff' 
                  }}
                >
                  Order: {b.displayOrder}
                </span>
              </div>

              {/* Info Container */}
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{b.title}</h4>
                  {b.linkUrl && (
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, wordBreak: 'break-all' }}>
                      Link: <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{b.linkUrl}</a>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    style={{ flex: 1, padding: '8px 10px', fontSize: 12 }}
                    onClick={() => handleEditClick(b)}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    className="admin-btn" 
                    style={{ 
                      flex: 1.2, 
                      padding: '8px 10px', 
                      fontSize: 12,
                      background: b.active ? 'rgba(239, 68, 68, 0.1)' : 'var(--success-light)',
                      color: b.active ? 'var(--danger)' : 'var(--success)',
                      borderColor: b.active ? 'var(--danger)' : 'var(--success)'
                    }}
                    onClick={() => onToggleBannerActive(b._id)}
                  >
                    {b.active ? <XCircle size={12} /> : <CheckCircle size={12} />} {b.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="admin-btn admin-btn-danger" 
                    style={{ padding: '8px 10px' }}
                    onClick={() => onDeleteBanner(b._id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
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
          <div className="card-panel animate-slide-in" style={{ width: '100%', maxWidth: '480px', margin: 20 }}>
            <h3 className="card-title"><Plus size={18} /> Add New Home Banner</h3>
            
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Banner Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Grooming Special Offer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Image URL *</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Link/Action URL (Optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Display Order (lowest first)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  Add Banner
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
          <div className="card-panel animate-slide-in" style={{ width: '100%', maxWidth: '480px', margin: 20 }}>
            <h3 className="card-title"><Edit2 size={18} /> Modify Banner Details</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Banner Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Image URL *</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Link/Action URL (Optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
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

export default BannersPage;
