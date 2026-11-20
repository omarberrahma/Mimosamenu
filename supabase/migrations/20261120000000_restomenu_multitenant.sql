-- RestoMenu multi-restaurant foundation
-- Run this migration in the Supabase SQL Editor.
-- All exposed tables use RLS; the browser must never receive the service_role key.

create extension if not exists pgcrypto;

create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  platform_role text not null default 'user'
    check (platform_role in ('user', 'master_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(trim(name)) > 0),
  description text,
  logo_url text,
  cover_url text,
  phone text,
  whatsapp_number text,
  currency text not null default 'DZD',
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_members (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff'
    check (role in ('owner', 'manager', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (restaurant_id, user_id)
);

create index if not exists restaurant_members_user_id_idx
  on public.restaurant_members(user_id);

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name jsonb not null default '{}'::jsonb,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, restaurant_id)
);

create index if not exists menu_categories_restaurant_sort_idx
  on public.menu_categories(restaurant_id, sort_order);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null,
  name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  price numeric(12,2) not null default 0 check (price >= 0),
  image_url text,
  badge jsonb,
  extras jsonb not null default '[]'::jsonb
    check (jsonb_typeof(extras) = 'array'),
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (category_id, restaurant_id)
    references public.menu_categories(id, restaurant_id) on delete restrict
);

create index if not exists menu_items_restaurant_category_sort_idx
  on public.menu_items(restaurant_id, category_id, sort_order);

-- Helper functions run with the database owner, avoiding recursive RLS checks.
create or replace function private.is_master_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.platform_role = 'master_admin'
  );
$$;

create or replace function private.can_access_restaurant(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_master_admin()
    or exists (
      select 1
      from public.restaurant_members rm
      where rm.restaurant_id = p_restaurant_id
        and rm.user_id = (select auth.uid())
        and rm.is_active = true
    );
$$;

create or replace function private.can_manage_restaurant(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_master_admin()
    or exists (
      select 1
      from public.restaurant_members rm
      where rm.restaurant_id = p_restaurant_id
        and rm.user_id = (select auth.uid())
        and rm.is_active = true
        and rm.role in ('owner', 'manager')
    );
$$;

create or replace function private.restaurant_is_active(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.restaurants r
    where r.id = p_restaurant_id and r.is_active = true
  );
$$;

create or replace function private.category_is_public(p_category_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.menu_categories c
    join public.restaurants r on r.id = c.restaurant_id
    where c.id = p_category_id
      and c.is_active = true
      and r.is_active = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_resto on auth.users;
create trigger on_auth_user_created_resto
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists restaurants_set_updated_at on public.restaurants;
create trigger restaurants_set_updated_at before update on public.restaurants
  for each row execute procedure public.set_updated_at();

drop trigger if exists menu_categories_set_updated_at on public.menu_categories;
create trigger menu_categories_set_updated_at before update on public.menu_categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at before update on public.menu_items
  for each row execute procedure public.set_updated_at();

-- Backfill profiles for Auth users that existed before this migration.
insert into public.profiles (id, display_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', u.email)
from auth.users u
on conflict (id) do nothing;

-- First tenant: keep Mimosa as a restaurant, not as the platform name.
insert into public.restaurants (slug, name, whatsapp_number, currency)
values ('mimosa', 'Mimosa Brunch & Drunch', '213562163900', 'DZD')
on conflict (slug) do nothing;

-- RLS is enabled on every public table.
alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

-- Remove broad defaults, then grant only the operations used by the app.
revoke all on public.profiles, public.restaurants, public.restaurant_members,
  public.menu_categories, public.menu_items from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select on public.restaurants to anon, authenticated;
grant insert, update, delete on public.restaurants to authenticated;

grant select on public.restaurant_members to authenticated;

grant select on public.menu_categories, public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_categories, public.menu_items to authenticated;

grant usage on schema private to anon, authenticated;
grant execute on function private.restaurant_is_active(uuid) to anon, authenticated;
grant execute on function private.category_is_public(uuid) to anon, authenticated;
grant execute on function private.is_master_admin() to authenticated;
grant execute on function private.can_access_restaurant(uuid) to authenticated;
grant execute on function private.can_manage_restaurant(uuid) to authenticated;

-- Profiles: users can read their own profile; Master can read every profile.
drop policy if exists profiles_read_self_or_master on public.profiles;
create policy profiles_read_self_or_master
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_master_admin()));

drop policy if exists profiles_update_display_name on public.profiles;
create policy profiles_update_display_name
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Restaurants: public visitors see active tenants. Members can see their own tenant.
drop policy if exists restaurants_public_read_active on public.restaurants;
create policy restaurants_public_read_active
  on public.restaurants for select to anon
  using (is_active = true);

drop policy if exists restaurants_authenticated_read on public.restaurants;
create policy restaurants_authenticated_read
  on public.restaurants for select to authenticated
  using (is_active = true or (select private.can_access_restaurant(id)));

drop policy if exists restaurants_master_insert on public.restaurants;
create policy restaurants_master_insert
  on public.restaurants for insert to authenticated
  with check (
    (select private.is_master_admin())
    and (created_by is null or created_by = (select auth.uid()))
  );

drop policy if exists restaurants_master_or_manager_update on public.restaurants;
create policy restaurants_master_or_manager_update
  on public.restaurants for update to authenticated
  using (
    (select private.is_master_admin())
    or (select private.can_manage_restaurant(id))
  )
  with check (
    (select private.is_master_admin())
    or (select private.can_manage_restaurant(id))
  );

drop policy if exists restaurants_master_delete on public.restaurants;
create policy restaurants_master_delete
  on public.restaurants for delete to authenticated
  using ((select private.is_master_admin()));

-- Restaurant membership: only Master manages access assignments.
drop policy if exists restaurant_members_read_self_or_master on public.restaurant_members;
create policy restaurant_members_read_self_or_master
  on public.restaurant_members for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_master_admin())
  );

