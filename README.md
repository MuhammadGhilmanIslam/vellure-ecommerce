<div align="center">

# ✨ Vellure — Premium E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

A modern, full-featured e-commerce platform built with **Next.js 14**, **TypeScript**, and **Prisma ORM**. Designed with a luxurious aesthetic, Vellure delivers a seamless shopping experience from browsing to checkout — complete with a powerful admin dashboard for full business management.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [License](#-license)

</div>

---

## 🚀 Features

### 🛍️ Customer-Facing Storefront
- **Product Catalog** — Browse products with advanced filtering, sorting, and search
- **Category System** — Hierarchical categories with cover images and nested navigation
- **Product Details** — Rich product pages with image galleries, variants, and reviews
- **Shopping Cart** — Persistent cart with real-time price calculation
- **Checkout Flow** — Streamlined checkout with address management and shipping options
- **Wishlist** — Save favorite products for later
- **User Accounts** — Registration, login, order history, and profile management
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop

### 🔐 Authentication & Security
- **NextAuth.js v5** — Secure session-based authentication
- **Role-Based Access** — Customer, Admin, and SuperAdmin roles
- **Google OAuth** — Social login integration
- **Middleware Protection** — Route-level access control

### 📦 Admin Dashboard
- **Dashboard Analytics** — Sales overview, revenue charts, and key metrics (powered by Recharts)
- **Product Management** — Full CRUD with image upload (Cloudinary), variants, inventory tracking
- **Category Management** — Create, edit, and organize product categories with images
- **Order Management** — View, update status, and track order lifecycle
- **User Management** — View customers, manage roles, and moderate accounts
- **Content Management** — Manage banners, announcements, and static pages
- **Coupon System** — Create and manage discount coupons (percentage, fixed, free shipping)
- **Audit Logs** — Track all admin actions for accountability

### 💳 Payments & Shipping
- **Midtrans Payment Gateway** — Secure payment processing for Indonesian market
- **RajaOngkir Integration** — Real-time shipping cost calculation across Indonesia
- **Order Tracking** — Status updates from pending to delivery

### 📄 Additional Pages
- About, Contact, FAQ, Terms, Privacy Policy, Shipping Info, Returns, Careers, Press, Our Story

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 6 |
| **Authentication** | NextAuth.js v5 (Auth.js) |
| **State Management** | Zustand + TanStack React Query |
| **Form Handling** | React Hook Form + Zod |
| **Rich Text Editor** | Tiptap |
| **Image Hosting** | Cloudinary |
| **Payment** | Midtrans |
| **Shipping** | RajaOngkir API |
| **Charts** | Recharts |
| **UI Components** | Lucide Icons, CVA, clsx, tailwind-merge |
| **Notifications** | Sonner (Toast) |

---

## 📁 Project Structure

```
vellure/
├── app/
│   ├── (admin)/              # Admin panel routes
│   │   └── admin/
│   │       ├── (dashboard)/  # Protected admin pages
│   │       │   ├── dashboard/    # Analytics & overview
│   │       │   ├── products/     # Product management
│   │       │   ├── categories/   # Category management
│   │       │   ├── orders/       # Order management
│   │       │   ├── users/        # User management
│   │       │   ├── content/      # CMS (banners, pages)
│   │       │   └── settings/     # Store settings
│   │       └── login/        # Admin login
│   ├── (public)/             # Customer-facing routes
│   │   ├── auth/             # Login & register
│   │   ├── shop/             # Product listing
│   │   ├── product/          # Product detail
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout flow
│   │   ├── account/          # User account
│   │   ├── categories/       # Category browsing
│   │   └── ...               # Static pages (about, faq, etc.)
│   └── api/                  # API routes
│       ├── auth/             # Auth endpoints
│       ├── products/         # Product API
│       ├── orders/           # Order API
│       ├── cart/             # Cart API
│       ├── payment/          # Payment webhooks
│       ├── upload/           # Image upload
│       └── admin/            # Admin API
├── components/
│   ├── admin/                # Admin UI components
│   ├── cart/                 # Cart components
│   ├── checkout/             # Checkout components
│   ├── home/                 # Homepage sections
│   ├── layout/               # Navbar, Footer, etc.
│   ├── product/              # Product cards & galleries
│   ├── shop/                 # Shop filters & grid
│   └── ui/                   # Shared UI primitives
├── lib/
│   ├── auth.ts               # Auth configuration
│   ├── prisma.ts             # Prisma client
│   ├── cloudinary.ts         # Cloudinary setup
│   ├── midtrans.ts           # Payment gateway
│   ├── rajaongkir.ts         # Shipping API
│   ├── utils.ts              # Utility functions
│   ├── store/                # Zustand stores
│   └── validations/          # Zod schemas
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeder
│   └── migrations/           # Migration files
├── types/                    # TypeScript type definitions
├── public/                   # Static assets
└── middleware.ts             # Auth & route middleware
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** database (or [Supabase](https://supabase.com) account)
- **Cloudinary** account for image hosting
- **Midtrans** account for payment processing (optional)
- **RajaOngkir** API key for shipping costs (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MuhammadGhilmanIslam/vellure-ecommerce.git
   cd vellure-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the required values in `.env`:

   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string

   # Auth
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Payment (Midtrans)
   MIDTRANS_SERVER_KEY=your_server_key
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Seed the database** (optional)

   ```bash
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed the database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🗄️ Database Schema

The application uses a comprehensive relational schema with the following models:

- **User & Auth** — Users, Sessions, Addresses
- **Catalog** — Products, Categories, Tags, Variants, Images
- **Commerce** — Cart, Wishlist, Orders, Order Items, Coupons
- **Content** — Banners, Pages, Announcements
- **System** — Stock Logs, Audit Logs, Notifications

> See the full schema in [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Muhammad Ghilman Islam](https://github.com/MuhammadGhilmanIslam)**

</div>

