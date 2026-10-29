# Mimosa Brunch & Drunch

Interactive web menu for Mimosa Brunch & Drunch, supporting dine-in and delivery orders.

## Architecture

- **`public/`**: Contains the main interactive menu (`index.html`), order tracking UI, and SEO files.
- **`admin/`**: Contains mock UI for Kitchen Display System and Admin login.
- **`assets/`**:
  - **`css/`**: Custom styles and tailwind configs.
  - **`js/`**: Modularized scripts containing menu data, cart logic, WhatsApp dispatch, and API calls.
- **`api/`**: Serverless functions intended for Vercel deployment (e.g. `/api/orders`).

## Deployment

This app is optimized for Vercel.

1. Ensure the Vercel CLI is installed.
2. Run `vercel` from the root directory.
3. The routing configuration is provided in `vercel.json`.

## Features
- Modular JS architecture (Menu Data, Cart, WhatsApp integration).
- Multi-lingual support (FR, EN, AR) with RTL capability.
- Quick order dispatch to a targeted WhatsApp line.
- Ready API endpoint integration for backend order processing.