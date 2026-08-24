import React, { useState } from 'react';
import { ManagerProfile, Supplier, InventoryItem } from '../types';

interface SettingsViewProps {
  manager: ManagerProfile;
  onUpdateManager: (updated: ManagerProfile) => void;
  suppliers: Supplier[];
  items: InventoryItem[];
  onLoadDemoData: () => void;
  onClearAllData: () => void;
  onSignOut: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  manager,
  onUpdateManager,
  suppliers,
  items,
  onLoadDemoData,
  onClearAllData,
  onSignOut,
}) => {
  const [name, setName] = useState(manager.name);
  const [role, setRole] = useState(manager.role);
  const [facility, setFacility] = useState(manager.facility);
  const [email, setEmail] = useState(manager.email);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateManager({
      ...manager,
      name,
      role,
      facility,
      email,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportJSON = () => {
    const data = {
      warehouse: facility,
      exportDate: new Date().toISOString(),
      suppliers,
      items,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplyflow-warehouse-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="settings-view" className="flex-1 flex flex-col h-full overflow-y-auto bg-[#faf8ff] p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6 pb-24">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#191b23] tracking-tight">Settings</h2>
          <p className="text-sm text-[#434655] mt-0.5">
            Manage facility configuration, portal manager profile, and local data persistence.
          </p>
        </div>

        {/* Manager Profile Form */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-[#e1e2ed] mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#004ac6] shrink-0">
              <img
                src={manager.avatarUrl}
                alt={manager.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#191b23]">{manager.name}</h3>
              <p className="text-xs text-[#434655]">{manager.facility} • {manager.role}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Manager Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Portal Role / Title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Assigned Facility / Warehouse
                </label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Internal Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#e1e2ed]">
              {isSaved && (
                <span className="text-xs font-semibold text-[#004ac6] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Profile changes saved
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="bg-[#004ac6] hover:bg-[#003ea8] text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-xs transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Demo Data & Workspace Reset Controls */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-xs">
          <h3 className="text-lg font-bold text-[#191b23] mb-1">Data & Demo State Controls</h3>
          <p className="text-xs text-[#434655] mb-4">
            Easily toggle between empty state screenshots and sample populated inventory.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#faf8ff] border border-[#c3c6d7] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#191b23] mb-1">Load Demo Inventory</h4>
                <p className="text-xs text-[#434655] mb-4">
                  Populate 3 hardware vendors and realistic tracked items (Fasteners, Hydraulic seals, O-rings).
                </p>
              </div>
              <button
                type="button"
                onClick={onLoadDemoData}
                className="bg-[#d5e3fc] hover:bg-[#b4c5ff] text-[#004ac6] font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                Load Sample Data
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#faf8ff] border border-[#c3c6d7] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#ba1a1a] mb-1">Reset to Empty State</h4>
                <p className="text-xs text-[#434655] mb-4">
                  Clear all suppliers and inventory items to preview initial blank states.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all local suppliers and items to restore the blank state?')) {
                    onClearAllData();
                  }
                }}
                className="bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Clear All Data
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#e1e2ed] flex items-center justify-between">
            <div className="text-xs text-[#434655]">
              Current database: <strong className="text-[#191b23]">{suppliers.length}</strong> suppliers, <strong className="text-[#191b23]">{items.length}</strong> inventory items.
            </div>
            <button
              onClick={handleExportJSON}
              className="text-xs font-semibold text-[#004ac6] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              Export Backup (JSON)
            </button>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-4 text-xs font-semibold text-[#ba1a1a] hover:underline"
          >
            Sign out
          </button>
        </div>

        {/* System & Architecture Info */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#191b23] uppercase tracking-wider mb-3">
            System Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#434655] block">App Version</span>
              <span className="font-semibold text-[#191b23]">SupplyFlow v2.4.0</span>
            </div>
            <div>
              <span className="text-[#434655] block">Camera Integration</span>
              <span className="font-semibold text-[#004ac6]">WebRTC / MediaDevices</span>
            </div>
            <div>
              <span className="text-[#434655] block">Local Storage</span>
              <span className="font-semibold text-[#191b23]">Active (Persistent)</span>
            </div>
            <div>
              <span className="text-[#434655] block">Target Facility</span>
              <span className="font-semibold text-[#191b23]">Warehouse Alpha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
