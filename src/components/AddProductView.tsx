import React, { useState, useEffect } from 'react';
import { Supplier, InventoryItem, ItemStatus, ActiveScreen } from '../types';
import { DEFAULT_HARDWARE_PHOTO, SAMPLE_PHOTOS } from '../data';

interface AddProductViewProps {
  suppliers: Supplier[];
  onSaveProduct: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onOpenAddSupplier: () => void;
  onTriggerCamera: (onPhotoCaptured: (url: string) => void) => void;
  onNavigate: (screen: ActiveScreen) => void;
  initialSupplierId?: string;
  initialPhotoUrl?: string;
}

export const AddProductView: React.FC<AddProductViewProps> = ({
  suppliers,
  onSaveProduct,
  onOpenAddSupplier,
  onTriggerCamera,
  onNavigate,
  initialSupplierId,
  initialPhotoUrl,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl || DEFAULT_HARDWARE_PHOTO);
  const [supplierId, setSupplierId] = useState<string>(
    initialSupplierId || (suppliers.length > 0 ? suppliers[0].id : '')
  );
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<ItemStatus>('to_order');
  const [notes, setNotes] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  useEffect(() => {
    if (initialSupplierId) {
      setSupplierId(initialSupplierId);
    } else if (suppliers.length > 0 && !supplierId) {
      setSupplierId(suppliers[0].id);
    }
  }, [suppliers, initialSupplierId, supplierId]);

  useEffect(() => {
    if (initialPhotoUrl) {
      setPhotoUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl]);

  const handleRetake = () => {
    onTriggerCamera((capturedUrl) => {
      setPhotoUrl(capturedUrl);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const selectedSupplier = suppliers.find((s) => s.id === supplierId);
    const supplierName = selectedSupplier ? selectedSupplier.name : 'Unallocated';

    const generatedSku = sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}-${productName.slice(0, 3).toUpperCase()}`;

    onSaveProduct({
      name: productName.trim(),
      sku: generatedSku.toUpperCase(),
      quantity: Math.max(1, Number(quantity) || 1),
      status,
      supplierId: supplierId || (suppliers[0]?.id ?? 'unallocated'),
      supplierName,
      photoUrl: photoUrl || DEFAULT_HARDWARE_PHOTO,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });

    onNavigate('all_items');
  };

  return (
    <div id="add-product-view" className="flex-1 flex flex-col h-full overflow-y-auto bg-[#faf8ff]">
      {/* Canvas Content matching Screenshot 4 */}
      <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full pb-32">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#191b23] mb-1 tracking-tight">
            New Inventory Entry
          </h2>
          <p className="text-sm text-[#434655]">
            Capture product details and allocate to a supplier.
          </p>
        </div>

        <form onSubmit={handleFormSubmit}>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Photo Preview */}
            <div className="flex flex-col gap-4 bg-white border border-[#c3c6d7] p-4 rounded-xl shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e1e2ed] pb-2">
                <h3 className="text-base font-semibold text-[#191b23]">1. Photo Preview</h3>
                <span className="text-[11px] text-[#434655] font-medium">Out-of-Stock Item</span>
              </div>

              {/* Photo Box */}
              <div className="relative w-full aspect-square bg-[#e1e2ed] rounded-lg overflow-hidden flex items-center justify-center border border-[#c3c6d7] group">
                <img
                  src={photoUrl}
                  alt="Product preview"
                  className="object-cover w-full h-full absolute inset-0 z-0"
                  referrerPolicy="no-referrer"
                />

                {/* Overlay for Retake on hover (desktop) */}
                <div className="absolute inset-0 bg-[#191b23]/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10 p-4">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="bg-white text-[#191b23] px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-[#f3f3fe] transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    Retake / Open Camera
                  </button>

                  <label className="bg-white/90 text-[#191b23] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-white transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(!showPresetPicker)}
                    className="text-white text-xs underline mt-1 hover:text-blue-200"
                  >
                    Choose preset image
                  </button>
                </div>
              </div>

              {/* Mobile Retake & Upload Buttons */}
              <div className="flex flex-col gap-2 md:hidden">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex-1 border border-[#737686] text-[#191b23] bg-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 h-11 hover:bg-[#f3f3fe] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    Retake Photo
                  </button>
                  <label className="border border-[#737686] text-[#191b23] bg-white px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 h-11 hover:bg-[#f3f3fe] cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sample Preset Selector */}
              {showPresetPicker && (
                <div className="p-3 bg-[#f3f3fe] border border-[#c3c6d7] rounded-lg">
                  <p className="text-xs font-semibold text-[#191b23] mb-2">
                    Select sample hardware photo:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(sample.url);
                          setShowPresetPicker(false);
                        }}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          photoUrl === sample.url ? 'border-[#004ac6] ring-2 ring-[#004ac6]/30' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Details & Supplier */}
            <div className="flex flex-col gap-6">
              {/* Step 2: Select Supplier */}
              <div className="flex flex-col gap-4 bg-white border border-[#c3c6d7] p-4 rounded-xl shadow-xs">
                <div className="flex justify-between items-end border-b border-[#e1e2ed] pb-2 mb-1">
                  <h3 className="text-base font-semibold text-[#191b23]">2. Supplier Allocation</h3>
                  <span className="bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#ba1a1a]/20">
                    To Order
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider">
                    Select Supplier
                  </label>
                  <div className="relative">
                    <select
                      id="product-supplier-select"
                      value={supplierId}
                      onChange={(e) => setSupplierId(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 border border-[#c3c6d7] rounded-lg bg-white text-sm appearance-none focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] text-[#191b23] cursor-pointer"
                    >
                      {suppliers.length === 0 ? (
                        <option value="" disabled>
                          No suppliers created yet
                        </option>
                      ) : (
                        <>
                          <option value="" disabled>
                            Choose a supplier...
                          </option>
                          {suppliers.map((sup) => (
                            <option key={sup.id} value={sup.id}>
                              {sup.name} ({sup.category})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#434655] pointer-events-none text-[20px]">
                      arrow_drop_down
                    </span>
                  </div>

                  {/* Inline Helper / Add Supplier */}
                  {suppliers.length === 0 ? (
                    <div className="mt-2 p-4 border border-dashed border-[#c3c6d7] rounded-lg bg-[#ededf9] text-center flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[#737686] text-3xl">
                        domain_disabled
                      </span>
                      <p className="text-sm text-[#434655]">No suppliers available.</p>
                      <button
                        type="button"
                        onClick={onOpenAddSupplier}
                        className="text-[#004ac6] text-sm font-semibold hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add New Supplier
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#434655]">Can't find the right vendor?</span>
                      <button
                        type="button"
                        onClick={onOpenAddSupplier}
                        className="text-xs font-semibold text-[#004ac6] hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        Add New Supplier
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Product Details */}
              <div className="flex flex-col gap-4 bg-white border border-[#c3c6d7] p-4 rounded-xl shadow-xs flex-1">
                <h3 className="text-base font-semibold text-[#191b23] border-b border-[#e1e2ed] pb-2">
                  3. Product Details
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      id="product-name-input"
                      type="text"
                      required
                      placeholder="e.g. Heavy Duty Widget"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full h-11 px-4 border border-[#c3c6d7] rounded-lg bg-white text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider">
                        Product Code / SKU
                      </label>
                      <input
                        id="product-sku-input"
                        type="text"
                        placeholder="SKU/UPC"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full h-11 px-4 border border-[#c3c6d7] rounded-lg bg-white text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] uppercase font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-28">
                      <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider">
                        Qty
                      </label>
                      <input
                        id="product-qty-input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-11 px-4 border border-[#c3c6d7] rounded-lg bg-white text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider">
                      Initial Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setStatus('to_order')}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          status === 'to_order'
                            ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]'
                            : 'bg-white text-[#434655] border-[#c3c6d7]'
                        }`}
                      >
                        To Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('ordered')}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          status === 'ordered'
                            ? 'bg-[#ffede6] text-[#943700] border-[#943700]'
                            : 'bg-white text-[#434655] border-[#c3c6d7]'
                        }`}
                      >
                        Ordered
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('received')}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          status === 'received'
                            ? 'bg-[#d5e3fc] text-[#004ac6] border-[#004ac6]'
                            : 'bg-white text-[#434655] border-[#c3c6d7]'
                        }`}
                      >
                        Received
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#434655] uppercase tracking-wider">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="product-notes-input"
                      rows={3}
                      placeholder="Add any condition notes, bin location, urgent flags..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-4 border border-[#c3c6d7] rounded-lg bg-white text-sm text-[#191b23] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button (Sticky on mobile, inline on desktop) */}
          <div className="fixed md:static bottom-0 left-0 w-full md:w-auto p-4 md:p-0 md:mt-8 bg-[#faf8ff] border-t border-[#c3c6d7] md:border-none md:bg-transparent z-40 flex justify-end">
            <button
              id="save-product-btn"
              type="submit"
              className="w-full md:w-auto bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white h-12 px-8 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>Save Product</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
