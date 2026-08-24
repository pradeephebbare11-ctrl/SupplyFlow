import React from 'react';
import { ActiveScreen, ManagerProfile } from '../types';

interface SideNavBarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onTakePhoto: () => void;
  manager: ManagerProfile;
  itemCount: number;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeScreen,
  onNavigate,
  onTakePhoto,
  manager,
  itemCount,
}) => {
  return (
    <nav
      id="side-nav-bar"
      className="hidden md:flex h-screen w-64 flex-col left-0 top-0 sticky bg-[#f3f3fe] border-r border-[#c3c6d7] py-6 gap-2 shrink-0 z-40 overflow-y-auto select-none"
    >
      {/* Brand Header */}
      <div className="px-6 mb-4">
        <h1
          onClick={() => onNavigate('dashboard')}
          className="text-2xl font-bold text-[#004ac6] tracking-tight cursor-pointer hover:opacity-90 transition-opacity mb-4"
        >
          SupplyFlow
        </h1>

        {/* Manager Profile Widget */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#c3c6d7] hover:border-[#004ac6]/40 cursor-pointer transition-all shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#e1e2ed] flex items-center justify-center overflow-hidden shrink-0 border border-[#c3c6d7]/60">
            {manager.avatarUrl ? (
              <img
                src={manager.avatarUrl}
                alt={manager.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined text-[#434655]">person</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#191b23] truncate leading-tight">
              {manager.name}
            </p>
            <p className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider truncate">
              {manager.facility}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 px-3 flex-1">
        <button
          id="nav-link-dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
            activeScreen === 'dashboard'
              ? 'bg-[#d5e3fc] text-[#004ac6] font-semibold shadow-xs'
              : 'text-[#434655] hover:bg-[#e7e7f3] hover:text-[#191b23]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeScreen === 'dashboard' ? 'fill-icon' : ''
            }`}
          >
            dashboard
          </span>
          <span>Dashboard</span>
        </button>

        <button
          id="nav-link-suppliers"
          onClick={() => onNavigate('suppliers')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
            activeScreen === 'suppliers'
              ? 'bg-[#d5e3fc] text-[#004ac6] font-semibold shadow-xs'
              : 'text-[#434655] hover:bg-[#e7e7f3] hover:text-[#191b23]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeScreen === 'suppliers' ? 'fill-icon' : ''
            }`}
          >
            factory
          </span>
          <span>Suppliers</span>
        </button>

        <button
          id="nav-link-all-items"
          onClick={() => onNavigate('all_items')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
            activeScreen === 'all_items'
              ? 'bg-[#d5e3fc] text-[#004ac6] font-semibold shadow-xs'
              : 'text-[#434655] hover:bg-[#e7e7f3] hover:text-[#191b23]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeScreen === 'all_items' ? 'fill-icon' : ''
              }`}
            >
              inventory_2
            </span>
            <span>All Items</span>
          </div>
          {itemCount > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeScreen === 'all_items'
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#e1e2ed] text-[#434655]'
              }`}
            >
              {itemCount}
            </span>
          )}
        </button>

        <button
          id="nav-link-add-product"
          onClick={() => onNavigate('add_product')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
            activeScreen === 'add_product'
              ? 'bg-[#d5e3fc] text-[#004ac6] font-semibold shadow-xs'
              : 'text-[#434655] hover:bg-[#e7e7f3] hover:text-[#191b23]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeScreen === 'add_product' ? 'fill-icon' : ''
            }`}
          >
            add_a_photo
          </span>
          <span>Add Product</span>
        </button>

        <button
          id="nav-link-settings"
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
            activeScreen === 'settings'
              ? 'bg-[#d5e3fc] text-[#004ac6] font-semibold shadow-xs'
              : 'text-[#434655] hover:bg-[#e7e7f3] hover:text-[#191b23]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeScreen === 'settings' ? 'fill-icon' : ''
            }`}
          >
            settings
          </span>
          <span>Settings</span>
        </button>
      </div>

      {/* Bottom Action: Take Photo & Logout */}
      <div className="mt-auto px-4 pt-4 border-t border-[#c3c6d7]/60 flex flex-col gap-2">
        <button
          id="side-nav-take-photo-btn"
          onClick={onTakePhoto}
          className="w-full bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span className="material-symbols-outlined fill-icon text-[20px]">
            photo_camera
          </span>
          <span>Take Photo</span>
        </button>

        <button
          id="side-nav-logout-btn"
          onClick={() => alert('Logged out from Warehouse Alpha session.')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#434655] hover:bg-[#e7e7f3] hover:text-[#191b23] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};
