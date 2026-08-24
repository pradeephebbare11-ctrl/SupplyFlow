create table if not exists public.suppliers (
  id text primary key,
  name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  category text not null,
  address text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id text primary key,
  name text not null,
  sku text not null,
  quantity integer not null default 1,
  status text not null check (status in ('to_order', 'ordered', 'received')),
  supplier_id text not null,
  supplier_name text not null,
  photo_url text not null,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  location text default ''
);

create table if not exists public.manager_profiles (
  id text primary key,
  name text not null,
  role text not null,
  facility text not null,
  email text not null,
  avatar_url text not null
);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

alter table public.suppliers enable row level security;
alter table public.inventory_items enable row level security;
alter table public.manager_profiles enable row level security;

drop policy if exists "Allow public supplier access" on public.suppliers;
drop policy if exists "Allow public inventory access" on public.inventory_items;
drop policy if exists "Allow public manager access" on public.manager_profiles;
drop policy if exists "Allow public product image access" on storage.objects;
drop policy if exists "Allow public product image uploads" on storage.objects;

create policy "Allow authenticated supplier access" on public.suppliers for all to authenticated using (true) with check (true);
create policy "Allow authenticated inventory access" on public.inventory_items for all to authenticated using (true) with check (true);
create policy "Allow authenticated manager access" on public.manager_profiles for all to authenticated using (true) with check (true);
create policy "Allow authenticated product image access" on storage.objects for select to authenticated using (bucket_id = 'product-images');
create policy "Allow authenticated product image uploads" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
