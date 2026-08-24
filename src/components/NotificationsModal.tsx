import React from 'react';
import { InventoryItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onNavigateToItems: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  items,
  onNavigateToItems,
}) => {
  if (!isOpen) return null;

  const toOrderItems = items.filter((i) => i.status === 'to_order');
  const orderedItems = items.filter((i) => i.status === 'ordered');

  return (
    <div
      id="notifications-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border border-[#c3c6d7] max-w-sm w-full shadow-2xl flex flex-col mt-12 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e1e2ed] bg-[#faf8ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-xl">
              notifications
            </span>
            <h3 className="text-base font-bold text-[#191b23]">Warehouse Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#191b23] p-1 rounded-md"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 max-h-[70vh]">
          {toOrderItems.length > 0 && (
            <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/20 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Out of Stock ({toOrderItems.length})
                </span>
              </div>
              <p className="text-xs text-[#191b23]">
                {toOrderItems.length} items require immediate supplier purchase orders.
              </p>
              <button
                onClick={() => {
                  onNavigateToItems();
                  onClose();
                }}
                className="text-xs text-[#ba1a1a] font-semibold underline mt-1 block"
              >
                Review Items &rarr;
              </button>
            </div>
          )}

          {orderedItems.length > 0 && (
            <div className="p-3 bg-[#ffede6]/50 border border-[#943700]/20 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-[#943700]">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  In Transit ({orderedItems.length})
                </span>
              </div>
              <p className="text-xs text-[#191b23]">
                Shipments pending dock receiving and inspection.
              </p>
            </div>
          )}

          <div className="p-3 bg-[#f3f3fe] border border-[#c3c6d7] rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="text-xs font-bold uppercase tracking-wider">System Status</span>
            </div>
            <p className="text-xs text-[#434655]">
              Warehouse Alpha portal synced with camera module and inventory state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
