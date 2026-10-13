# 🛍️ ShopNow E-Commerce Platform

A modern, high-performance, mobile-responsive e-commerce web application built for **ShopNow Marketplace**. Designed with rich aesthetics, curated color palettes, dynamic MockAPI integration, Cloudinary CDN media delivery, and EmailJS automated email workflows.

---

## 🛠️ Technology Stack & Dependencies

- **Frontend Logic**: JavaScript (ES6+), jQuery 3.7.1, Bootstrap 5.3.3
- **Icons & Typography**: Bootstrap Icons 1.11.3, Google Fonts (*Inter* & *Playfair Display*)
- **Styling System**: Custom Vanilla CSS Tokens, CSS Grid & Flexbox
- **Asset CDN**: Cloudinary CDN (Web-optimized PNG media)
- **Backend Mock APIs**: MockAPI.io REST Endpoints
- **Email Infrastructure**: EmailJS SDK (`@emailjs/browser@4`)

---

## 🎨 Design System & Color Tokens

All design tokens are defined globally in `common/css/global.css`:

| Token Name | Hex Code | Description / Usage |
| :--- | :--- | :--- |
| `--color-coral` | `#e04326` | Primary Accent / Call to Action / Badges |
| `--color-coral-hover` | `#c7371d` | Hover / Active State for Coral Buttons |
| `--color-navy` | `#0b1a2b` | Hero Sections & Split Banner Backgrounds |
| `--color-cream` | `#f8f7f4` | Section Backgrounds & Content Cards |
| `--color-dark` | `#111827` | Main Body Text & Typography |

---

## ⚡ MockAPI & LocalStorage Architecture

The application uses an **offline-first hybrid data strategy** combining MockAPI endpoints and `localStorage` caching.

### 1. Active API Endpoints
- **Categories API**: `https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/categories`
- **Products API**: `https://6ac630bdbea0e72cf5c8ada0.mockapi.io/api/v1/products`

### 2. LocalStorage Keys
- `shopnow_categories`: Cached categories dataset
- `shopnow_products`: Cached trending products dataset
- `shopnow_support_tickets`: Submitted customer support tickets
- `shopnow_current_user`: Active logged-in user session

### 3. Data Flow Order
1. **Instant Render**: Reads cached data from `localStorage` for zero loading delay.
2. **Network Sync**: Fetches fresh data asynchronously from MockAPI endpoints.
3. **Local JSON Fallback**: If network fails and `localStorage` is empty, reads from local fallbacks (`common/resources/categories.json` & `products.json`).

---

## 🔑 Multi-Role Demo Credentials

The login system (`common/html/login.html`) supports 4 distinct user roles with built-in auto-fill demo accounts:

| Role | Demo Email | Demo Password | Account Capabilities |
| :--- | :--- | :--- | :--- |
| **Buyer** | `buyer@demo.com` | `buyer123` | Browse products, track orders, manage favorites |
| **Seller** | `seller@demo.com` | `seller123` | Storefront management, product inventory, payouts |
| **Delivery Agent** | `delivery@demo.com` | `delivery123` | Route navigation, package assignments, earnings |
| **Admin** | `admin@demo.com` | `admin123` | System metrics, user management, platform controls |

---

## 📁 Project Directory Structure

```text
shopnow-e-commerce/
│
├── admin/                       # System Admin Module
│   ├── css/                     # Place admin CSS files here
│   ├── html/                    # Place admin HTML files here
│   ├── js/                      # Place admin JS files here
│   └── resources/               # Place admin visual assets here
│
├── buyer/                       # Buyer Module
│   ├── css/                     # Place buyer CSS files here
│   ├── html/                    # Place buyer HTML files here
│   ├── js/                      # Place buyer JS files here
│   └── resources/               # Place buyer visual assets here
│
├── seller/                      # Seller Merchant Module
│   ├── css/                     # Place seller CSS files here
│   ├── html/                    # Place seller HTML files here
│   ├── js/                      # Place seller JS files here
│   └── resources/               # Place seller visual assets here
│
├── delivery-agent/              # Delivery Agent Module
│   ├── css/                     # Place delivery agent CSS files here
│   ├── html/                    # Place delivery agent HTML files here
│   ├── js/                      # Place delivery agent JS files here
│   └── resources/               # Place delivery agent visual assets here
│
└── common/                      # Common Shared Module
    ├── css/                     # Place global CSS styles here
    ├── html/                    # Place shared HTML components here
    ├── js/                      # Place shared JS scripts & helpers here
    └── resources/               # Place shared JSON data & images here
```

---

## 🚀 How to Run locally

1. Clone or download the repository workspace.
2. Open `index.html` or `common/html/home.html` in any web browser (or run via Live Server / VS Code extension).
3. No build tools or Node.js server dependencies required.
