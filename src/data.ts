import { Supplier, InventoryItem, ManagerProfile } from './types';

export const DEFAULT_MANAGER: ManagerProfile = {
  name: 'Manager Profile',
  role: 'Inventory Portal',
  facility: 'Warehouse Alpha',
  email: 'manager.alpha@supplyflow.internal',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzax88bWeAHefwFIv_jtu3zDJ_YcJqw5Rz3P6rtVomXOtr_um4BvcrHRUF_wm_91TxdRUGiw7IZqKjoC5JWk1VARg55nnJQJ-1H7o1iulOK3YfoovZkij2Z0Wq0uevP5i4dk7tq_5WfFwHMYaeMheDibluVq-R5trmrncdCq0A3Nd6VbElK5Gzon8ic9LQJJlFTqtbRQRL7KJLDnL7LJOYxlJt9P9Ir3_QFLQO9YRHoNK5b-m-l0ChsA',
};

export const DEFAULT_HARDWARE_PHOTO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zHzWoaImOwIcbisczHmxwTXMQjRZP-8QLQnqkWNsTUrxtST9BEIYwIPu2uy_lU0ffYWRefT1ycuUl6xO6j00yviAM_3IgpEnqh8885v-G8fH2nOzgXS7Z4Xr7g4W0npcf0w4A2VSVaGrpjOcdDn_mupbP9NkYnWqTTUQuM3esSom_AJRX4jaw1DGp2pZGHIu7O67r0F8BMnnOi8scFxXbGs0_X3ByTMdm-8JdjaRCUw8QOVR7KZu-g';

export const SAMPLE_PHOTOS = [
  {
    name: 'Industrial Hardware & Fasteners',
    url: DEFAULT_HARDWARE_PHOTO,
  },
  {
    name: 'Hydraulic Seals & O-Rings',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Electronic Wiring Harness',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Precision Machine Bearings',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Warehouse Safety Gear & Sensors',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  }
];

export const INITIAL_SAMPLE_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-alpha',
    name: 'Alpha Manufacturing',
    contactName: 'David Miller',
    email: 'orders@alphamfg.com',
    phone: '+1 (555) 234-5678',
    category: 'Fasteners & Hardware',
    address: '450 Industrial Parkway, Sector 4',
    notes: 'Primary supplier for grade 8 fasteners and precision bolts. Net 30 terms.',
    createdAt: '2026-08-10T09:00:00Z',
  },
  {
    id: 'sup-global',
    name: 'Global Textiles Inc.',
    contactName: 'Elena Rostova',
    email: 'supply@globaltextiles.com',
    phone: '+1 (555) 876-5432',
    category: 'Fabrics & Liners',
    address: '120 Loom Boulevard, Suite 10',
    notes: 'Handles reinforced canvas and heavy duty utility straps.',
    createdAt: '2026-08-12T11:30:00Z',
  },
  {
    id: 'sup-omega',
    name: 'Omega Logistics',
    contactName: 'Marcus Vance',
    email: 'dispatch@omegalogistics.com',
    phone: '+1 (555) 345-9876',
    category: 'Hydraulics & Seals',
    address: '88 Harbor Freight Rd, Bay 2',
    notes: 'Quick turnaround for replacement seals, tubing, and gaskets.',
    createdAt: '2026-08-14T14:15:00Z',
  }
];

export const INITIAL_SAMPLE_ITEMS: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Heavy Duty Widget Assortment',
    sku: 'SKU-9924-HDW',
    quantity: 12,
    status: 'to_order',
    supplierId: 'sup-alpha',
    supplierName: 'Alpha Manufacturing',
    photoUrl: DEFAULT_HARDWARE_PHOTO,
    notes: 'Warehouse rack B-4 low stock. Critical component for assembly line 2.',
    createdAt: '2026-08-20T10:15:00Z',
    location: 'Aisle B - Bin 42',
  },
  {
    id: 'item-2',
    name: 'Reinforced Hydraulic O-Ring Kit',
    sku: 'UPC-4412-SEAL',
    quantity: 25,
    status: 'ordered',
    supplierId: 'sup-omega',
    supplierName: 'Omega Logistics',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    notes: 'PO #88412 placed on Monday. Expected delivery by Friday morning.',
    createdAt: '2026-08-22T08:45:00Z',
    location: 'Bay 3 - Shelf 1',
  },
  {
    id: 'item-3',
    name: 'Industrial Grade Fastener Set M8/M10',
    sku: 'SKU-7721-BOLT',
    quantity: 50,
    status: 'received',
    supplierId: 'sup-alpha',
    supplierName: 'Alpha Manufacturing',
    photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    notes: 'Checked in by receiving desk. Quality inspection passed.',
    createdAt: '2026-08-23T14:00:00Z',
    location: 'Aisle C - Bin 18',
  }
];
