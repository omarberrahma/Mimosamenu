# RestoMenu — Online Menu Platform

RestoMenu is the platform brand. Each restaurant keeps its own identity and public menu.

## Current structure

- **RestoMenu platform homepage:** `/`
- **Master workspace preview:** `/root`
- **Mimosa Brunch & Drunch public menu:** `/mimosa`
- **Mimosa kitchen display:** `/mimosa/admin` (legacy route: `/admin`)
- **Restaurant configuration:** `assets/js/menu-data.js`
- **Menu UI:** `public/index.html`
- **Serverless order endpoint:** `api/orders.js`

## Product model

- **Platform:** RestoMenu
- **Master role:** controls the platform and all restaurant workspaces.
- **Restaurant:** an independent tenant with its own slug, menu, branding, contact details and future admin account.
- **First restaurant:** Mimosa Brunch & Drunch, slug `mimosa`.

## Important implementation status

The current Master page is a **visual preview only**. Authentication, role-based authorization, database persistence, tenant isolation, restaurant creation and real order management are not yet implemented. Do not use the preview route as a secure administration system.

The existing Mimosa menu remains the customer-facing restaurant experience. RestoMenu is now the platform identity, not the restaurant name.

## Deployment

The project is configured for Vercel. Rewrites are defined in `vercel.json`.

## Existing menu features

- French, Arabic and English menu interface, including RTL support.
- Menu categories, product customization and cart.
- WhatsApp order dispatch.
- Initial API endpoint structure for future order processing.