drop policy if exists restaurant_members_master_insert on public.restaurant_members;
create policy restaurant_members_master_insert
  on public.restaurant_members for insert to authenticated
  with check ((select private.is_master_admin()));

drop policy if exists restaurant_members_master_update on public.restaurant_members;
create policy restaurant_members_master_update
  on public.restaurant_members for update to authenticated
  using ((select private.is_master_admin()))
  with check ((select private.is_master_admin()));

drop policy if exists restaurant_members_master_delete on public.restaurant_members;
create policy restaurant_members_master_delete
  on public.restaurant_members for delete to authenticated
  using ((select private.is_master_admin()));

-- Categories: public visitors see active categories from active restaurants.
drop policy if exists menu_categories_public_read on public.menu_categories;
create policy menu_categories_public_read
  on public.menu_categories for select to anon
  using (
    is_active = true
    and (select private.restaurant_is_active(restaurant_id))
  );

drop policy if exists menu_categories_authenticated_read on public.menu_categories;
create policy menu_categories_authenticated_read
  on public.menu_categories for select to authenticated
  using (
    (is_active = true and (select private.restaurant_is_active(restaurant_id)))
    or (select private.can_access_restaurant(restaurant_id))
  );

drop policy if exists menu_categories_manager_insert on public.menu_categories;
create policy menu_categories_manager_insert
  on public.menu_categories for insert to authenticated
  with check ((select private.can_manage_restaurant(restaurant_id)));

drop policy if exists menu_categories_manager_update on public.menu_categories;
create policy menu_categories_manager_update
  on public.menu_categories for update to authenticated
  using ((select private.can_manage_restaurant(restaurant_id)))
  with check ((select private.can_manage_restaurant(restaurant_id)));

drop policy if exists menu_categories_manager_delete on public.menu_categories;
create policy menu_categories_manager_delete
  on public.menu_categories for delete to authenticated
  using ((select private.can_manage_restaurant(restaurant_id)));

-- Menu items: public visitors see available items in active categories/tenants.
drop policy if exists menu_items_public_read on public.menu_items;
create policy menu_items_public_read
  on public.menu_items for select to anon
  using (
    is_available = true
    and (select private.restaurant_is_active(restaurant_id))
    and (select private.category_is_public(category_id))
  );

drop policy if exists menu_items_authenticated_read on public.menu_items;
create policy menu_items_authenticated_read
  on public.menu_items for select to authenticated
  using (
    (
      is_available = true
      and (select private.restaurant_is_active(restaurant_id))
      and (select private.category_is_public(category_id))
    )
    or (select private.can_access_restaurant(restaurant_id))
  );

drop policy if exists menu_items_manager_insert on public.menu_items;
create policy menu_items_manager_insert
  on public.menu_items for insert to authenticated
  with check (
    (select private.can_manage_restaurant(restaurant_id))
  );

drop policy if exists menu_items_manager_update on public.menu_items;
create policy menu_items_manager_update
  on public.menu_items for update to authenticated
  using ((select private.can_manage_restaurant(restaurant_id)))
  with check ((select private.can_manage_restaurant(restaurant_id)));

drop policy if exists menu_items_manager_delete on public.menu_items;
create policy menu_items_manager_delete
  on public.menu_items for delete to authenticated
  using ((select private.can_manage_restaurant(restaurant_id)));
