# Kế Hoạch Phát Triển E-Commerce Application

## Tổng Quan
Dự án xây dựng ứng dụng e-commerce với React + TypeScript, sử dụng DummyJSON API.

---

## PHASE 1: Thiết Lập Dự Án & Cấu Trúc Cơ Bản

### Bước 1.1: Cài đặt Dependencies cần thiết
- [ ] Cài đặt React Router: `npm install react-router-dom`
- [ ] **KHÔNG cần axios** - Sử dụng `fetch` API native của browser
- [ ] **KHÔNG cần state management library** - Sử dụng React Context API + useState
- [ ] **KHÔNG cần form validation library** - Tự implement validation với TypeScript
- [ ] **KHÔNG cần icon library** - Sử dụng SVG hoặc CSS để tạo icons đơn giản

### Bước 1.2: Tạo cấu trúc thư mục
```
src/
├── api/              # API services
│   ├── auth.ts
│   ├── products.ts
│   ├── cart.ts
│   └── users.ts
├── components/       # Reusable components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── product/
│       └── ProductCard.tsx
├── pages/            # Page components
│   ├── Login.tsx
│   ├── ProductList.tsx
│   ├── Cart.tsx
│   └── Checkout.tsx
├── hooks/            # Custom hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useCart.ts
├── context/          # React Context (nếu dùng)
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── types/            # TypeScript types
│   ├── auth.ts
│   ├── product.ts
│   ├── cart.ts
│   └── checkout.ts
├── utils/            # Utility functions
│   ├── api.ts        # API base config
│   ├── storage.ts    # localStorage helpers
│   └── validation.ts # Validation helpers
└── App.tsx
```

### Bước 1.3: Thiết lập Routing
- [ ] Cài đặt React Router trong `App.tsx`
- [ ] Tạo các routes:
  - `/login` - Trang đăng nhập
  - `/products` - Danh sách sản phẩm
  - `/cart` - Giỏ hàng (protected)
  - `/checkout` - Thanh toán (protected)
  - `/` - Redirect đến `/products` hoặc `/login`

### Bước 1.4: Tạo API Base Configuration với Fetch API
- [ ] Tạo file `src/utils/api.ts`
- [ ] Tạo function `apiRequest()` wrapper cho `fetch`:
  - Base URL: `https://dummyjson.com`
  - Tự động thêm JWT token vào headers từ localStorage
  - Xử lý JSON parsing
  - Xử lý lỗi API chung (401, 403, 500, etc.)
- [ ] Tạo helper functions: `get()`, `post()`, `put()`, `delete()` sử dụng `apiRequest()`

---

## PHASE 2: Authentication (Đăng Nhập)

### Bước 2.1: Tạo Types cho Authentication
- [ ] Tạo file `src/types/auth.ts`
- [ ] Định nghĩa types:
  - `LoginRequest` (username, password)
  - `LoginResponse` (token, user info)
  - `User` (id, username, email, firstName, lastName, etc.)

### Bước 2.2: Tạo API Service cho Authentication
- [ ] Tạo file `src/api/auth.ts`
- [ ] Implement function `login(username, password)`:
  - POST `/auth/login`
  - Lưu token vào localStorage
  - Trả về user info
- [ ] Implement function `logout()`:
  - Xóa token khỏi localStorage
- [ ] Implement function `getCurrentUser()`:
  - GET `/auth/me` (nếu API hỗ trợ) hoặc decode JWT

### Bước 2.3: Tạo Auth Context với React Context API
- [ ] Tạo file `src/context/AuthContext.tsx`
- [ ] Sử dụng `createContext` và `useContext` (React native)
- [ ] Quản lý state với `useState`: `isAuthenticated`, `user`, `token`
- [ ] Functions: `login()`, `logout()`, `checkAuth()`
- [ ] Tự động kiểm tra token khi app khởi động
- [ ] Lưu token vào localStorage để persist

