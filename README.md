# RestoMenu — Online Menu Platform

RestoMenu is the platform brand. Each restaurant keeps its own identity and public menu.

## Current routes

- **RestoMenu platform homepage:** `/`
- **Master login and workspace:** `/root`
- **Mimosa Brunch & Drunch public menu:** `/mimosa`
- **Mimosa kitchen display (legacy):** `/mimosa/admin`

## Product model

- **Platform:** RestoMenu
- **Master role:** `profiles.platform_role = 'master_admin'`
- **Restaurant:** an independent tenant with its own slug, menu, branding, contact details and future admin account.
- **First restaurant:** Mimosa Brunch & Drunch, slug `mimosa`.

## Database and access control

The Supabase migration is in `supabase/migrations/20261120000000_restomenu_multitenant.sql`.

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
- Dynamic public menus for every restaurant slug: not yet implemented.
- Menu editor and order management: not yet implemented.
- Existing Mimosa menu is still driven by its original JavaScript data file while the migration establishes the database model.

## Existing menu features

- French, Arabic and English menu interface, including RTL support.
- Menu categories, product customization and cart.
- WhatsApp order dispatch.
- Initial API endpoint structure for future order processing.

## Deployment

The project is configured for Vercel. Routing is defined in `vercel.json`.
