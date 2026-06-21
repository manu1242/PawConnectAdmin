import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserCheck, 
  Settings, 
  Save, 
  Check, 
  AlertCircle,
  Gift,
  Bone,
  Pill,
  Crown,
  HeartPulse,
  Scissors,
  Footprints,
  Home,
  Award,
  AlertOctagon,
  HelpCircle,
  Sliders
} from 'lucide-react';

function PermissionsPage({ users = [], onUpdatePermissions, loading = false }) {
  const [selectedManager, setSelectedManager] = useState(null);
  const [activePermissions, setActivePermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  // Filter managers/owners
  const managers = users.filter(u => u.role === 'manager' || u.role === 'store_owner');

  const AVAILABLE_MODULES = [
    { id: "toys", label: "Toys Inventory", description: "Allows managing pet toys, upload images, set prices, and fulfill toy orders.", icon: Gift, color: "#a855f7" },
    { id: "food", label: "Food & Nutrition", description: "Enables cataloging animal food products, diet plans, and view kibble sales.", icon: Bone, color: "#eab308" },
    { id: "medicines", label: "Medicines Shop", description: "Restricted pharmacy module for prescription medicines and veterinarian drugs.", icon: Pill, color: "#ef4444" },
    { id: "accessories", label: "Accessories Shop", description: "Allows selling collards, leashes, custom pet beds, and travel crates.", icon: Crown, color: "#3b82f6" },
    { id: "veterinary", label: "Veterinary Module", description: "Clinic onboarding page for doctor roster timings, clinic slots, and medical bookings.", icon: HeartPulse, color: "#10b981" },
    { id: "grooming", label: "Grooming Services", description: "Enables configuring pet haircuts, styling packages, spa durations, and bath bookings.", icon: Scissors, color: "#06b6d4" },
    { id: "walking", label: "Dog Walking", description: "Registration page for dog walking assistants, hourly rates, and walking assignments.", icon: Footprints, color: "#f97316" },
    { id: "boarding", label: "Boarding Stay", description: "Overnight lodging stays, kennel capacities, checked-in boarding logs.", icon: Home, color: "#6366f1" },
    { id: "training", label: "Dog Training", description: "Obedience programs, puppy classes, assigned dog training coaches.", icon: Award, color: "#ec4899" },
    { id: "emergency", label: "Emergency Dispatch", description: "Emergency ambulance details, 24/7 priority triage contacts, customer coordinates.", icon: AlertOctagon, color: "#ef4444" }
  ];

  // Auto-select first manager on load if none selected
  useEffect(() => {
    if (managers.length > 0 && !selectedManager) {
      handleSelectManager(managers[0]);
    }
  }, [users]);

  const handleSelectManager = (mgr) => {
    setSelectedManager(mgr);
    setActivePermissions(mgr.permissions || []);
  };

  const handleTogglePermission = (modId) => {
    if (activePermissions.includes(modId)) {
      setActivePermissions(prev => prev.filter(p => p !== modId));
    } else {
      setActivePermissions(prev => [...prev, modId]);
    }
  };

  const handleSave = async () => {
    if (!selectedManager) return;
    setSaving(true);
    
    // Call the parent update callback
    await onUpdatePermissions(selectedManager._id, {
      permissions: activePermissions
    });

    setSaving(false);
  };

  return (
    <div className="animate-slide-in" style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 30 }}>
      
      {/* Left Column: Manager List */}
      <div className="card-panel" style={{ padding: 24, height: "fit-content" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <UserCheck size={18} style={{ color: "var(--primary)" }} /> Store Managers
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {managers.length === 0 ? (
            <p style={{ color: "var(--text-tertiary)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              No Store Managers registered.
            </p>
          ) : (
            managers.map((mgr) => {
              const isSelected = selectedManager?._id === mgr._id;
              return (
                <div
                  key={mgr._id}
                  onClick={() => handleSelectManager(mgr)}
                  style={{
                    background: isSelected ? "var(--primary-light)" : "var(--bg-tertiary)",
                    border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border-color)"}`,
                    padding: 16,
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "var(--transition-smooth)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: isSelected ? "#fff" : "var(--text-secondary)" }}>
                      {mgr.fullName}
                    </span>
                    <span style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", color: "var(--text-tertiary)", padding: "2px 6px", borderRadius: 8 }}>
                      {mgr.businessType || 'store'}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>{mgr.email}</p>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {(mgr.permissions || []).length === 0 ? (
                      <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>No Active Modules</span>
                    ) : (
                      (mgr.permissions || []).map(p => (
                        <span key={p} style={{ fontSize: 9, background: "rgba(168,85,247,0.15)", color: "#c084fc", padding: "1px 6px", borderRadius: 4, textTransform: "capitalize" }}>
                          {p}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Permission Editor */}
      <div className="card-panel" style={{ padding: 28 }}>
        {selectedManager ? (
          <div>
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield size={20} style={{ color: "var(--primary)" }} /> 
                  Access Scope: {selectedManager.fullName}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                  Configure granular service features allowed for this manager account.
                </p>
              </div>

              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 6, margin: 0 }}
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Scope Details"}
              </button>
            </div>

            {/* Grid list of permission toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {AVAILABLE_MODULES.map((mod) => {
                const isChecked = activePermissions.includes(mod.id);
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.id}
                    onClick={() => handleTogglePermission(mod.id)}
                    style={{
                      background: "var(--bg-tertiary)",
                      border: `1px solid ${isChecked ? "var(--primary)" : "var(--border-color)"}`,
                      padding: 16,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)"
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingRight: 20 }}>
                      <div style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: 10, 
                        backgroundColor: isChecked ? `${mod.color}20` : "rgba(255,255,255,0.05)", 
                        color: isChecked ? mod.color : "var(--text-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: isChecked ? "#fff" : "var(--text-secondary)", display: "block" }}>
                          {mod.label}
                        </span>
                        <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2, lineHeight: 1.4 }}>
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch design */}
                    <div style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: isChecked ? "var(--primary)" : "rgba(255,255,255,0.08)",
                      position: "relative",
                      transition: "var(--transition-smooth)",
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: 3,
                        left: isChecked ? 23 : 3,
                        transition: "var(--transition-smooth)"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", color: "var(--text-tertiary)" }}>
            <Sliders size={40} style={{ opacity: 0.5, marginBottom: 12 }} />
            <p style={{ fontSize: 14 }}>Please select a Store Manager from the list to modify their access credentials.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default PermissionsPage;
