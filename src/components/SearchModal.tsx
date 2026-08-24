import React, { useState, useEffect } from 'react';
import { InventoryItem, Supplier } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  suppliers: Supplier[];
  onSelectItem: (item: InventoryItem) => void;
  onSelectSupplier: (supplier: Supplier) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  suppliers,
  onSelectItem,
  onSelectSupplier,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = query
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.sku.toLowerCase().includes(query.toLowerCase())
      )
    : items.slice(0, 4);

  const filteredSuppliers = query
    ? suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      )
    : suppliers.slice(0, 3);

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border border-[#c3c6d7] max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e1e2ed] bg-[#faf8ff] gap-3">
          <span className="material-symbols-outlined text-[#004ac6] text-2xl">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Search items, SKUs, or suppliers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-[#191b23] focus:outline-none placeholder-[#737686]"
          />
          <button
            onClick={onClose}
            className="text-xs bg-[#e1e2ed] text-[#434655] px-2 py-1 rounded font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-[#e1e2ed]">
          {/* Items Section */}
          <div>
            <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider block mb-2">
              Inventory Items ({filteredItems.length})
            </span>
            {filteredItems.length === 0 ? (
              <p className="text-xs text-[#737686] italic py-2">No matching products found.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#faf8ff] cursor-pointer transition-colors border border-transparent hover:border-[#c3c6d7]"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover border border-[#c3c6d7]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#191b23] truncate">{item.name}</p>
                      <p className="text-xs text-[#434655] font-mono">{item.sku} • {item.supplierName}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#d5e3fc] text-[#004ac6]">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suppliers Section */}
          <div className="pt-3">
            <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider block mb-2">
              Suppliers ({filteredSuppliers.length})
            </span>
            {filteredSuppliers.length === 0 ? (
              <p className="text-xs text-[#737686] italic py-2">No matching suppliers found.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredSuppliers.map((sup) => (
                  <div
                    key={sup.id}
                    onClick={() => {
                      onSelectSupplier(sup);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#faf8ff] cursor-pointer transition-colors border border-transparent hover:border-[#c3c6d7]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#004ac6] text-xl">
                        factory
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#191b23]">{sup.name}</p>
                        <p className="text-xs text-[#434655]">{sup.category}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#434655]">{sup.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
