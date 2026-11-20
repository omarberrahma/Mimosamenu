# RestoMenu — Online Menu Platform

RestoMenu is the platform brand. Each restaurant keeps its own identity and public menu.

## Current routes

- **RestoMenu platform homepage:** `/`
- **Master login and workspace:** `/root`
- **Mimosa Brunch & Drunch public menu:** `/mimosa`
- **Any restaurant public menu:** `/:restaurantSlug` (for example `/dar-lben`)
- **Mimosa kitchen display (legacy):** `/mimosa/admin`

## Product model

- **Platform:** RestoMenu
- **Master role:** `profiles.platform_role = 'master_admin'`
- **Restaurant:** an independent tenant with its own slug, menu, branding, contact details and future admin account.
- **First restaurant:** Mimosa Brunch & Drunch, slug `mimosa`.

## Database and access control

The Supabase migrations are in `supabase/migrations/`:
- `20261120000000_restomenu_multitenant.sql` creates tenants, user profiles, memberships, menus and RLS policies.
- `20261120010000_seed_mimosa_menu.sql` imports Mimosa's current 4 categories and 12 menu products.

It creates:
- user profiles and Master role,
- restaurants and restaurant membership,
- multilingual menu categories and products,
- PostgreSQL Row Level Security (RLS) policies.

The Master workspace uses Supabase Auth. It verifies the signed-in user's `profiles.platform_role` before loading restaurant data. It can list and create restaurant records.

**Setup is required before login can work.** Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create the Supabase project, run the migration, promote the first Master user, and set Vercel environment variables. Only the publishable/anon key is exposed to the browser; never expose the service-role key.

## Implementation status

- RestoMenu landing page and separated Mimosa public route: implemented.
- Master authentication and role check: implemented after Supabase setup.
- Restaurant list and record creation: implemented after Supabase setup.
- Base tenant schema and RLS: implemented in the migration.
- Restaurant-admin invitations and account assignment: not yet implemented.
- Dynamic `/:restaurantSlug` route and public menu loading from Supabase: implemented after running both migrations and adding menu records for each tenant.
- Menu editor and order management: not yet implemented.
- Mimosa's current menu is seeded into Supabase by the second migration; its original JavaScript menu remains a fallback when Supabase is not configured or the database menu is empty.

## Existing menu features

- French, Arabic and English menu interface, including RTL support.
- Menu categories, product customization and cart.
- WhatsApp order dispatch.
- Initial API endpoint structure for future order processing.

## Deployment

The project is configured for Vercel. Routing is defined in `vercel.json`.
