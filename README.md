# 🛒 ShopMart – E-Commerce Application

ShopMart is a modern e-commerce web application built with **React**, **TypeScript**, and **Vite**.  
The project demonstrates a complete online shopping flow including product browsing, cart management, authentication, and checkout.


---

## 🌐 Live Demo

https://ecommerceweb-pink.vercel.app/login

### Test Account
- **Username:** emilys  
- **Password:** emilyspass  

---

## ✨ Features

### 🔐 Authentication
- User login with JWT token
- Protected routes
- Auto logout on token expiration
- Persistent authentication state (localStorage)

---

### 📦 Product Listing
- Responsive 4-column product grid
- Infinite scroll (20 products per load)
- Search with debounce (800ms)
- Product information:
  - Image
  - Title
  - Price
  - Rating
  - Discount badge

---

### 🛒 Shopping Cart
- Add products to cart
- Update item quantity (optimistic UI)
- Remove individual items
- Clear entire cart
- Persistent cart state using localStorage
- Real-time cart badge in header

---

### 💳 Checkout
#### Shipping Information
- Recipient name
- Phone number
- Email
- Address (postal code, street, detail)
- Delivery notes (optional)

#### Payment Information
- Payment method selection:
  - Credit Card
  - Debit Card
  - PayPal
- Card number auto-formatting (####-####-####-####)
- Expiry date (MM/YY)
- CVV (masked input)

#### Validation
- Real-time validation
- Email & phone format validation
- Card number length validation (15–16 digits)
- Expiry date validation (not expired)

---

### 📋 Order Confirmation
- Order summary
- Generated order ID
- Estimated delivery date
- Print receipt option

---

### ⚠️ Error Handling
- Network error handling
- User-friendly error messages
- Retry mechanism
- Loading states & skeleton UI

---

## 🛠️ Tech Stack

| Technology | Usage |
|----------|------|
| React 19 | UI Library |
| TypeScript | Static typing |
| Vite | Build tool |
| React Router v7 | Client-side routing |
| Context API | Global state management |
| DummyJSON API | Mock backend |
| Vercel | Deployment |

---