### Bước 2.4: Tạo Login Page
- [ ] Tạo file `src/pages/Login.tsx`
- [ ] Form với 2 fields: username, password
- [ ] Validation: required fields
- [ ] Loading state khi đang đăng nhập
- [ ] Error handling: hiển thị lỗi nếu đăng nhập thất bại
- [ ] Sau khi đăng nhập thành công: redirect đến `/products`

### Bước 2.5: Tạo Protected Route Component
- [ ] Tạo component `ProtectedRoute.tsx`
- [ ] Kiểm tra authentication
- [ ] Nếu chưa đăng nhập: redirect đến `/login`
- [ ] Nếu đã đăng nhập: render children

### Bước 2.6: Áp dụng Protected Routes
- [ ] Bảo vệ route `/cart` và `/checkout` bằng `ProtectedRoute`
- [ ] Test: truy cập `/cart` khi chưa đăng nhập → redirect đến `/login`

---

## PHASE 3: Product List (Danh Sách Sản Phẩm)

### Bước 3.1: Tạo Types cho Products
- [ ] Tạo file `src/types/product.ts`
- [ ] Định nghĩa types:
  - `Product` (id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images)
  - `ProductsResponse` (products[], total, skip, limit)

### Bước 3.2: Tạo API Service cho Products
- [ ] Tạo file `src/api/products.ts`
- [ ] Implement function `getProducts(skip, limit, search?)`:
  - GET `/products?limit={limit}&skip={skip}&q={search}`
  - Hỗ trợ pagination và search
- [ ] Implement function `getProductById(id)`:
  - GET `/products/{id}`

### Bước 3.3: Tạo ProductCard Component
- [ ] Tạo file `src/components/product/ProductCard.tsx`
- [ ] Hiển thị: thumbnail, title, price, rating
- [ ] Button "Add to Cart"
- [ ] Styling đẹp, responsive

### Bước 3.4: Tạo ProductList Page với Infinite Scroll
- [ ] Tạo file `src/pages/ProductList.tsx`
- [ ] State management:
  - `products[]` - danh sách sản phẩm
  - `loading` - trạng thái loading
  - `hasMore` - còn sản phẩm để load không
  - `skip` - số lượng đã load
- [ ] Load 20 sản phẩm đầu tiên khi component mount
- [ ] Implement infinite scroll:
  - Sử dụng `Intersection Observer` hoặc `useEffect` + `window.scroll`
  - Khi scroll gần cuối trang → load thêm 20 sản phẩm
  - Cập nhật `skip` sau mỗi lần load
- [ ] Loading indicator khi đang fetch
- [ ] Error handling

### Bước 3.5: Implement Search Functionality với Debounce thủ công
- [ ] Thêm search input vào `ProductList.tsx`
- [ ] State: `searchQuery`, `debouncedSearchQuery`
- [ ] Implement debounce thủ công với `useEffect` + `setTimeout`:
  - Khi `searchQuery` thay đổi → đợi 300-500ms
  - Sau đó cập nhật `debouncedSearchQuery`
  - Cleanup timeout khi component unmount hoặc searchQuery thay đổi
- [ ] Khi `debouncedSearchQuery` thay đổi:
  - Reset `skip` về 0
  - Gọi API với query parameter `q={debouncedSearchQuery}`
  - Reset infinite scroll khi có search query mới
- [ ] Clear search: reset về danh sách ban đầu

### Bước 3.6: Tích hợp "Add to Cart" Button
- [ ] Khi click "Add to Cart" trên ProductCard:
  - Gọi API để thêm sản phẩm vào cart (sẽ implement ở Phase 4)
  - Hiển thị notification/toast thành công
  - Cập nhật cart count trong header (nếu có)

---

## PHASE 4: Shopping Cart (Giỏ Hàng)

### Bước 4.1: Tạo Types cho Cart
- [ ] Tạo file `src/types/cart.ts`
- [ ] Định nghĩa types:
  - `CartItem` (id, title, price, quantity, total, discountPercentage, thumbnail)
  - `Cart` (id, userId, products[], total, totalProducts, totalQuantity, discountedTotal)

