# Mohite Farms - E-Commerce Build Plan

## Architecture Overview

**Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Razorpay

## Phase 1: Project Scaffolding
- Initialize Next.js with TypeScript + Tailwind
- Configure project structure, environment variables
- Set up Supabase client utilities

## Phase 2: Database Schema (Supabase SQL)
- `categories` — product categories (Khapli Wheat, Shalu)
- `products` — name, slug, description, category_id, images
- `product_variants` — pack_size, price, stock, sku per product
- `orders` — guest checkout info, address, status, payment
- `order_items` — line items per order
- `shipping_config` — configurable shipping charges, COD fees
- `admin_users` — admin authentication via Supabase Auth
- Row Level Security (RLS) policies

## Phase 3: Core Frontend Pages
1. **Homepage** — Hero, featured products, brand story, trust signals
2. **Products listing** — Category filter, grid view
3. **Product detail** — Images, variant selector, add-to-cart
4. **Cart** — Editable quantities, totals, proceed to checkout
5. **About Us** — Farm story, location (Tondoli, Kadegaon)
6. **FAQs** — Expandable accordion
7. **Contact** — WhatsApp link, contact form
8. **Policies** — Shipping & returns

## Phase 4: Checkout Flow
1. Guest checkout (no account required)
2. Delivery address form with validation
3. Shipping calculation (configurable)
4. Order summary + payment method selection
5. Razorpay payment integration
6. Order confirmation page

## Phase 5: Razorpay Integration
- Server-side order creation (`/api/razorpay/create-order`)
- Client-side payment modal
- Server-side signature verification (`/api/razorpay/verify`)
- Webhook handler (`/api/razorpay/webhook`)
- Never expose secret keys; never mark unverified as paid

## Phase 6: Admin Dashboard (`/admin`)
- Admin login via Supabase Auth
- Product CRUD (add/edit/delete)
- Image upload to Supabase Storage
- Pack size/price/inventory management
- Order management (view, update status)
- Shipping & COD configuration

## Phase 7: Polish
- SEO meta tags, Open Graph
- Responsive design testing
- Error handling, loading states
- Accessibility (ARIA, keyboard nav)
- Sample seed data
- `.env.example`, README, deployment docs

## Design Direction
- **Color palette**: Deep forest green, warm gold/amber, cream/off-white, earth brown
- **Typography**: Inter (body), Playfair Display (headings)
- **Style**: Premium organic feel — earthy textures, clean layout, generous whitespace
- **Inspiration**: Shiva Organic, Rosier Foods, Organic Tattva
