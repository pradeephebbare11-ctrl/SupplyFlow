import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InventoryItem, ManagerProfile, Supplier } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const signIn = async (email: string, password: string) => {
  const { data, error } = await requireClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await requireClient().auth.signUp({ email, password });
  if (error) throw error;
  return data.session;
};

export const signOut = async () => {
  const { error } = await requireClient().auth.signOut();
  if (error) throw error;
};

const requireClient = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
  }
  return supabase;
};

export const loadWorkspace = async () => {
  const client = requireClient();
  const [suppliersResult, itemsResult, managerResult] = await Promise.all([
    client.from('suppliers').select('*').order('created_at', { ascending: false }),
    client.from('inventory_items').select('*').order('created_at', { ascending: false }),
    client.from('manager_profiles').select('*').eq('id', 'default').maybeSingle(),
  ]);

  const firstError = suppliersResult.error || itemsResult.error || managerResult.error;
  if (firstError) throw firstError;

  return {
    suppliers: (suppliersResult.data || []).map(mapSupplier),
    items: (itemsResult.data || []).map(mapItem),
    manager: managerResult.data ? mapManager(managerResult.data) : null,
  };
};

export const insertSupplier = async (supplier: Supplier) => {
  const { error } = await requireClient().from('suppliers').insert(toSupplierRow(supplier));
  if (error) throw error;
};

export const updateSupplier = async (supplier: Supplier) => {
  const { error } = await requireClient().from('suppliers').update(toSupplierRow(supplier)).eq('id', supplier.id);
  if (error) throw error;
};

export const deleteSupplier = async (supplierId: string) => {
  const { error } = await requireClient().from('suppliers').delete().eq('id', supplierId);
  if (error) throw error;
};

export const insertItem = async (item: InventoryItem) => {
  const { error } = await requireClient().from('inventory_items').insert(toItemRow(item));
  if (error) throw error;
};

export const updateItem = async (item: InventoryItem) => {
  const { error } = await requireClient().from('inventory_items').update(toItemRow(item)).eq('id', item.id);
  if (error) throw error;
};

export const deleteItem = async (itemId: string) => {
  const { error } = await requireClient().from('inventory_items').delete().eq('id', itemId);
  if (error) throw error;
};

export const upsertManager = async (manager: ManagerProfile) => {
  const { error } = await requireClient().from('manager_profiles').upsert({
    id: 'default',
    name: manager.name,
    role: manager.role,
    facility: manager.facility,
    email: manager.email,
    avatar_url: manager.avatarUrl,
  });
  if (error) throw error;
};

export const replaceDemoData = async (suppliers: Supplier[], items: InventoryItem[]) => {
  const client = requireClient();
  const [suppliersResult, itemsResult] = await Promise.all([
    client.from('suppliers').upsert(suppliers.map(toSupplierRow)),
    client.from('inventory_items').upsert(items.map(toItemRow)),
  ]);
  if (suppliersResult.error) throw suppliersResult.error;
  if (itemsResult.error) throw itemsResult.error;
};

export const clearWorkspace = async () => {
  const client = requireClient();
  const itemsResult = await client.from('inventory_items').delete().not('id', 'is', null);
  if (itemsResult.error) throw itemsResult.error;
  const suppliersResult = await client.from('suppliers').delete().not('id', 'is', null);
  if (suppliersResult.error) throw suppliersResult.error;
};

export const uploadProductImage = async (image: string, itemId: string) => {
  if (!image.startsWith('data:')) return image;

  const client = requireClient();
  const response = await fetch(image);
  const blob = await response.blob();
  const path = `${itemId}-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
  const { error } = await client.storage.from('product-images').upload(path, blob, {
    contentType: blob.type,
    upsert: true,
  });
  if (error) throw error;

  const { data } = client.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
};

const mapSupplier = (row: any): Supplier => ({
  id: row.id,
  name: row.name,
  contactName: row.contact_name,
  email: row.email,
  phone: row.phone,
  category: row.category,
  address: row.address || '',
  notes: row.notes || '',
  createdAt: row.created_at,
});

const mapItem = (row: any): InventoryItem => ({
  id: row.id,
  name: row.name,
  sku: row.sku,
  quantity: row.quantity,
  status: row.status,
  supplierId: row.supplier_id,
  supplierName: row.supplier_name,
  photoUrl: row.photo_url,
  notes: row.notes || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at || undefined,
  location: row.location || '',
});

const mapManager = (row: any): ManagerProfile => ({
  name: row.name,
  role: row.role,
  facility: row.facility,
  email: row.email,
  avatarUrl: row.avatar_url,
});

const toSupplierRow = (supplier: Supplier) => ({
  id: supplier.id,
  name: supplier.name,
  contact_name: supplier.contactName,
  email: supplier.email,
  phone: supplier.phone,
  category: supplier.category,
  address: supplier.address || '',
  notes: supplier.notes || '',
  created_at: supplier.createdAt,
});

const toItemRow = (item: InventoryItem) => ({
  id: item.id,
  name: item.name,
  sku: item.sku,
  quantity: item.quantity,
  status: item.status,
  supplier_id: item.supplierId,
  supplier_name: item.supplierName,
  photo_url: item.photoUrl,
  notes: item.notes || '',
  created_at: item.createdAt,
  updated_at: item.updatedAt || null,
  location: item.location || '',
});