### Bước 4.2: Tạo API Service cho Cart
- [ ] Tạo file `src/api/cart.ts`
- [ ] Implement function `getCart()`:
  - GET `/carts/user/{userId}` hoặc `/carts/{cartId}`
- [ ] Implement function `addToCart(productId, quantity)`:
  - POST `/carts/add` với body: `{ userId, products: [{ id, quantity }] }`
- [ ] Implement function `updateCartItem(productId, quantity)`:
  - PUT `/carts/{cartId}` với body: `{ merge: false, products: [{ id, quantity }] }`
- [ ] Implement function `removeFromCart(productId)`:
  - DELETE `/carts/{cartId}/products/{productId}` hoặc PUT với quantity = 0
- [ ] Implement function `clearCart(cartId)`:
  - DELETE `/carts/{cartId}`

### Bước 4.3: Tạo Cart Context với React Context API
- [ ] Tạo file `src/context/CartContext.tsx`
- [ ] Sử dụng `createContext` và `useContext` (React native)
- [ ] State với `useState`: `cart`, `loading`, `error`
- [ ] Functions:
  - `fetchCart()` - lấy cart từ API
  - `addToCart(productId, quantity)` - thêm sản phẩm
  - `updateQuantity(productId, quantity)` - cập nhật số lượng
  - `removeItem(productId)` - xóa sản phẩm
  - `clearCart()` - xóa toàn bộ cart
- [ ] Lưu cart vào localStorage để persist (vì API không thực sự lưu)
- [ ] Tự động fetch cart khi user đăng nhập

### Bước 4.4: Tạo Cart Page
- [ ] Tạo file `src/pages/Cart.tsx`
- [ ] Hiển thị danh sách sản phẩm trong cart:
  - Thumbnail, title, price
  - Quantity input với nút +/- để điều chỉnh
  - Button "Remove" để xóa item
  - Subtotal cho mỗi item
- [ ] Hiển thị tổng tiền:
  - Total products
  - Discount (nếu có)
  - Final total
- [ ] Button "Proceed to Checkout" → redirect đến `/checkout`
- [ ] Empty state: hiển thị message nếu cart trống
- [ ] Loading state
- [ ] Error handling

### Bước 4.5: Tích hợp Cart vào Header
- [ ] Thêm cart icon vào Header
- [ ] Hiển thị số lượng items trong cart (badge)
- [ ] Click vào icon → navigate đến `/cart`

---

## PHASE 5: Checkout Form (Form Thanh Toán)

### Bước 5.1: Tạo Types cho Checkout
- [ ] Tạo file `src/types/checkout.ts`
- [ ] Định nghĩa types:
  - `ShippingInfo` (name, phone, email, postalCode, streetAddress, detailAddress, deliveryNotes)
  - `PaymentInfo` (method, cardNumber, expiryDate, cvv)
  - `CheckoutFormData` (shippingInfo, paymentInfo)
  - `OrderSummary` (items, subtotal, discount, total)

### Bước 5.2: Tạo Form Validation Functions thủ công
- [ ] Tạo file `src/utils/validation.ts`
- [ ] Tạo các validation functions với TypeScript:
  - `validateRequired(value)` - kiểm tra không rỗng
  - `validateEmail(email)` - kiểm tra format email với regex
  - `validatePhone(phone)` - kiểm tra format số điện thoại với regex
  - `validateCardNumber(cardNumber)` - kiểm tra 16 chữ số (sau khi format)
  - `validateExpiryDate(date)` - kiểm tra format MM/YY và không quá hạn
  - `validateCVV(cvv)` - kiểm tra 3-4 chữ số
  - `validateMinLength(value, min)` - kiểm tra độ dài tối thiểu
- [ ] Tạo function `validateForm(formData)` để validate toàn bộ form

### Bước 5.3: Tạo Checkout Page - Shipping Information Section
- [ ] Tạo file `src/pages/Checkout.tsx`
- [ ] Sử dụng `useState` để quản lý form state:
  - `formData` object chứa tất cả fields
  - `errors` object chứa error messages cho mỗi field
