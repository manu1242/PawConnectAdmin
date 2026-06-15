import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Trash2, 
  Eye, 
  MapPin, 
  Phone, 
  RefreshCw, 
  Mail, 
  Calendar, 
  FileText, 
  Check, 
  X, 
  ShieldAlert, 
  Award, 
  Globe, 
  MessageSquare,
  Users,
  Briefcase,
  Clock,
  CreditCard,
  Grid
} from 'lucide-react';

function StoresPage({ 
  stores, 
  storeSearch, 
  setStoreSearch, 
  onUpdateStatus, 
  onDeleteStore,
  onReviewDocument,
  onToggleFeatured
}) {
  const [selectedStore, setSelectedStore] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, documents, services

  // Find the fresh selected store details from the main list if updated
  const store = selectedStore ? (stores.find(s => s._id === selectedStore._id) || selectedStore) : null;

  const handleStatusChange = (status) => {
    if (!store) return;
    if (status === 'rejected' || status === 'suspended') {
      const reason = window.prompt(`Please enter the reason for ${status}:`);
      if (reason === null) return; // cancelled
      if (!reason.trim() || reason.trim().length < 3) {
        window.alert(`A valid reason (minimum 3 characters) is required to set status to ${status}.`);
        return;
      }
      onUpdateStatus(store._id, status, reason.trim());
    } else {
      onUpdateStatus(store._id, status);
    }
  };

  const handleDocumentReviewPrompt = (docType, newStatus) => {
    if (!store) return;
    let note = '';
    if (newStatus === 'rejected') {
      note = window.prompt('Please enter the rejection note for this document (e.g. "Image blurry", "Expired certificate"):');
      if (note === null) return; // cancelled
    }
    onReviewDocument(store._id, docType, newStatus, note);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return '#10b981'; // Green
      case 'rejected':
      case 'suspended':
        return '#ef4444'; // Red
      case 'pending':
      default:
        return '#f59e0b'; // Amber
    }
  };

  const formatDocName = (docKey) => {
    switch (docKey) {
      case 'idProof': return 'Government ID Proof';
      case 'storePhoto': return 'Store Exterior Photo';
      case 'businessLicense': return 'Business Registration License';
      case 'certifications': return 'Professional Certifications';
      default: return docKey;
    }
  };

  return (
    <div className="card-panel animate-slide-in" style={{ padding: 20 }}>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Store size={22} style={{ color: 'var(--primary)' }} /> Partner Store Directory
        </h2>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            className="admin-input" 
            placeholder="Search store name, city, phone..." 
            style={{ paddingLeft: 36, width: 280 }}
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: store ? '1fr 480px' : '1fr', gap: 24 }}>
        
        {/* Table List of Registered Partner Stores */}
        <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: '12px', padding: 4, border: '1px solid var(--border-color)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Owner Name</th>
                <th>Location City</th>
                <th>Phone</th>
                <th>Listing</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 30 }}>
                    No partner stores found matching criteria.
                  </td>
                </tr>
              ) : (
                stores.map(s => {
                  const isStoreActive = s.status === 'approved';
                  return (
                    <tr 
                      key={s._id} 
                      style={{ 
                        cursor: 'pointer', 
                        backgroundColor: store?._id === s._id ? 'rgba(255, 107, 53, 0.08)' : 'transparent' 
                      }} 
                      onClick={() => {
                        setSelectedStore(s);
                        setActiveTab('overview');
                      }}
                    >
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {s.name}
                        {s.isFeatured && (
                          <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--primary)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                            Featured
                          </span>
                        )}
                      </td>
                      <td>{s.ownerDetails?.fullName || s.ownerDetails?.name || 'Unassigned'}</td>
                      <td>{s.addressDetails?.city || 'N/A'}</td>
                      <td>{s.phone}</td>
                      <td>
                        <span style={{ fontSize: 11, textTransform: 'capitalize', color: s.listingType === 'featured' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                          {s.listingType || 'normal'}
                        </span>
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: 11, 
                            fontWeight: 700, 
                            padding: '4px 8px', 
                            borderRadius: 6, 
                            background: getStatusColor(s.status) + '15', 
                            color: getStatusColor(s.status),
                            border: `1px solid ${getStatusColor(s.status)}30`,
                            textTransform: 'uppercase'
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button 
                            className="admin-btn admin-btn-secondary" 
                            style={{ padding: '6px 8px', display: 'flex', alignItems: 'center' }}
                            title="Inspect Store"
                            onClick={() => {
                              setSelectedStore(s);
                              setActiveTab('overview');
                            }}
                          >
                            <Eye size={13} />
                          </button>
                          
                          {isStoreActive ? (
                            <button 
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '5px 8px', fontSize: '11px', color: '#ef4444' }}
                              onClick={() => {
                                const reason = window.prompt('Enter reason for suspension:');
                                if (reason) onUpdateStatus(s._id, 'suspended', reason);
                              }}
                            >
                              Suspend
                            </button>
                          ) : (
                            <button 
                              className="admin-btn"
                              style={{ padding: '5px 8px', fontSize: '11px', backgroundColor: 'var(--success)', color: '#fff' }}
                              onClick={() => onUpdateStatus(s._id, 'approved')}
                            >
                              Approve
                            </button>
                          )}

                          <button 
                            className="admin-btn admin-btn-danger" 
                            style={{ padding: '6px 8px' }}
                            title="Delete Store"
                            onClick={() => onDeleteStore(s._id)}
                          >
                            <Trash2 size={13} />
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

        {/* Selected Store Inspector Side Panel */}
        {store && (
          <div className="card-panel animate-slide-in" style={{ margin: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: '85vh', overflowY: 'auto', padding: 20 }}>
            {/* Header controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: '#fff', margin: 0 }}>Store Inspector</h3>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0 0' }}>ID: {store._id}</p>
              </div>
              <button 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setSelectedStore(null)}
              >
                <X size={16} /> Close
              </button>
            </div>

            {/* Quick Status Bar */}
            <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 10, border: '1px solid var(--border-color)', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Status:</span>
                <span 
                  style={{ 
                    fontSize: 12, 
                    fontWeight: 800, 
                    padding: '3px 8px', 
                    borderRadius: 6, 
                    background: getStatusColor(store.status) + '20', 
                    color: getStatusColor(store.status),
                    border: `1px solid ${getStatusColor(store.status)}40`,
                    textTransform: 'uppercase'
                  }}
                >
                  {store.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {store.status !== 'approved' && (
                  <button 
                    className="admin-btn" 
                    style={{ flex: 1, padding: '8px 10px', fontSize: 12, backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    onClick={() => handleStatusChange('approved')}
                  >
                    <Check size={14} /> Approve Store
                  </button>
                )}
                {store.status !== 'rejected' && (
                  <button 
                    className="admin-btn admin-btn-danger" 
                    style={{ flex: 1, padding: '8px 10px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    onClick={() => handleStatusChange('rejected')}
                  >
                    <X size={14} /> Reject
                  </button>
                )}
                {store.status === 'approved' && (
                  <button 
                    className="admin-btn admin-btn-secondary" 
                    style={{ flex: 1, padding: '8px 10px', fontSize: 12, color: '#ef4444', borderColor: '#ef444430', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    onClick={() => handleStatusChange('suspended')}
                  >
                    <ShieldAlert size={14} /> Suspend
                  </button>
                )}
                <button 
                  className="admin-btn admin-btn-secondary" 
                  style={{ padding: '8px 12px', fontSize: 12, borderColor: store.isFeatured ? 'var(--primary)' : 'var(--border-color)', color: store.isFeatured ? 'var(--primary)' : 'var(--text-secondary)' }}
                  onClick={() => onToggleFeatured(store._id, store.isFeatured)}
                >
                  {store.isFeatured ? '★ Featured' : '☆ Feature'}
                </button>
              </div>

              {store.rejectionReason && (
                <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, fontSize: 12, color: '#ef4444' }}>
                  <strong>Rejection/Suspension Reason:</strong> {store.rejectionReason}
                </div>
              )}
              {store.adminNotes && (
                <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <strong>Admin Notes:</strong> {store.adminNotes}
                </div>
              )}
            </div>

            {/* Inspector Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: 20 }}>
              {['overview', 'documents', 'services'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === tab ? '#fff' : 'var(--text-tertiary)',
                    padding: '8px 4px',
                    fontWeight: activeTab === tab ? 700 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'services' ? 'Services & Ops' : tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Store Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Images */}
                <div style={{ position: 'relative' }}>
                  <img 
                    src={store.bannerImage || store.banner || 'https://via.placeholder.com/600x200?text=No+Banner'} 
                    alt="Banner" 
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, background: '#111' }}
                  />
                  <img 
                    src={store.logo || 'https://via.placeholder.com/80?text=No+Logo'} 
                    alt="Logo" 
                    style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid var(--bg-secondary)', position: 'absolute', bottom: -20, left: 16, objectFit: 'cover', background: '#111' }}
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontWeight: 800, fontSize: 18, color: '#fff', margin: '0 0 4px 0' }}>{store.name}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                    "{store.description || 'No description provided.'}"
                  </p>
                </div>

                {/* Owner Information */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 12px 0' }}>
                    <Users size={14} style={{ color: 'var(--primary)' }} /> Registered Owner Profile
                  </h5>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <img 
                      src={store.ownerDetails?.profilePhoto || 'https://via.placeholder.com/50?text=Profile'} 
                      alt="Owner profile" 
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: 0 }}>{store.ownerDetails?.fullName || store.ownerDetails?.name || 'N/A'}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Mail size={10} style={{ marginRight: 4 }} /> {store.ownerDetails?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Primary Phone:</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '2px 0 0 0' }}>{store.ownerDetails?.phone || store.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Alternate Phone:</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{store.ownerDetails?.alternatePhone || 'N/A'}</p>
                    </div>
                    {store.ownerDetails?.dateOfBirth && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Date of Birth:</span>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                          {new Date(store.ownerDetails.dateOfBirth?.$date || store.ownerDetails.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Registration Details */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 12px 0' }}>
                    <Briefcase size={14} style={{ color: 'var(--primary)' }} /> Business Information
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Reg/License Number:</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '2px 0 0 0' }}>{store.businessRegNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>GST Number:</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '2px 0 0 0' }}>{store.gstNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Years of Experience:</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{store.yearsOfExperience} years</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Employee Count:</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{store.numberOfEmployees} employees</p>
                    </div>
                  </div>
                </div>

                {/* Gallery Preview */}
                {store.gallery && store.gallery.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                    <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 10px 0' }}>Gallery Images ({store.gallery.length})</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {store.gallery.map((img, i) => (
                        <a href={img} target="_blank" rel="noopener noreferrer" key={i}>
                          <img 
                            src={img} 
                            alt={`Gallery ${i}`} 
                            style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)', transition: 'opacity 0.2s' }}
                            onMouseOver={e => e.target.style.opacity = 0.8}
                            onMouseOut={e => e.target.style.opacity = 1}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Document Verification Details */}
            {activeTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 14, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={16} style={{ color: 'var(--primary)' }} /> Document Verification Checklist
                  </h5>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                    Review uploaded identification and licenses to verify the business authenticity.
                  </p>
                </div>

                {/* Verification Documents List */}
                {['idProof', 'storePhoto', 'businessLicense', 'certifications'].map(docKey => {
                  const doc = store.verificationDocuments?.[docKey] || {};
                  const docUrl = doc.url || store.documents?.[docKey]; // Fallback to flat documents object
                  
                  return (
                    <div key={docKey} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{formatDocName(docKey)}</span>
                        <span 
                          style={{ 
                            fontSize: 10, 
                            fontWeight: 700, 
                            padding: '2px 6px', 
                            borderRadius: 4, 
                            background: getStatusColor(doc.status || 'pending') + '15', 
                            color: getStatusColor(doc.status || 'pending'),
                            border: `1px solid ${getStatusColor(doc.status || 'pending')}20`,
                            textTransform: 'uppercase'
                          }}
                        >
                          {doc.status || 'pending'}
                        </span>
                      </div>

                      {docUrl ? (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <a href={docUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', shrink: 0 }}>
                            <img 
                              src={docUrl} 
                              alt={docKey} 
                              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)', background: '#111' }}
                            />
                          </a>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                              {doc.status !== 'verified' && (
                                <button
                                  className="admin-btn"
                                  style={{ padding: '4px 8px', fontSize: 11, backgroundColor: 'var(--success)', color: '#fff' }}
                                  onClick={() => handleDocumentReviewPrompt(docKey, 'verified')}
                                >
                                  Verify
                                </button>
                              )}
                              {doc.status !== 'rejected' && (
                                <button
                                  className="admin-btn admin-btn-danger"
                                  style={{ padding: '4px 8px', fontSize: 11 }}
                                  onClick={() => handleDocumentReviewPrompt(docKey, 'rejected')}
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                            {doc.note && (
                              <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
                                <strong>Feedback note:</strong> "{doc.note}"
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, fontStyle: 'italic' }}>
                          Not uploaded or not required.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Operating Hours & Services Details */}
            {activeTab === 'services' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Store Categories */}
                <div>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 10px 0' }}>
                    <Grid size={14} style={{ color: 'var(--primary)' }} /> Partner Store Categories
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(store.storeTypes || store.categories || []).map((cat, i) => (
                      <span key={i} style={{ fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(255,107,53,0.15)', padding: '4px 8px', borderRadius: 6 }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Service Offerings */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 12px 0' }}>Services Offered ({store.services?.length || 0})</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {store.services?.map((svc, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: 12, borderRadius: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        {svc.image && (
                          <img 
                            src={svc.image} 
                            alt={svc.name} 
                            style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', background: '#111' }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>{svc.name}</span>
                            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--success)' }}>₹{svc.price}</span>
                          </div>
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                            Duration: {svc.duration || 'N/A'} • Suitable for: {svc.suitableFor || svc.petTypes?.join(', ') || 'All Pets'}
                          </p>
                          {svc.description && (
                            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                              {svc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )) || <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No services configured.</span>}
                  </div>
                </div>

                {/* Operations & Booking Settings */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 12px 0' }}>Operating & Booking Settings</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: 12, borderRadius: 8 }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Service Mode:</span>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: '2px 0 0 0' }}>{store.serviceMode || 'Both'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Service Radius:</span>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{store.serviceRadius || 0} km</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Home Pickup:</span>
                      <p style={{ fontSize: 12, color: store.homePickup ? 'var(--success)' : 'var(--text-tertiary)', margin: '2px 0 0 0' }}>
                        {store.homePickup ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Home Delivery:</span>
                      <p style={{ fontSize: 12, color: store.homeDelivery ? 'var(--success)' : 'var(--text-tertiary)', margin: '2px 0 0 0' }}>
                        {store.homeDelivery ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Booking Mode:</span>
                      <p style={{ fontSize: 12, color: '#fff', margin: '2px 0 0 0' }}>{store.bookingMode || 'Both'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Max Bookings/Day:</span>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>{store.maxBookingsPerDay || 20} slots</p>
                    </div>
                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>24/7 Emergency Support:</span>
                      <p style={{ fontSize: 12, color: store.is24x7 ? '#f59e0b' : 'var(--text-secondary)', fontWeight: store.is24x7 ? 600 : 400, margin: '2px 0 0 0' }}>
                        {store.is24x7 ? `Yes (Charges: ₹${store.emergencyCharges || 0})` : 'No'}
                      </p>
                      {store.is24x7 && store.emergencyContact && (
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                          Emergency Contact: {store.emergencyContact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sells Products and Sells Pets info */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 12px 0' }}>Retail Offerings</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: 12, borderRadius: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: store.sellsProducts ? 'var(--success)' : 'var(--text-tertiary)' }}>
                        {store.sellsProducts ? '✓ Sells Products' : '✗ Does Not Sell Products'}
                      </span>
                      {store.sellsProducts && store.productCategories && store.productCategories.length > 0 && (
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                          Categories: {store.productCategories.filter((v, i, self) => self.indexOf(v) === i).join(', ')}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: 12, borderRadius: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: store.sellsPets ? 'var(--success)' : 'var(--text-tertiary)' }}>
                        {store.sellsPets ? '✓ Sells/Adopts Pets' : '✗ Does Not Sell/Adopt Pets'}
                      </span>
                      {store.sellsPets && store.petSaleTypes && store.petSaleTypes.length > 0 && (
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                          Pet Categories: {store.petSaleTypes.filter((v, i, self) => self.indexOf(v) === i).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operating Business Hours */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 12px 0' }}>
                    <Clock size={14} style={{ color: 'var(--primary)' }} /> Weekly Business Hours
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {store.businessHours?.map((hours, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '4px 6px', background: hours.isOpen ? 'transparent' : 'rgba(239, 68, 68, 0.03)', borderRadius: 4 }}>
                        <span style={{ color: hours.isOpen ? '#fff' : 'var(--text-tertiary)', fontWeight: hours.isOpen ? 600 : 400 }}>{hours.day}</span>
                        {hours.isOpen ? (
                          <span style={{ color: 'var(--text-secondary)' }}>{hours.openTime} - {hours.closeTime}</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: 600 }}>Closed</span>
                        )}
                      </div>
                    )) || <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No hours configured.</span>}
                  </div>
                </div>

                {/* Social Links */}
                {store.socialLinks && Object.values(store.socialLinks).some(Boolean) && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                    <h5 style={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 10px 0' }}>
                      <Globe size={14} style={{ color: 'var(--primary)' }} /> External Social Links
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {Object.entries(store.socialLinks).map(([platform, url]) => {
                        if (!url) return null;
                        return (
                          <a 
                            key={platform} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          >
                            <Globe size={10} /> <span style={{ textTransform: 'capitalize', color: '#fff', fontWeight: 600 }}>{platform}:</span> {url}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default StoresPage;
