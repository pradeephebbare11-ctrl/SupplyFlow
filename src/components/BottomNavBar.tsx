import React from 'react';
import { ActiveScreen } from '../types';

interface BottomNavBarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onTakePhoto: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeScreen,
  onNavigate,
  onTakePhoto,
}) => {
  return (
    <>
      {/* Floating Action Button for Mobile Camera */}
      <button
        id="mobile-camera-fab"
        onClick={onTakePhoto}
        aria-label="Take Product Photo"
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-[#004ac6] hover:bg-[#003ea8] active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all border-2 border-white"
      >
        <span className="material-symbols-outlined fill-icon text-2xl">add_a_photo</span>
      </button>

      {/* Bottom Nav Bar */}
      <nav
        id="bottom-nav-bar"
        className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-[#faf8ff] border-t border-[#c3c6d7] z-40 md:hidden pb-safe pt-1.5 pb-2 px-1"
      >
        <button
          id="mobile-nav-dashboard"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
            activeScreen === 'dashboard'
              ? 'text-[#004ac6] font-bold bg-[#d5e3fc]/60'
              : 'text-[#434655]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] mb-0.5 ${
              activeScreen === 'dashboard' ? 'fill-icon' : ''
            }`}
          >
            home
          </span>
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </button>

        <button
          id="mobile-nav-suppliers"
          onClick={() => onNavigate('suppliers')}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
            activeScreen === 'suppliers'
              ? 'text-[#004ac6] font-bold bg-[#d5e3fc]/60'
              : 'text-[#434655]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] mb-0.5 ${
              activeScreen === 'suppliers' ? 'fill-icon' : ''
            }`}
          >
            factory
          </span>
          <span className="text-[10px] font-semibold tracking-tight">Suppliers</span>
        </button>

        <button
          id="mobile-nav-all-items"
          onClick={() => onNavigate('all_items')}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
            activeScreen === 'all_items'
              ? 'text-[#004ac6] font-bold bg-[#d5e3fc]/60'
              : 'text-[#434655]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] mb-0.5 ${
              activeScreen === 'all_items' ? 'fill-icon' : ''
            }`}
          >
            inventory_2
          </span>
          <span className="text-[10px] font-semibold tracking-tight">All Items</span>
        </button>

        <button
          id="mobile-nav-add-product"
          onClick={() => onNavigate('add_product')}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
            activeScreen === 'add_product'
              ? 'text-[#004ac6] font-bold bg-[#d5e3fc]/60'
              : 'text-[#434655]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] mb-0.5 ${
              activeScreen === 'add_product' ? 'fill-icon' : ''
            }`}
          >
            add_circle
          </span>
          <span className="text-[10px] font-semibold tracking-tight">Add Item</span>
        </button>

        <button
          id="mobile-nav-settings"
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
            activeScreen === 'settings'
              ? 'text-[#004ac6] font-bold bg-[#d5e3fc]/60'
              : 'text-[#434655]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] mb-0.5 ${
              activeScreen === 'settings' ? 'fill-icon' : ''
            }`}
          >
            settings
          </span>
          <span className="text-[10px] font-semibold tracking-tight">Settings</span>
        </button>
      </nav>
    </>
  );
};