- [ ] Section 1: Shipping Information
  - Form fields:
    - Recipient Name (input)
    - Phone (input với format validation)
    - Email (input với email validation)
    - Postal Code (input)
    - Street Address (input)
    - Detailed Address (textarea)
    - Delivery Notes (textarea, optional)
- [ ] Real-time validation với `onChange` handlers:
  - Validate từng field khi user nhập
  - Cập nhật `errors` state
- [ ] Hiển thị error messages dưới mỗi field từ `errors` state

### Bước 5.4: Tạo Checkout Page - Payment Information Section
- [ ] Section 2: Payment Information
  - Payment method selection (radio buttons):
    - Credit Card
    - Debit Card
    - PayPal (optional)
  - Card details (chỉ hiển thị nếu chọn Credit/Debit Card):
    - Card Number (input với auto-formatting: 1234-5678-9012-3456)
    - Expiry Date (input với format MM/YY)
    - CVV (input, masked)
- [ ] Auto-formatting cho card number:
  - Tự động thêm dấu `-` sau mỗi 4 số
  - Chỉ cho phép nhập số
  - Max length: 19 ký tự (16 số + 3 dấu `-`)

### Bước 5.5: Tạo Checkout Page - Order Summary Section
- [ ] Section 3: Order Summary
  - Hiển thị danh sách sản phẩm (từ cart)
  - Subtotal
  - Discount (nếu có)
  - Shipping fee (có thể hardcode hoặc tính toán)
  - Final Total
- [ ] Sticky summary (nếu cần)

### Bước 5.6: Implement Form Submission
- [ ] Button "Place Order"
- [ ] Khi submit:
  1. Validate toàn bộ form
  2. Nếu có lỗi: hiển thị errors
  3. Nếu hợp lệ:
     - Hiển thị loading state
     - Gọi API để update user info (PUT `/users/{id}`) với shipping address
     - Gọi API để clear cart (DELETE `/carts/{id}`)
     - Xử lý response (mặc dù API không thực sự update DB)
     - Redirect đến Order Confirmation page

### Bước 5.7: Tạo Order Confirmation Page
- [ ] Tạo file `src/pages/OrderConfirmation.tsx`
- [ ] Hiển thị:
  - Success message: "Order placed successfully!"
  - Order summary (từ form data đã submit)
  - Order number (có thể generate random hoặc dùng timestamp)
  - Estimated delivery date (có thể tính toán)
- [ ] Button "Continue Shopping" → redirect đến `/products`
- [ ] Button "View Orders" (optional, nếu có trang orders)

---

## PHASE 6: Error Handling & Loading States

### Bước 6.1: Tạo Error Handling Utilities
- [ ] Tạo file `src/utils/errorHandler.ts`
- [ ] Function để parse API errors
- [ ] Function để hiển thị error messages user-friendly
- [ ] Xử lý các loại lỗi:
  - Network errors
  - 401 Unauthorized → redirect to login
  - 404 Not Found
  - 500 Server Error
  - Validation errors

### Bước 6.2: Tạo Loading Component
- [ ] Tạo file `src/components/common/Loading.tsx`
- [ ] Spinner/Skeleton loader
- [ ] Có thể tái sử dụng ở nhiều nơi

### Bước 6.3: Tạo Error Message Component
- [ ] Tạo file `src/components/common/ErrorMessage.tsx`
- [ ] Hiển thị error message đẹp
- [ ] Có thể retry button (nếu cần)

### Bước 6.4: Áp dụng Loading & Error States
- [ ] Thêm loading state vào tất cả các pages:
  - Login page
  - ProductList page
  - Cart page
  - Checkout page
- [ ] Thêm error handling vào tất cả API calls
- [ ] Hiển thị error messages phù hợp

---

## PHASE 7: UI/UX Improvements

