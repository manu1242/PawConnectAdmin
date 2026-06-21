import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Info, 
  FileText, 
  MapPin, 
  User, 
  Briefcase, 
  ShieldAlert,
  Clipboard,
  ExternalLink
} from 'lucide-react';

function RegistrationRequestsPage({ requests, onUpdateStatus, loading }) {
  const [selectedReq, setSelectedReq] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approvedPerms, setApprovedPerms] = useState([]);
  
  // Credentials modal after approval
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const ALL_PRODUCTS = [
    { id: 'toys', label: 'Toys' },
    { id: 'food', label: 'Food' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'accessories', label: 'Accessories' }
  ];

  const ALL_SERVICES = [
    { id: 'veterinary', label: 'Veterinary Service' },
    { id: 'grooming', label: 'Grooming Service' },
    { id: 'walking', label: 'Dog Walking Service' },
    { id: 'boarding', label: 'Pet Boarding' },
    { id: 'training', label: 'Pet Training' },
    { id: 'emergency', label: 'Emergency Pet Care' }
  ];

  const handleOpenRequest = (req) => {
    setSelectedReq(req);
    setAdminNotes(req.adminNotes || "");
    setRejectionReason(req.rejectionReason || "");
    setShowRejectForm(false);
    
    // Combine both requested arrays for pre-selected permissions
    const initialPerms = [
      ...(req.requestedProducts || []),
      ...(req.requestedServices || [])
    ];
    setApprovedPerms(initialPerms);
  };

  const togglePermission = (permId) => {
    if (approvedPerms.includes(permId)) {
      setApprovedPerms(prev => prev.filter(p => p !== permId));
    } else {
      setApprovedPerms(prev => [...prev, permId]);
    }
  };

  const handleApprove = async () => {
    if (!selectedReq) return;
    const res = await onUpdateStatus(selectedReq._id, {
      status: 'approved',
      adminNotes,
      approvedPermissions: approvedPerms
    });

    if (res && res.success && res.temporaryPassword) {
      setCreatedCredentials({
        email: selectedReq.ownerDetails.email,
        password: res.temporaryPassword,
        storeName: selectedReq.businessDetails.name
      });
      setSelectedReq(null);
    }
  };

  const handleReject = async () => {
    if (!selectedReq) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    const res = await onUpdateStatus(selectedReq._id, {
      status: 'rejected',
      adminNotes,
      rejectionReason
    });

    if (res && res.success) {
      setSelectedReq(null);
    }
  };

  const handleRequestInfo = async () => {
    if (!selectedReq) return;
    const res = await onUpdateStatus(selectedReq._id, {
      status: 'more_info',
      adminNotes
    });

    if (res && res.success) {
      setSelectedReq(null);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: 24 }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>Partner Registration Requests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Review business metadata, assign permissions and approve new store partner requests.
          </p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card-box" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16 }}>
        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
            No registration requests found.
          </div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: 13 }}>
                  <th style={{ padding: '12px 8px' }}>Store Name</th>
                  <th style={{ padding: '12px 8px' }}>Owner Details</th>
                  <th style={{ padding: '12px 8px' }}>Types</th>
                  <th style={{ padding: '12px 8px' }}>Submitted</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: 13 }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600, color: '#fff' }}>
                      {req.businessDetails.name}
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                      <div>{req.ownerDetails.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{req.ownerDetails.email}</div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {req.storeTypes?.map(t => (
                          <span key={t} style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--primary)',
                            borderRadius: 12,
                            fontWeight: 600
                          }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        background: 
                          req.status === 'approved' ? 'var(--success-light)' :
                          req.status === 'rejected' ? 'var(--danger-light)' :
                          req.status === 'more_info' ? 'rgba(255, 193, 7, 0.15)' :
                          'rgba(59, 130, 246, 0.15)',
                        color:
                          req.status === 'approved' ? 'var(--success)' :
                          req.status === 'rejected' ? 'var(--danger)' :
                          req.status === 'more_info' ? '#ffc107' :
                          '#3b82f6'
                      }}>
                        {req.status === 'approved' ? 'Approved' :
                         req.status === 'rejected' ? 'Rejected' :
                         req.status === 'more_info' ? 'Need Info' :
                         'Pending Approval'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={() => handleOpenRequest(req)}
                      >
                        Inspect Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedReq && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <div className="animate-fade-in" style={{
            background: 'var(--bg-secondary)',
            borderRadius: 16,
            width: '100%',
            maxWidth: 750,
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1.5px solid var(--border-color)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
          }}>
            
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Review Onboarding Application</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>
                  Submitted on {new Date(selectedReq.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => setSelectedReq(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Owner and Business split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                
                {/* Owner Details */}
                <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={15} /> Owner Details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Name:</span> <strong style={{ color: '#fff' }}>{selectedReq.ownerDetails.fullName}</strong></div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Email:</span> <span style={{ color: 'var(--text-secondary)' }}>{selectedReq.ownerDetails.email}</span></div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Phone:</span> <span style={{ color: 'var(--text-secondary)' }}>{selectedReq.ownerDetails.phone}</span></div>
                  </div>
                </div>

                {/* Business Details */}
                <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={15} /> Business details
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Store Name:</span> <strong style={{ color: '#fff' }}>{selectedReq.businessDetails.name}</strong></div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>GST Number:</span> <span style={{ color: 'var(--text-secondary)' }}>{selectedReq.businessDetails.gstNumber || 'N/A'}</span></div>
                    <div><span style={{ color: 'var(--text-tertiary)' }}>Reg Number:</span> <span style={{ color: 'var(--text-secondary)' }}>{selectedReq.businessDetails.businessRegNumber || 'N/A'}</span></div>
                  </div>
                </div>

              </div>

              {/* Address details */}
              <div style={{ display: 'flex', gap: 8, fontSize: 13, background: 'var(--bg-tertiary)', padding: 12, borderRadius: 10 }}>
                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Full Address: </span>
                  <span style={{ color: '#fff' }}>
                    {selectedReq.businessDetails.address}, {selectedReq.businessDetails.city}, {selectedReq.businessDetails.state} - {selectedReq.businessDetails.pincode}
                  </span>
                </div>
              </div>

              {/* Modules / Permissions Editor */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                  Assign Authorized Module Permissions
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 12 }}>
                  Check/uncheck to edit the active modules that will be provisioned to this store manager upon approval.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  
                  {/* Products */}
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 8 }}>Products Modules</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {ALL_PRODUCTS.map(prod => (
                        <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                          <input 
                            type="checkbox" 
                            checked={approvedPerms.includes(prod.id)} 
                            onChange={() => togglePermission(prod.id)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          <span style={{ color: approvedPerms.includes(prod.id) ? '#fff' : 'var(--text-secondary)' }}>{prod.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 8 }}>Services Modules</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {ALL_SERVICES.map(srv => (
                        <label key={srv.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                          <input 
                            type="checkbox" 
                            checked={approvedPerms.includes(srv.id)} 
                            onChange={() => togglePermission(srv.id)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          <span style={{ color: approvedPerms.includes(srv.id) ? '#fff' : 'var(--text-secondary)' }}>{srv.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Uploaded Documents Verification */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={15} /> Uploaded Verification Documents
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Store License:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedReq.documents?.storeLicense || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>GST Certificate:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedReq.documents?.gstCertificate || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Owner ID Proof:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedReq.documents?.ownerIdProof || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Store Logo File:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedReq.documents?.storeLogo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Admin Notes / Rejection Form Toggle */}
              <div>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Reviewer Notes (Internal)</label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    value={adminNotes} 
                    onChange={(e) => setAdminNotes(e.target.value)} 
                    placeholder="Enter audit notes or instructions here..."
                  />
                </div>

                {showRejectForm && (
                  <div className="animate-slide-in" style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 10, marginBottom: 12 }}>
                    <label className="form-label" style={{ color: 'var(--danger)', fontWeight: 700 }}>Reason for Rejection (sent to applicant)</label>
                    <textarea 
                      className="input-field" 
                      rows={2} 
                      value={rejectionReason} 
                      onChange={(e) => setRejectionReason(e.target.value)} 
                      placeholder="Explain what details/documents are incorrect..."
                      required
                    />
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                      <button className="btn-primary" style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', padding: '6px 12px' }} onClick={handleReject}>
                        Confirm Permanent Rejection
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setShowRejectForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)'
            }}>
              <div>
                {!showRejectForm && selectedReq.status !== 'approved' && (
                  <button 
                    className="btn-secondary" 
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    onClick={() => setShowRejectForm(true)}
                    disabled={loading}
                  >
                    Reject Application
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 10 }}>
                {selectedReq.status !== 'approved' && (
                  <>
                    <button className="btn-secondary" onClick={handleRequestInfo} disabled={loading}>
                      Need More Info
                    </button>
                    <button className="btn-primary" onClick={handleApprove} style={{ display: 'flex', alignItems: 'center', gap: 6 }} disabled={loading}>
                      {loading ? 'Approving...' : <><Check size={16} /> Approve & Provision Account</>}
                    </button>
                  </>
                )}
                <button className="btn-secondary" onClick={() => setSelectedReq(null)} disabled={loading}>
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Account Provision Credentials Modal */}
      {createdCredentials && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <div className="animate-fade-in" style={{
            background: 'var(--bg-secondary)',
            borderRadius: 16,
            width: '100%',
            maxWidth: 500,
            padding: 32,
            textAlign: 'center',
            border: '2px solid var(--success)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Account Provisioned Successfully!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
              The store profile for <strong>{createdCredentials.storeName}</strong> is now activated. The temporary login credentials are listed below:
            </p>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: 16,
              borderRadius: 12,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: 24,
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block' }}>STORE OWNER EMAIL</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <code style={{ fontSize: 13, color: '#fff', fontWeight: 'bold' }}>{createdCredentials.email}</code>
                  <button 
                    onClick={() => handleCopyToClipboard(createdCredentials.email)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 2 }}
                  >
                    <Clipboard size={14} />
                  </button>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block' }}>TEMPORARY PASSWORD</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <code style={{ fontSize: 13, color: 'var(--success)', fontWeight: 'bold' }}>{createdCredentials.password}</code>
                  <button 
                    onClick={() => handleCopyToClipboard(createdCredentials.password)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 2 }}
                  >
                    <Clipboard size={14} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => setCreatedCredentials(null)}
              style={{ width: '100%' }}
            >
              Done / Return to List
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default RegistrationRequestsPage;
