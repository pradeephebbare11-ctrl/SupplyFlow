import React, { useState } from 'react';
import { InventoryItem, Supplier, ItemStatus } from '../types';

interface AllItemsViewProps {
  items: InventoryItem[];
  suppliers: Supplier[];
  onTakePhoto: () => void;
  onUpdateStatus: (id: string, newStatus: ItemStatus) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: InventoryItem) => void;
  onSelectItemForDetail: (item: InventoryItem) => void;
}

export const AllItemsView: React.FC<AllItemsViewProps> = ({
  items,
  suppliers,
  onTakePhoto,
  onUpdateStatus,
  onUpdateQuantity,
  onDeleteItem,
  onEditItem,
  onSelectItemForDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | ItemStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSupplier =
      selectedSupplierId === 'all' || item.supplierId === selectedSupplierId;

    const matchesStatus = activeFilter === 'all' || item.status === activeFilter;

    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'to_order':
        return (
          <span className="bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#ba1a1a]/20 shrink-0">
            To Order
          </span>
        );
      case 'ordered':
        return (
          <span className="bg-[#ffede6] text-[#943700] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#943700]/20 shrink-0">
            Ordered
          </span>
        );
      case 'received':
        return (
          <span className="bg-[#d5e3fc] text-[#004ac6] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#004ac6]/20 shrink-0">
            Received
          </span>
        );
    }
  };

  return (
    <div id="all-items-view" className="flex-1 flex flex-col h-full overflow-hidden bg-[#faf8ff]">
      {/* Desktop Header Area */}
      <div className="hidden md:flex justify-between items-center px-8 py-5 bg-[#faf8ff] border-b border-[#e1e2ed] shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#191b23] tracking-tight">
            All Items
          </h1>
          <p className="text-xs text-[#434655] mt-0.5">
            {items.length} items tracked across all categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTakePhoto}
            className="bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            <span>Take Photo</span>
          </button>
        </div>
      </div>

      {/* Filter Bar matching Screenshot 3 */}
      <div className="bg-[#faf8ff] px-4 md:px-8 py-4 border-b border-[#e1e2ed] flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center shrink-0 z-20">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655] text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="items-search-input"
            type="text"
            placeholder="Search items, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-11 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191b23]"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
            </button>
          )}
        </div>

        {/* Supplier Filter */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655] text-[20px] pointer-events-none">
            factory
          </span>
          <select
            id="supplier-filter-select"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="w-full pl-10 pr-9 h-11 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] appearance-none focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-colors cursor-pointer"
          >
            <option value="all">All Suppliers ({suppliers.length})</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#434655] text-[20px] pointer-events-none">
            arrow_drop_down
          </span>
        </div>

        {/* Status Chips */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide py-1">
          <button
            id="filter-chip-all"
            onClick={() => setActiveFilter('all')}
            className={`whitespace-nowrap px-4 h-10 rounded-full text-sm font-semibold transition-colors flex items-center shrink-0 ${
              activeFilter === 'all'
                ? 'border border-[#004ac6] bg-[#004ac6]/10 text-[#004ac6]'
                : 'border border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            All
          </button>

          <button
            id="filter-chip-to-order"
            onClick={() => setActiveFilter('to_order')}
            className={`whitespace-nowrap px-4 h-10 rounded-full text-sm font-semibold transition-colors flex items-center shrink-0 ${
              activeFilter === 'to_order'
                ? 'border border-[#ba1a1a] bg-[#ba1a1a]/15 text-[#ba1a1a]'
                : 'border border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            To Order
          </button>

          <button
            id="filter-chip-ordered"
            onClick={() => setActiveFilter('ordered')}
            className={`whitespace-nowrap px-4 h-10 rounded-full text-sm font-semibold transition-colors flex items-center shrink-0 ${
              activeFilter === 'ordered'
                ? 'border border-[#943700] bg-[#943700]/15 text-[#943700]'
                : 'border border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            Ordered
          </button>

          <button
            id="filter-chip-received"
            onClick={() => setActiveFilter('received')}
            className={`whitespace-nowrap px-4 h-10 rounded-full text-sm font-semibold transition-colors flex items-center shrink-0 ${
              activeFilter === 'received'
                ? 'border border-[#004ac6] bg-[#004ac6]/15 text-[#004ac6]'
                : 'border border-[#c3c6d7] bg-white text-[#434655] hover:bg-[#ededf9]'
            }`}
          >
            Received
          </button>
        </div>

        {/* View toggle if populated */}
        {filteredItems.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 ml-auto border border-[#c3c6d7] rounded-lg p-1 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-[#d5e3fc] text-[#004ac6]' : 'text-[#434655]'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${
                viewMode === 'table' ? 'bg-[#d5e3fc] text-[#004ac6]' : 'text-[#434655]'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {filteredItems.length === 0 ? (
          /* Empty State Canvas matching screenshot 3 */
          <div
            id="items-empty-state"
            className="h-full min-h-[440px] flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full bg-white border border-[#c3c6d7] rounded-xl p-8 md:p-10 flex flex-col items-center text-center shadow-xs">
              <div className="w-24 h-24 bg-[#e7e7f3] rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-[#737686]">
                  inventory_2
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#191b23] mb-2 tracking-tight">
                No products yet.
              </h2>
              <p className="text-sm md:text-base text-[#434655] mb-8 max-w-[280px]">
                Take a photo of an out-of-stock product to get started.
              </p>
              <button
                id="items-empty-take-photo-btn"
                onClick={onTakePhoto}
                className="w-full sm:w-auto bg-[#004ac6] hover:bg-[#003ea8] text-white px-8 h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                <span>Take Product Photo</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e1e2ed] rounded-xl p-4 shadow-xs hover:border-[#004ac6]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-3 mb-3">
                    {/* Photo thumbnail with zoom/detail trigger */}
                    <div
                      onClick={() => onSelectItemForDetail(item)}
                      className="w-20 h-20 rounded-lg bg-[#e1e2ed] overflow-hidden shrink-0 border border-[#c3c6d7] cursor-pointer group relative"
                    >
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm">
                          zoom_in
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3
                          onClick={() => onSelectItemForDetail(item)}
                          className="font-bold text-[#191b23] text-sm leading-snug cursor-pointer hover:text-[#004ac6] truncate"
                        >
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold bg-[#f3f3fe] text-[#434655] px-1.5 py-0.5 rounded border border-[#c3c6d7]">
                          {item.sku}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-[#434655] truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">factory</span>
                        <span>{item.supplierName}</span>
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-[#434655] bg-[#faf8ff] p-2 rounded-lg border border-[#e1e2ed] mb-3 line-clamp-2 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Card Controls */}
                <div className="pt-3 border-t border-[#e1e2ed] flex items-center justify-between gap-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-[#f3f3fe] border border-[#c3c6d7] rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center text-[#434655] hover:bg-[#e1e2ed] rounded"
                      title="Decrease Qty"
                    >
                      -
                    </button>
                    <span className="px-1.5 text-xs font-bold text-[#191b23] min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#434655] hover:bg-[#e1e2ed] rounded"
                      title="Increase Qty"
                    >
                      +
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as ItemStatus)}
                    className="text-xs font-semibold bg-white border border-[#c3c6d7] rounded-md px-2 py-1.5 text-[#191b23] focus:outline-none focus:border-[#004ac6] cursor-pointer"
                  >
                    <option value="to_order">To Order</option>
                    <option value="ordered">Ordered</option>
                    <option value="received">Received</option>
                  </select>

                  {/* Delete / Edit */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-[#434655] hover:text-[#004ac6] hover:bg-[#ededf9] rounded-md transition-colors"
                      title="Edit Item"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from inventory?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="p-1.5 text-[#434655] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-md transition-colors"
                      title="Delete Item"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white border border-[#e1e2ed] rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f3f3fe] border-b border-[#e1e2ed] text-[#434655] uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">SKU / Code</th>
                    <th className="p-3.5">Supplier</th>
                    <th className="p-3.5">Qty</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e2ed]">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#faf8ff] transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#c3c6d7]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold text-sm text-[#191b23]">{item.name}</span>
                      </td>
                      <td className="p-3.5 font-mono text-[#434655]">{item.sku}</td>
                      <td className="p-3.5 text-[#191b23]">{item.supplierName}</td>
                      <td className="p-3.5 font-bold text-[#191b23]">{item.quantity}</td>
                      <td className="p-3.5">{getStatusBadge(item.status)}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value as ItemStatus)}
                          className="text-xs bg-white border border-[#c3c6d7] rounded px-2 py-1 text-[#191b23]"
                        >
                          <option value="to_order">To Order</option>
                          <option value="ordered">Ordered</option>
                          <option value="received">Received</option>
                        </select>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="text-[#ba1a1a] hover:bg-[#ffdad6]/40 p-1 rounded"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