### Bước 7.1: Tạo Layout Component
- [ ] Tạo file `src/components/layout/Layout.tsx`
- [ ] Header với:
  - Logo/Brand name
  - Navigation links
  - Cart icon với badge
  - User menu (nếu đã đăng nhập) hoặc Login button
- [ ] Footer (optional)
- [ ] Wrap các pages trong Layout

### Bước 7.2: Styling & Responsive Design
- [ ] Sử dụng CSS Modules hoặc CSS thuần (không dùng styled-components)
- [ ] Tạo file `src/styles/` với:
  - `variables.css` - CSS variables cho colors, spacing, typography
  - `global.css` - Reset và base styles
- [ ] Đảm bảo responsive trên mobile, tablet, desktop với media queries
- [ ] Tạo theme colors, typography với CSS variables
- [ ] Consistent spacing và styling

### Bước 7.3: Add Animations & Transitions
- [ ] Smooth transitions khi navigate
- [ ] Loading animations
- [ ] Hover effects trên buttons và cards

---

## PHASE 8: Testing & Optimization

### Bước 8.1: Test Authentication Flow
- [ ] Test login với valid credentials
- [ ] Test login với invalid credentials
- [ ] Test logout
- [ ] Test protected routes
- [ ] Test token persistence (refresh page)

### Bước 8.2: Test Product List
- [ ] Test infinite scroll
- [ ] Test search functionality
- [ ] Test add to cart từ product list
- [ ] Test edge cases: empty results, network errors

### Bước 8.3: Test Cart Functionality
- [ ] Test add to cart
- [ ] Test update quantity
- [ ] Test remove item
- [ ] Test clear cart
- [ ] Test cart persistence

### Bước 8.4: Test Checkout Flow
- [ ] Test form validation
- [ ] Test card number formatting
- [ ] Test form submission
- [ ] Test order confirmation

### Bước 8.5: Performance Optimization
- [ ] Lazy load components nếu cần
- [ ] Memoization cho expensive calculations
- [ ] Optimize re-renders với React.memo, useMemo, useCallback
- [ ] Image optimization (lazy loading)

---

## PHASE 9: Documentation & Deployment

### Bước 9.1: Update README.md
- [ ] Mô tả project
- [ ] Hướng dẫn cài đặt và chạy project
- [ ] Cấu trúc thư mục
- [ ] Các thách thức và giải pháp trong quá trình implement
- [ ] API endpoints được sử dụng
- [ ] Screenshots (optional)

### Bước 9.2: Code Cleanup
- [ ] Remove unused code
- [ ] Add comments cho complex logic
- [ ] Ensure TypeScript strict mode compliance
- [ ] Fix all linting errors

### Bước 9.3: Build & Test Production Build
- [ ] Run `npm run build`
- [ ] Test production build với `npm run preview`
- [ ] Fix any build errors

### Bước 9.4: Deploy (Optional)
- [ ] Deploy lên Vercel hoặc Netlify
- [ ] Test deployed version
- [ ] Update README với deployment URL

---

## Checklist Tổng Hợp

### Functional Requirements
- [ ] Login với JWT token
- [ ] Redirect sau login
- [ ] Protected routes cho cart và checkout
- [ ] Product list với infinite scroll (20 items/load)
- [ ] Search functionality
- [ ] Add to cart từ product list
- [ ] View cart
- [ ] Update quantity trong cart
- [ ] Remove items từ cart
- [ ] Calculate total amount
- [ ] Checkout form với shipping info
- [ ] Checkout form với payment info
- [ ] Form validation (required, email, phone, card)
- [ ] Card number auto-formatting
- [ ] Order completion simulation
- [ ] Update user info sau order
- [ ] Clear cart sau order
- [ ] Order confirmation screen

### Technical Requirements
- [ ] Error handling cho API calls
- [ ] Loading states
- [ ] TypeScript types đầy đủ
- [ ] Code structure rõ ràng, reusable
- [ ] State management hiệu quả
- [ ] Authentication flow secure

---

## Lưu Ý Quan Trọng

