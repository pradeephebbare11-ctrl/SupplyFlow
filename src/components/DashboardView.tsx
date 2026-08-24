import React from 'react';
import { InventoryItem, Supplier, ActiveScreen } from '../types';

interface DashboardViewProps {
  items: InventoryItem[];
  suppliers: Supplier[];
  onNavigate: (screen: ActiveScreen) => void;
  onTakePhoto: () => void;
  onUpdateItemStatus: (id: string, newStatus: 'to_order' | 'ordered' | 'received') => void;
  onSelectItemForDetail: (item: InventoryItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  suppliers,
  onNavigate,
  onTakePhoto,
  onUpdateItemStatus,
  onSelectItemForDetail,
}) => {
  const totalSuppliers = suppliers.length;
  const totalItems = items.length;
  const toOrderCount = items.filter((i) => i.status === 'to_order').length;
  const orderedCount = items.filter((i) => i.status === 'ordered').length;
  const receivedCount = items.filter((i) => i.status === 'received').length;

  const urgentItems = items.filter((i) => i.status === 'to_order');

  return (
    <div id="dashboard-view" className="p-4 md:p-8 flex-1 flex flex-col gap-6 md:gap-8 bg-[#faf8ff] overflow-y-auto">
      {/* Mobile Title */}
      <div className="md:hidden">
        <h2 className="text-2xl font-bold text-[#191b23]">Dashboard</h2>
      </div>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {/* Stat Card: Total Suppliers */}
        <div
          id="stat-total-suppliers"
          onClick={() => onNavigate('suppliers')}
          className="bg-white border border-[#e1e2ed] rounded-lg p-4 flex flex-col justify-between h-24 hover:border-[#004ac6]/30 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
            Total Suppliers
          </span>
          <span className="text-3xl font-bold text-[#191b23] tracking-tight">{totalSuppliers}</span>
        </div>

        {/* Stat Card: Total Items */}
        <div
          id="stat-total-items"
          onClick={() => onNavigate('all_items')}
          className="bg-white border border-[#e1e2ed] rounded-lg p-4 flex flex-col justify-between h-24 hover:border-[#004ac6]/30 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
            Total Items
          </span>
          <span className="text-3xl font-bold text-[#191b23] tracking-tight">{totalItems}</span>
        </div>

        {/* Stat Card: To Order */}
        <div
          id="stat-to-order"
          onClick={() => onNavigate('all_items')}
          className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-lg p-4 flex flex-col justify-between h-24 hover:bg-[#ffdad6]/50 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-[11px] font-semibold text-[#ba1a1a] uppercase tracking-wider">
            To Order
          </span>
          <span className="text-3xl font-bold text-[#ba1a1a] tracking-tight">{toOrderCount}</span>
        </div>

        {/* Stat Card: Ordered */}
        <div
          id="stat-ordered"
          onClick={() => onNavigate('all_items')}
          className="bg-[#ffede6]/40 border border-[#943700]/20 rounded-lg p-4 flex flex-col justify-between h-24 hover:bg-[#ffede6]/60 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-[11px] font-semibold text-[#943700] uppercase tracking-wider">
            Ordered
          </span>
          <span className="text-3xl font-bold text-[#943700] tracking-tight">{orderedCount}</span>
        </div>

        {/* Stat Card: Received */}
        <div
          id="stat-received"
          onClick={() => onNavigate('all_items')}
          className="bg-[#d5e3fc]/30 border border-[#004ac6]/20 rounded-lg p-4 flex flex-col justify-between h-24 col-span-2 md:col-span-1 hover:bg-[#d5e3fc]/50 cursor-pointer transition-all shadow-xs"
        >
          <span className="text-[11px] font-semibold text-[#004ac6] uppercase tracking-wider">
            Received
          </span>
          <span className="text-3xl font-bold text-[#004ac6] tracking-tight">{receivedCount}</span>
        </div>
      </section>

      {/* Main Content Area */}
      {totalItems === 0 ? (
        /* Empty State matching screenshot */
        <section
          id="dashboard-empty-state"
          className="flex-1 flex items-center justify-center bg-white border border-[#e1e2ed] rounded-xl p-8 min-h-[420px] shadow-xs"
        >
          <div className="max-w-md text-center flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-[#ededf9] flex items-center justify-center rounded-full text-[#737686] mb-2">
              <span className="material-symbols-outlined text-5xl">photo_camera</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#191b23] tracking-tight">No products yet.</h3>
              <p className="text-base text-[#434655] max-w-sm">
                Take a photo of an out-of-stock product to add your first item.
              </p>
            </div>
            <button
              id="dashboard-empty-take-photo-btn"
              onClick={onTakePhoto}
              className="bg-[#004ac6] hover:bg-[#003ea8] active:scale-95 text-white font-semibold rounded-lg px-6 py-3.5 h-12 flex items-center justify-center gap-3 transition-all shadow-sm w-full md:w-auto mt-2"
            >
              <span className="material-symbols-outlined fill-icon text-[22px]">add_a_photo</span>
              <span>Take Product Photo</span>
            </button>
          </div>
        </section>
      ) : (
        /* Populated Active Warehouse Dashboard */
        <div className="flex flex-col gap-6">
          {/* Urgent Needs Reorder Banner */}
          {urgentItems.length > 0 && (
            <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/30 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ba1a1a]/10 flex items-center justify-center text-[#ba1a1a] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-2xl">priority_high</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#191b23]">
                    {urgentItems.length} {urgentItems.length === 1 ? 'Item' : 'Items'} Require Immediate Reorder
                  </h4>
                  <p className="text-sm text-[#434655]">
                    Stock depleted or critical minimums reached in Warehouse Alpha.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => onNavigate('all_items')}
                  className="bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Review Out of Stock
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions & Recent Inventory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Logged Items */}
            <div className="lg:col-span-2 bg-white border border-[#e1e2ed] rounded-xl p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-[#e1e2ed] mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#191b23]">Recent Inventory Entries</h3>
                  <p className="text-xs text-[#434655]">Latest products photographed and logged</p>
                </div>
                <button
                  onClick={() => onNavigate('all_items')}
                  className="text-xs font-semibold text-[#004ac6] hover:underline flex items-center gap-1"
                >
                  View All Items
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="divide-y divide-[#e1e2ed]">
                {items.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#faf8ff] px-2 rounded-lg transition-colors"
                  >
                    <div
                      onClick={() => onSelectItemForDetail(item)}
                      className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#e1e2ed] overflow-hidden shrink-0 border border-[#c3c6d7]">
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#191b23] truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#434655]">
                          <span className="font-mono bg-[#f3f3fe] px-1.5 py-0.5 rounded border border-[#c3c6d7]/60">
                            {item.sku}
                          </span>
                          <span>•</span>
                          <span className="truncate">{item.supplierName}</span>
                          <span>•</span>
                          <span className="font-medium text-[#191b23]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'to_order' && (
                        <span className="bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#ba1a1a]/20">
                          To Order
                        </span>
                      )}
                      {item.status === 'ordered' && (
                        <span className="bg-[#ffede6] text-[#943700] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#943700]/20">
                          Ordered
                        </span>
                      )}
                      {item.status === 'received' && (
                        <span className="bg-[#d5e3fc] text-[#004ac6] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#004ac6]/20">
                          Received
                        </span>
                      )}

                      {/* Fast Action Dropdown */}
                      <select
                        aria-label={`Change status for ${item.name}`}
                        value={item.status}
                        onChange={(e) =>
                          onUpdateItemStatus(
                            item.id,
                            e.target.value as 'to_order' | 'ordered' | 'received'
                          )
                        }
                        className="text-xs bg-[#f3f3fe] border border-[#c3c6d7] rounded-md px-2 py-1 text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                      >
                        <option value="to_order">To Order</option>
                        <option value="ordered">Ordered</option>
                        <option value="received">Received</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Quick Camera Trigger & Suppliers Summary */}
            <div className="flex flex-col gap-6">
              {/* Camera Card */}
              <div className="bg-white border border-[#e1e2ed] rounded-xl p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d5e3fc] flex items-center justify-center text-[#004ac6]">
                    <span className="material-symbols-outlined fill-icon text-xl">photo_camera</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#191b23]">Photo Scanner</h4>
                    <p className="text-xs text-[#434655]">Log depleted stock instantly</p>
                  </div>
                </div>
                <p className="text-xs text-[#434655] leading-relaxed">
                  Capture photos of depleted shelves or parts directly to auto-allocate them to vendors.
                </p>
                <button
                  onClick={onTakePhoto}
                  className="w-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-lg">add_a_photo</span>
                  Take Product Photo
                </button>
              </div>

              {/* Suppliers Quick List */}
              <div className="bg-white border border-[#e1e2ed] rounded-xl p-5 shadow-xs flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] mb-3">
                  <h4 className="text-sm font-bold text-[#191b23]">Active Suppliers</h4>
                  <button
                    onClick={() => onNavigate('suppliers')}
                    className="text-xs font-semibold text-[#004ac6] hover:underline"
                  >
                    Manage
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 flex-1">
                  {suppliers.slice(0, 3).map((sup) => {
                    const supItems = items.filter((i) => i.supplierId === sup.id);
                    return (
                      <div
                        key={sup.id}
                        onClick={() => onNavigate('suppliers')}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#faf8ff] hover:bg-[#ededf9] border border-[#e1e2ed] cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#191b23] truncate">{sup.name}</p>
                          <p className="text-[11px] text-[#434655] truncate">{sup.category}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#004ac6] bg-[#d5e3fc] px-2 py-0.5 rounded-full ml-2 shrink-0">
                          {supItems.length} {supItems.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    );
                  })}
                  {suppliers.length === 0 && (
                    <p className="text-xs text-[#434655] italic py-2 text-center">
                      No suppliers registered yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
