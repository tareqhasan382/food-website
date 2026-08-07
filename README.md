# Food Website — Frontend

A full-featured food ordering storefront and admin dashboard built with **React + TypeScript + Vite**, **Tailwind CSS**, **Redux Toolkit**, and **react-hook-form**.

## Overview

This project is the customer-facing frontend for a restaurant ordering platform. Customers can browse the menu, search and filter foods, add items to the cart, apply coupons, pay online (Stripe) or on delivery, and track their orders. Admins get a complete dashboard to manage foods, categories, coupons, promotions, orders, and users.

## What This Project Solves

It replaces manual phone ordering and paper-based management with a single digital platform:

- **For customers** — order food online 24/7 with real-time menu, pricing, discounts (coupons), online payment, and order tracking.
- **For the restaurant** — one place to manage the menu, stock, prices, promotions, coupons, orders, and customer accounts, with analytics and reports to understand revenue and sales.

## Features

### Customer Storefront
- Browse menu with search, filters (category, price, rating, availability), and sorting
- Food details page with images, reviews, and ratings
- Cart with live coupon validation and pricing
- Wishlist with move-to-cart
- Checkout with Stripe payments and cash on delivery
- Order history, order details, and live order tracking
- Invoices for completed orders
- Full auth flow: register, login, email verification, forgot/reset/change password

### Admin Dashboard
- Overview and analytics (revenue, daily/monthly sales, charts, best-selling foods)
- Food CRUD with image upload
- Category CRUD
- Coupon management (percentage / fixed, usage limits, min order)
- Promotions and order status management
- User management and roles
- Reports

## Tech Stack

| Area          | Choice                                      |
| ------------- | ------------------------------------------- |
| Framework     | React 18 + TypeScript + Vite                |
| Styling       | Tailwind CSS                                |
| State         | Redux Toolkit + Redux Persist               |
| Routing       | React Router v6                             |
| Forms         | react-hook-form                             |
| Notifications | react-hot-toast                             |
| Payments      | Stripe (Elements)                           |
| API client    | Axios                                       |

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build (tsc && vite build)
npm run lint     # eslint with zero warnings
npm run preview  # preview the production build
```

The frontend talks to the backend REST API — see the [backend README](../Food-Website-Backend/README.md) for API details and environment setup.
