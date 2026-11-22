# Mohite Farms — E-Commerce Platform

A full-stack e-commerce website for **Mohite Farms**, a farmer-led Maharashtra brand selling Khapli wheat and Shalu jowar products. Built with Next.js, TypeScript, Tailwind CSS, Supabase, and Razorpay.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| State | Zustand (cart), React Server Components |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + Phone OTP) |
| Storage | Supabase Storage (product images) |
| Payments | Razorpay (online + COD) |
| Deployment | Vercel |

## Features

### Customer-Facing
- 🏠 Premium homepage with hero, featured products, and brand story
- 🛍️ Product listings with category filtering
- 📦 Product detail pages with pack-size variants, prices, and live stock
- 🛒 Persistent cart (localStorage via Zustand)
- 🔐 Authentication required for checkout (Google / Phone OTP)
- 📍 Delivery address form with validation
- 🚚 Configurable shipping charges (free above threshold)
- 💳 Razorpay payments (UPI, cards, net banking, wallets)
- 💵 Cash on Delivery option (configurable)
- ✅ Order confirmation with details
- 📋 Order history (My Orders)
- ℹ️ About Us, FAQs, Contact, WhatsApp integration
- 📄 Shipping, Returns, Privacy, and Terms policies

### Admin Dashboard (`/admin`)
- 📊 Dashboard with stats (products, orders, revenue, low stock)
- ➕ Add/Edit/Delete products
- 📸 Image upload to Supabase Storage
- 📐 Manage pack sizes, prices, and inventory per variant
- 📦 View and manage orders (update status, add tracking)
- 🚚 Configure shipping charges and COD settings

### Security
- ✅ Server-side Razorpay signature verification
- ✅ Webhook handler for payment events
- ✅ Never exposes secret keys to the client
- ✅ Never marks unverified orders as paid
- ✅ Row-Level Security (RLS) on all tables
- ✅ Admin routes protected via middleware

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Razorpay](https://razorpay.com) account
- A [Google Cloud](https://console.cloud.google.com) project (for OAuth)

### 1. Clone and Install

```bash
git clone <repo-url>
cd MohiteFarms
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql` (creates tables, RLS, and seed data)
3. Then run `supabase/setup.sql` (adds helper functions and additional policies)
4. **Storage**: Go to Storage → Create bucket `product-images` (set to public)
5. **Auth Providers**:
   - Enable **Google** provider (add Client ID and Secret from Google Cloud)
   - Enable **Phone (OTP)** provider (configure Twilio or similar)
6. **URL Configuration**: Add your app URL to redirect URLs

### 3. Set Up Razorpay

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your Key ID and Key Secret from Dashboard → Settings → API Keys
3. Set up a webhook at Dashboard → Webhooks:
   - URL: `https://your-domain.com/api/razorpay/webhook`
   - Events: `payment.captured`, `payment.failed`, `refund.created`
   - Copy the webhook secret

### 4. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Admin Access

1. Sign in with your Google account or phone number
2. Navigate to `/admin`
3. The middleware protects admin routes — only authenticated users can access them
4. **Important**: To restrict admin to specific users, update the middleware check in `src/lib/supabase/middleware.ts` to verify against a list of admin email/phone numbers

## Deployment on Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add all environment variables from `.env.local` to Vercel's Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your production URL
4. Deploy

### 3. Post-Deployment
1. Update Supabase Auth redirect URLs with your Vercel domain
2. Update Razorpay webhook URL to `https://your-domain.vercel.app/api/razorpay/webhook`
3. Update Google OAuth redirect URI in Google Cloud Console

## Project Structure

```
src/
├── app/
│   ├── (pages)
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product listing & detail
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout flow
│   │   ├── auth/                 # Login & OAuth callback
│   │   ├── orders/               # User's order history
│   │   ├── order-confirmation/   # Order success page
│   │   ├── about/                # About Us
│   │   ├── faq/                  # FAQs
│   │   ├── contact/              # Contact page
│   │   └── policies/             # Shipping, Returns, Privacy, Terms
│   ├── admin/                    # Admin dashboard
│   │   ├── products/             # Product CRUD
│   │   ├── orders/               # Order management
│   │   └── shipping/             # Shipping config
│   └── api/
│       ├── razorpay/             # Create order, verify, webhook
│       ├── orders/               # COD order creation
│       └── admin/                # Admin CRUD APIs
├── components/
│   ├── layout/                   # Header, Footer
│   ├── products/                 # ProductCard, ProductDetail, Filter
│   ├── admin/                    # ProductForm, OrderStatusUpdater
│   └── ui/                       # WhatsAppButton
├── lib/
│   ├── supabase/                 # Client, server, middleware utils
│   ├── store/                    # Zustand cart store
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
└── middleware.ts                  # Route protection
```

## Customization

### Update Contact Info
- Search for `919XXXXXXXXX` and replace with your actual WhatsApp/phone number
- Update `contact@mohitefarms.com` with your email
- Update the Google Maps embed in the About page

### Admin Access Control
To restrict admin access to specific users, modify `src/lib/supabase/middleware.ts`:

```typescript
// Add after the user check in admin route protection:
const ADMIN_EMAILS = ['your-email@gmail.com'];
if (!ADMIN_EMAILS.includes(user.email || '')) {
  return NextResponse.redirect(new URL('/', request.url));
}
```

## License

Private — All rights reserved.
