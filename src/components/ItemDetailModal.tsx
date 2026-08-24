import React from 'react';
import { InventoryItem, Supplier, ItemStatus } from '../types';

interface ItemDetailModalProps {
  item: InventoryItem | null;
  suppliers: Supplier[];
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ItemStatus) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  suppliers,
  onClose,
  onUpdateStatus,
  onUpdateQuantity,
  onDeleteItem,
  onEdit,
}) => {
  if (!item) return null;

  const supplier = suppliers.find((s) => s.id === item.supplierId);

  return (
    <div
      id="item-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl border border-[#c3c6d7] max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e2ed] bg-[#faf8ff]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#d5e3fc] text-[#004ac6] font-bold px-2 py-1 rounded">
              {item.sku}
            </span>
            <h3 className="text-lg font-bold text-[#191b23] truncate max-w-md">{item.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#434655] hover:text-[#191b23] hover:bg-[#ededf9] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Big Photo Preview */}
            <div className="aspect-square bg-[#ededf9] rounded-xl overflow-hidden border border-[#c3c6d7]">
              <img
                src={item.photoUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Item Attributes & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Status Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1.5">
                    Order Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onUpdateStatus(item.id, 'to_order')}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                        item.status === 'to_order'
                          ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] shadow-xs'
                          : 'bg-white text-[#434655] border-[#c3c6d7]'
                      }`}
                    >
                      To Order
                    </button>
                    <button
                      onClick={() => onUpdateStatus(item.id, 'ordered')}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                        item.status === 'ordered'
                          ? 'bg-[#ffede6] text-[#943700] border-[#943700] shadow-xs'
                          : 'bg-white text-[#434655] border-[#c3c6d7]'
                      }`}
                    >
                      Ordered
                    </button>
                    <button
                      onClick={() => onUpdateStatus(item.id, 'received')}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                        item.status === 'received'
                          ? 'bg-[#d5e3fc] text-[#004ac6] border-[#004ac6] shadow-xs'
                          : 'bg-white text-[#434655] border-[#c3c6d7]'
                      }`}
                    >
                      Received
                    </button>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div>
                  <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1.5">
                    Target Order Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-[#f3f3fe] border border-[#c3c6d7] text-[#191b23] font-bold text-lg hover:bg-[#e1e2ed]"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-[#191b23] min-w-[50px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-[#f3f3fe] border border-[#c3c6d7] text-[#191b23] font-bold text-lg hover:bg-[#e1e2ed]"
                    >
                      +
                    </button>
                    <span className="text-xs text-[#434655]">units required</span>
                  </div>
                </div>

                {/* Supplier Information Card */}
                <div className="p-3.5 bg-[#faf8ff] rounded-xl border border-[#e1e2ed]">
                  <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider block mb-1">
                    Allocated Supplier
                  </span>
                  <p className="text-sm font-bold text-[#191b23]">{item.supplierName}</p>
                  {supplier && (
                    <div className="mt-2 space-y-1 text-xs text-[#434655]">
                      <p>Contact: {supplier.contactName}</p>
                      <p>Email: {supplier.email}</p>
                      <p>Phone: {supplier.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Condition Notes */}
          {item.notes && (
            <div className="p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]">
              <span className="text-xs font-semibold text-[#434655] uppercase tracking-wider block mb-1">
                Warehouse / Condition Notes
              </span>
              <p className="text-sm text-[#191b23] whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}

          {/* Timestamp Info */}
          <div className="flex items-center justify-between text-xs text-[#737686] pt-2 border-t border-[#e1e2ed]">
            <span>Entry Logged: {new Date(item.createdAt).toLocaleString()}</span>
            <span>Facility: Warehouse Alpha</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#faf8ff] border-t border-[#e1e2ed] flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Remove "${item.name}"?`)) {
                onDeleteItem(item.id);
                onClose();
              }
            }}
            className="text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Delete Item
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(item);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-[#191b23] bg-white border border-[#c3c6d7] hover:bg-[#ededf9] rounded-lg transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#004ac6] hover:bg-[#003ea8] rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
