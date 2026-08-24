export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export type ItemStatus = 'to_order' | 'ordered' | 'received';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  status: ItemStatus;
  supplierId: string;
  supplierName: string;
  photoUrl: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  location?: string;
}

export type ActiveScreen = 'dashboard' | 'suppliers' | 'all_items' | 'add_product' | 'settings';

export interface ManagerProfile {
  name: string;
  role: string;
  facility: string;
  avatarUrl: string;
  email: string;
}
