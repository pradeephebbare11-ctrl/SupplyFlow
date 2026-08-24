import React, { useState } from 'react';
import { Supplier, InventoryItem, ActiveScreen } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  items: InventoryItem[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onAddProductForSupplier: (supplierId: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  items,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onNavigate,
  onAddProductForSupplier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form State
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('General Hardware');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingSupplier(null);
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setCategory('General Hardware');
    setAddress('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name);
    setContactName(sup.contactName);
    setEmail(sup.email);
    setPhone(sup.phone);
    setCategory(sup.category);
    setAddress(sup.address || '');
    setNotes(sup.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSupplier) {
      onEditSupplier({
        ...editingSupplier,
        name: name.trim(),
        contactName: contactName.trim() || 'Purchasing Desk',
        email: email.trim() || 'orders@supplier.internal',
        phone: phone.trim() || '+1 (555) 000-0000',
        category: category.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    } else {
      onAddSupplier({
        name: name.trim(),
        contactName: contactName.trim() || 'Purchasing Desk',
        email: email.trim() || 'orders@supplier.internal',
        phone: phone.trim() || '+1 (555) 000-0000',
        category: category.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    }
    setIsModalOpen(false);
  };

  // Categories list
  const categories = Array.from(new Set(suppliers.map((s) => s.category).filter(Boolean)));

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="suppliers-view" className="flex-1 flex flex-col h-full overflow-hidden bg-[#faf8ff]">
      {/* Header matching screenshot 1 */}
      <header className="flex justify-between items-center px-4 md:px-8 py-5 border-b border-[#c3c6d7] bg-[#faf8ff] shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#191b23] tracking-tight">Suppliers</h2>
          {suppliers.length > 0 && (
            <p className="text-xs text-[#434655] mt-0.5">
              {suppliers.length} registered vendors for Warehouse Alpha
            </p>
          )}
        </div>
        <button
          id="add-new-supplier-btn"
          onClick={openAddModal}
          className="bg-[#004ac6] text-white font-semibold text-sm px-4 md:px-5 py-2.5 rounded-lg hover:bg-[#003ea8] active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Supplier</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {suppliers.length === 0 ? (
          /* Empty State Canvas matching screenshot 1 */
          <div
            id="suppliers-empty-state"
            className="h-full min-h-[440px] flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-[#c3c6d7] shadow-xs"
          >
            <div className="max-w-md w-full bg-[#ededf9] rounded-xl border border-[#c3c6d7] p-8 flex flex-col items-center text-center justify-center shadow-xs">
              <div className="w-20 h-20 bg-[#d5e3fc] rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#004ac6] text-4xl">factory</span>
              </div>
              <h3 className="text-2xl font-bold text-[#191b23] mb-2 tracking-tight">
                No suppliers yet.
              </h3>
              <p className="text-base text-[#434655] mb-6 max-w-sm mx-auto">
                Add your first supplier to start organizing your reorder items.
              </p>
              <button
                id="empty-add-supplier-btn"
                onClick={openAddModal}
                className="bg-[#faf8ff] text-[#004ac6] border border-[#737686] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#f3f3fe] active:scale-[0.98] transition-colors flex items-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Add Supplier</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated Suppliers Directory */
          <div className="flex flex-col gap-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#434655] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search suppliers, contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
                />
              </div>

              {categories.length > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#004ac6] text-white'
                        : 'bg-white text-[#434655] border border-[#c3c6d7] hover:bg-[#ededf9]'
                    }`}
                  >
                    All Categories ({suppliers.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#004ac6] text-white'
                          : 'bg-white text-[#434655] border border-[#c3c6d7] hover:bg-[#ededf9]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSuppliers.map((supplier) => {
                const supplierItems = items.filter((i) => i.supplierId === supplier.id);
                const toOrder = supplierItems.filter((i) => i.status === 'to_order').length;
                const ordered = supplierItems.filter((i) => i.status === 'ordered').length;
                const received = supplierItems.filter((i) => i.status === 'received').length;

                return (
                  <div
                    key={supplier.id}
                    className="bg-white border border-[#e1e2ed] rounded-xl p-5 shadow-xs hover:border-[#004ac6]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#d5e3fc] text-[#004ac6] flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[22px]">factory</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-[#191b23] text-base leading-tight">
                              {supplier.name}
                            </h3>
                            <span className="inline-block text-[11px] font-semibold text-[#004ac6] bg-[#d5e3fc]/60 px-2 py-0.5 rounded mt-0.5">
                              {supplier.category}
                            </span>
                          </div>
                        </div>

                        {/* Edit / Delete Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(supplier)}
                            className="p-1.5 text-[#434655] hover:text-[#004ac6] hover:bg-[#ededf9] rounded-md transition-colors"
                            title="Edit Supplier"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete supplier "${supplier.name}"?`)) {
                                onDeleteSupplier(supplier.id);
                              }
                            }}
                            className="p-1.5 text-[#434655] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-md transition-colors"
                            title="Delete Supplier"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-1.5 text-xs text-[#434655] mb-4 bg-[#faf8ff] p-3 rounded-lg border border-[#e1e2ed]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#737686]">
                            person
                          </span>
                          <span className="font-medium text-[#191b23]">{supplier.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#737686]">
                            mail
                          </span>
                          <a
                            href={`mailto:${supplier.email}`}
                            className="hover:underline hover:text-[#004ac6] truncate"
                          >
                            {supplier.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#737686]">
                            call
                          </span>
                          <span>{supplier.phone}</span>
                        </div>
                      </div>

                      {supplier.notes && (
                        <p className="text-xs text-[#434655] italic mb-4 line-clamp-2">
                          "{supplier.notes}"
                        </p>
                      )}
                    </div>

                    {/* Footer: Reorder Stats & Quick Action */}
                    <div className="pt-3 border-t border-[#e1e2ed] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="bg-[#ffdad6] text-[#ba1a1a] font-semibold px-2 py-0.5 rounded text-[11px]">
                          {toOrder} to order
                        </span>
                        <span className="bg-[#ffede6] text-[#943700] font-semibold px-2 py-0.5 rounded text-[11px]">
                          {ordered} ord
                        </span>
                      </div>

                      <button
                        onClick={() => onAddProductForSupplier(supplier.id)}
                        className="text-xs font-semibold text-[#004ac6] hover:bg-[#d5e3fc]/60 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                        + Item
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191b23]/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#c3c6d7] max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e2ed] mb-4">
              <h3 className="text-lg font-bold text-[#191b23]">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#434655] hover:text-[#191b23] p-1 rounded-md"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Company / Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Industrial Supplies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fasteners & Hardware"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="orders@supplier.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Facility / Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Logistics Blvd, Dock 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1">
                  Terms & Delivery Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Net 30, delivers on Tuesdays & Thursdays"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#c3c6d7] rounded-lg text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e1e2ed]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-[#434655] hover:bg-[#ededf9] rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingSupplier ? 'Save Changes' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
