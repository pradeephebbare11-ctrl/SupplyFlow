import React from 'react';
import { ActiveScreen, ManagerProfile } from '../types';

interface TopAppBarProps {
  activeScreen: ActiveScreen;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  manager: ManagerProfile;
  onNavigate: (screen: ActiveScreen) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeScreen,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 2,
  manager,
  onNavigate,
}) => {
  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard':
        return 'Dashboard';
      case 'suppliers':
        return 'Suppliers';
      case 'all_items':
        return 'All Items';
      case 'add_product':
        return 'New Inventory Entry';
      case 'settings':
        return 'Warehouse Settings';
      default:
        return 'SupplyFlow';
    }
  };

  return (
    <header
      id="top-app-bar"
      className="w-full top-0 sticky border-b border-[#c3c6d7] bg-[#faf8ff] flex justify-between items-center px-4 md:px-8 z-30 h-16 transition-colors duration-200"
    >
      {/* Mobile Branding / Back button on sub-screens */}
      <div className="md:hidden flex items-center gap-2">
        <span
          onClick={() => onNavigate('dashboard')}
          className="text-xl font-bold text-[#004ac6] cursor-pointer"
        >
          SupplyFlow
        </span>
      </div>

      {/* Desktop Screen Title */}
      <div className="hidden md:block">
        <h2 className="text-2xl font-bold text-[#191b23] tracking-tight">
          {getScreenTitle()}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          id="top-search-btn"
          aria-label="Search"
          onClick={onOpenSearch}
          className="text-[#434655] hover:bg-[#ededf9] p-2 rounded-full transition-colors flex items-center justify-center h-10 w-10 relative"
          title="Search inventory and suppliers (Cmd/Ctrl + K)"
        >
          <span className="material-symbols-outlined text-[22px]">search</span>
        </button>

        <button
          id="top-notifications-btn"
          aria-label="Notifications"
          onClick={onOpenNotifications}
          className="text-[#434655] hover:bg-[#ededf9] p-2 rounded-full transition-colors flex items-center justify-center h-10 w-10 relative"
          title="Warehouse alerts"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf8ff]" />
          )}
        </button>

        {/* Mobile Avatar */}
        <button
          id="mobile-avatar-btn"
          onClick={() => onNavigate('settings')}
          className="md:hidden w-8 h-8 rounded-full overflow-hidden border border-[#c3c6d7] shrink-0"
        >
          <img
            src={manager.avatarUrl}
            alt={manager.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};
