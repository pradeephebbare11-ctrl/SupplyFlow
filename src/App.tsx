import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Supplier,
  InventoryItem,
  ActiveScreen,
  ItemStatus,
  ManagerProfile,
} from './types';
import {
  DEFAULT_MANAGER,
  INITIAL_SAMPLE_SUPPLIERS,
  INITIAL_SAMPLE_ITEMS,
  DEFAULT_HARDWARE_PHOTO,
} from './data';
import { SideNavBar } from './components/SideNavBar';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { SuppliersView } from './components/SuppliersView';
import { AllItemsView } from './components/AllItemsView';
import { AddProductView } from './components/AddProductView';
import { SettingsView } from './components/SettingsView';
import { CameraModal } from './components/CameraModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { LoginView } from './components/LoginView';
import {
  deleteItem,
  deleteSupplier,
  insertItem,
  insertSupplier,
  isSupabaseConfigured,
  loadWorkspace,
  replaceDemoData,
  clearWorkspace,
  signOut,
  supabase,
  updateItem,
  updateSupplier,
  uploadProductImage,
  upsertManager,
} from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    if (!supabase) return;
    const client = supabase;
    client.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event: string, nextSession: Session | null) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // LocalStorage keys
  const STORAGE_KEY_SUPPLIERS = 'supplyflow_suppliers_v1';
  const STORAGE_KEY_ITEMS = 'supplyflow_items_v1';
  const STORAGE_KEY_MANAGER = 'supplyflow_manager_v1';
  const STORAGE_KEY_SCREEN = 'supplyflow_screen_v1';

  // State initialization
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [manager, setManager] = useState<ManagerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MANAGER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MANAGER;
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SCREEN);
    if (saved && ['dashboard', 'suppliers', 'all_items', 'add_product', 'settings'].includes(saved)) {
      return saved as ActiveScreen;
    }
    return 'dashboard';
  });

  // Modal states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<InventoryItem | null>(null);

  // Photo callback for camera modal
  const [pendingCameraCallback, setPendingCameraCallback] = useState<
    ((photoUrl: string) => void) | null
  >(null);

  // Add Product form initial values
  const [addProductInitialSupplierId, setAddProductInitialSupplierId] = useState<string | undefined>(
    undefined
  );
  const [addProductInitialPhotoUrl, setAddProductInitialPhotoUrl] = useState<string | undefined>(
    undefined
  );

  // Keep the current screen locally, while workspace data is stored remotely.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCREEN, activeScreen);
  }, [activeScreen]);

  useEffect(() => {
    if (!session) return;

    loadWorkspace()
      .then(({ suppliers: remoteSuppliers, items: remoteItems, manager: remoteManager }) => {
        setSuppliers(remoteSuppliers);
        setItems(remoteItems);
        if (remoteManager) setManager(remoteManager);
      })
      .catch((error) => {
        console.error('Unable to load workspace from Supabase:', error);
      });
  }, [session]);

  const reportPersistenceError = (error: unknown) => {
    console.error('Supabase persistence error:', error);
    alert(error instanceof Error ? error.message : 'Unable to save changes to Supabase.');
  };

  // Navigation handler
  const handleNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
  };

  // Trigger camera anywhere
  const handleTriggerCamera = (callback?: (photoUrl: string) => void) => {
    if (callback) {
      setPendingCameraCallback(() => callback);
    } else {
      // Default: capture photo and navigate to Add Product screen
      setPendingCameraCallback(() => (photoUrl: string) => {
        setAddProductInitialPhotoUrl(photoUrl);
        setActiveScreen('add_product');
      });
    }
    setIsCameraOpen(true);
  };

  const handleCapturePhoto = (photoDataUrl: string) => {
    setIsCameraOpen(false);
    if (pendingCameraCallback) {
      pendingCameraCallback(photoDataUrl);
      setPendingCameraCallback(null);
    } else {
      setAddProductInitialPhotoUrl(photoDataUrl);
      setActiveScreen('add_product');
    }
  };

  // Supplier CRUD
  const handleAddSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    try {
      await insertSupplier(newSupplier);
    } catch (error) {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== newSupplier.id));
      reportPersistenceError(error);
    }
  };

  const handleEditSupplier = async (updatedSupplier: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updatedSupplier.id ? updatedSupplier : s))
    );
    // Also update supplierName in items
    setItems((prev) =>
      prev.map((item) =>
        item.supplierId === updatedSupplier.id
          ? { ...item, supplierName: updatedSupplier.name }
          : item
      )
    );
    try {
      await updateSupplier(updatedSupplier);
      const affectedItems = items.filter((item) => item.supplierId === updatedSupplier.id);
      await Promise.all(
        affectedItems.map((item) => updateItem({ ...item, supplierName: updatedSupplier.name }))
      );
    } catch (error) {
      reportPersistenceError(error);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
    try {
      await deleteSupplier(supplierId);
    } catch (error) {
      reportPersistenceError(error);
    }
  };

  const handleAddProductForSupplier = (supplierId: string) => {
    setAddProductInitialSupplierId(supplierId);
    setAddProductInitialPhotoUrl(DEFAULT_HARDWARE_PHOTO);
    setActiveScreen('add_product');
  };

  // Inventory Item CRUD
  const handleSaveProduct = async (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const itemId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();
    let photoUrl = itemData.photoUrl;

    try {
      photoUrl = await uploadProductImage(photoUrl, itemId);
    } catch (error) {
      reportPersistenceError(error);
      return;
    }

    const newItem: InventoryItem = {
      ...itemData,
      id: itemId,
      photoUrl,
      createdAt,
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [newItem, ...prev]);
    try {
      await insertItem(newItem);
    } catch (error) {
      setItems((prev) => prev.filter((item) => item.id !== newItem.id));
      reportPersistenceError(error);
    }
  };

  const handleUpdateItemStatus = async (id: string, newStatus: ItemStatus) => {
    const updatedAt = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, updatedAt } : item
      )
    );
    if (selectedItemForDetail?.id === id) {
      setSelectedItemForDetail((prev) =>
        prev ? { ...prev, status: newStatus, updatedAt } : null
      );
    }
    const item = items.find((currentItem) => currentItem.id === id);
    if (item) {
      try {
        await updateItem({ ...item, status: newStatus, updatedAt });
      } catch (error) {
        reportPersistenceError(error);
      }
    }
  };

  const handleUpdateItemQuantity = async (id: string, newQty: number) => {
    const updatedAt = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty, updatedAt } : item
      )
    );
    if (selectedItemForDetail?.id === id) {
      setSelectedItemForDetail((prev) =>
        prev ? { ...prev, quantity: newQty, updatedAt } : null
      );
    }
    const item = items.find((currentItem) => currentItem.id === id);
    if (item) {
      try {
        await updateItem({ ...item, quantity: newQty, updatedAt });
      } catch (error) {
        reportPersistenceError(error);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteItem(id);
    } catch (error) {
      reportPersistenceError(error);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setAddProductInitialSupplierId(item.supplierId);
    setAddProductInitialPhotoUrl(item.photoUrl);
    setActiveScreen('add_product');
  };

  // Demo state controls
  const handleLoadDemoData = async () => {
    setSuppliers(INITIAL_SAMPLE_SUPPLIERS);
    setItems(INITIAL_SAMPLE_ITEMS);
    setActiveScreen('dashboard');
    try {
      await replaceDemoData(INITIAL_SAMPLE_SUPPLIERS, INITIAL_SAMPLE_ITEMS);
    } catch (error) {
      reportPersistenceError(error);
    }
  };

  const handleClearAllData = async () => {
    setSuppliers([]);
    setItems([]);
    setActiveScreen('dashboard');
    try {
      await clearWorkspace();
    } catch (error) {
      reportPersistenceError(error);
    }
  };

  const handleUpdateManager = async (updatedManager: ManagerProfile) => {
    setManager(updatedManager);
    try {
      await upsertManager(updatedManager);
    } catch (error) {
      reportPersistenceError(error);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#191b23] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return <LoginView />;
  }

  return (
    <div className="bg-[#faf8ff] text-[#191b23] min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Side Navigation Bar (Desktop) */}
      <SideNavBar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onTakePhoto={() => handleTriggerCamera()}
        manager={manager}
        itemCount={items.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <TopAppBar
          activeScreen={activeScreen}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={items.filter((i) => i.status === 'to_order').length}
          manager={manager}
          onNavigate={handleNavigate}
        />

        {/* Active Screen View */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {activeScreen === 'dashboard' && (
            <DashboardView
              items={items}
              suppliers={suppliers}
              onNavigate={handleNavigate}
              onTakePhoto={() => handleTriggerCamera()}
              onUpdateItemStatus={handleUpdateItemStatus}
              onSelectItemForDetail={(item) => setSelectedItemForDetail(item)}
            />
          )}

          {activeScreen === 'suppliers' && (
            <SuppliersView
              suppliers={suppliers}
              items={items}
              onAddSupplier={handleAddSupplier}
              onEditSupplier={handleEditSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onNavigate={handleNavigate}
              onAddProductForSupplier={handleAddProductForSupplier}
            />
          )}

          {activeScreen === 'all_items' && (
            <AllItemsView
              items={items}
              suppliers={suppliers}
              onTakePhoto={() => handleTriggerCamera()}
              onUpdateStatus={handleUpdateItemStatus}
              onUpdateQuantity={handleUpdateItemQuantity}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onSelectItemForDetail={(item) => setSelectedItemForDetail(item)}
            />
          )}

          {activeScreen === 'add_product' && (
            <AddProductView
              suppliers={suppliers}
              onSaveProduct={handleSaveProduct}
              onOpenAddSupplier={() => setActiveScreen('suppliers')}
              onTriggerCamera={(cb) => handleTriggerCamera(cb)}
              onNavigate={handleNavigate}
              initialSupplierId={addProductInitialSupplierId}
              initialPhotoUrl={addProductInitialPhotoUrl}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsView
              manager={manager}
              onUpdateManager={handleUpdateManager}
              suppliers={suppliers}
              items={items}
              onLoadDemoData={handleLoadDemoData}
              onClearAllData={handleClearAllData}
              onSignOut={signOut}
            />
          )}
        </main>

        {/* Bottom Navigation Bar (Mobile) */}
        <BottomNavBar
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          onTakePhoto={() => handleTriggerCamera()}
        />
      </div>

      {/* Camera Live / Upload Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapturePhoto}
      />

      {/* Item Detail / Quick Actions Modal */}
      <ItemDetailModal
        item={selectedItemForDetail}
        suppliers={suppliers}
        onClose={() => setSelectedItemForDetail(null)}
        onUpdateStatus={handleUpdateItemStatus}
        onUpdateQuantity={handleUpdateItemQuantity}
        onDeleteItem={handleDeleteItem}
        onEdit={handleEditItem}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={items}
        suppliers={suppliers}
        onSelectItem={(item) => {
          setSelectedItemForDetail(item);
        }}
        onSelectSupplier={() => {
          setActiveScreen('suppliers');
        }}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        items={items}
        onNavigateToItems={() => setActiveScreen('all_items')}
      />
    </div>
  );
}