1. **Tech Stack - Chỉ React + TypeScript**:
   - **KHÔNG dùng**: axios, zustand, react-query, react-hook-form, zod, styled-components, icon libraries
   - **CHỈ dùng**: React (useState, useEffect, useContext, createContext), TypeScript, fetch API, CSS
   - **Có thể dùng**: react-router-dom (cần thiết cho routing)

2. **DummyJSON API Limitations**:
   - API không thực sự update database
   - Cần quản lý state ở local level (localStorage + React Context)
   - Cart sẽ không persist giữa các sessions nếu chỉ dựa vào API
   - **Giải pháp**: Lưu cart vào localStorage và sync với API khi cần

2. **State Management Strategy**:
   - **Chỉ sử dụng React Context API** (không dùng Zustand, Redux, React Query)
   - Cart nên được lưu vào localStorage để persist (vì API không thực sự lưu)
   - Auth token lưu vào localStorage
   - Sử dụng `useState`, `useEffect`, `useContext` cho tất cả state management

3. **API Endpoints cần sử dụng**:
   - `POST /auth/login` - Login
   - `GET /products` - Get products (với pagination và search)
   - `GET /products/{id}` - Get single product
   - `GET /carts/user/{userId}` - Get user cart
   - `POST /carts/add` - Add to cart
   - `PUT /carts/{id}` - Update cart
   - `DELETE /carts/{id}` - Delete cart
   - `PUT /users/{id}` - Update user info

4. **Test Accounts**:
   - Kiểm tra DummyJSON docs để lấy test accounts
   - Có thể dùng: `kminchelle` / `0lelplR` hoặc các accounts khác trong docs

---

## Thứ Tự Ưu Tiên Thực Hiện

1. **Phase 1-2**: Setup + Authentication (Foundation)
2. **Phase 3**: Product List (Core feature)
3. **Phase 4**: Shopping Cart (Core feature)
4. **Phase 5**: Checkout (Core feature)
5. **Phase 6**: Error Handling (Important)
6. **Phase 7**: UI/UX (Polish)
7. **Phase 8-9**: Testing & Deployment (Finalize)

---

## Kỹ Thuật Sẽ Học Được

Khi làm theo cách tiếp cận này (chỉ React + TypeScript), bạn sẽ hiểu sâu về:

### 1. **React Core Concepts**
- `useState` - Quản lý local state
- `useEffect` - Side effects, lifecycle, cleanup
- `useContext` - Global state management
- `createContext` - Tạo context providers
- `React.memo`, `useMemo`, `useCallback` - Performance optimization

### 2. **TypeScript Fundamentals**
- Type definitions và interfaces
- Generic types
- Type guards và type narrowing
- Utility types (Partial, Pick, Omit, etc.)

### 3. **Native Browser APIs**
- `fetch` API - HTTP requests
- `localStorage` - Client-side storage
- `Intersection Observer` - Infinite scroll
- `setTimeout` / `clearTimeout` - Debounce implementation

### 4. **Form Handling**
- Controlled components với `useState`
- Validation logic thủ công
- Error state management
- Form submission handling

### 5. **State Management Patterns**
- Context API pattern
- Prop drilling vs Context
- State lifting
- Local vs Global state

### 6. **Performance Optimization**
- Debounce implementation thủ công
- Memoization strategies
- Lazy loading với React.lazy
- Code splitting

### 7. **CSS & Styling**
- CSS Modules hoặc CSS thuần
- CSS Variables
- Responsive design với media queries
- Flexbox và Grid

---

## Lợi Ích Của Cách Tiếp Cận Này

✅ **Hiểu bản chất**: Không phụ thuộc vào "magic" của các thư viện  
✅ **Tự chủ**: Biết cách implement từ đầu, không cần thư viện  
✅ **Nhẹ**: Bundle size nhỏ, performance tốt  
✅ **Linh hoạt**: Dễ customize và debug  
✅ **Học tập**: Hiểu sâu về React và JavaScript/TypeScript  

---

Chúc bạn code thành công! 🚀
