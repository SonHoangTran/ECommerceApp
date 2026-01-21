# E-Commerce App – Luồng xử lý Product & Logout

Tài liệu này mô tả **luồng xử lý (flow)** trong ứng dụng React + TypeScript cho:

* Product → ProductList
* Logout

Mục tiêu: giúp hiểu **bản chất React, Context, API layer**, không chỉ code chạy.

---

## 1. Tổng quan kiến trúc

```
UI (Component / Page)
   ↓
Context (Auth / State dùng chung)
   ↓
API Layer (fetch wrapper)
   ↓
DummyJSON API
```

Nguyên tắc:

* **Page**: giữ state, gọi API
* **Component**: chỉ render UI
* **Context**: chia sẻ state toàn app
* **API layer**: tất cả fetch tập trung 1 chỗ

---

## 2. Luồng Product → ProductList

### 2.1 Các file liên quan

```
src/
 ├─ types/product.ts        (định nghĩa kiểu dữ liệu)
 ├─ api/products.ts         (gọi API products)
 ├─ pages/ProductList.tsx   (page, giữ state)
 └─ components/
     └─ ProductCard.tsx     (UI hiển thị 1 product)
```

---

### 2.2 Product Type (types/product.ts)

Mục đích:

* Định nghĩa **shape dữ liệu**
* Giúp TypeScript check lỗi sớm
* Dùng chung cho API + UI

```ts
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
```

👉 Nếu API trả thiếu field → TS báo lỗi ngay.

---

### 2.3 API Layer – getProducts (api/products.ts)

Mục đích:

* Page **không gọi fetch trực tiếp**
* Dễ đổi API / mock / test

```ts
export const getProducts = (skip = 0, limit = 20) => {
  return api.get<ProductsResponse>(`/products?skip=${skip}&limit=${limit}`);
};
```

Flow:

```
ProductList → getProducts()
            → api.get()
            → apiRequest()
            → fetch(dummyjson)
```

---

### 2.4 ProductList Page (pages/ProductList.tsx)

#### Trách nhiệm của ProductList

* Giữ state:

  * products
  * loading
  * error
* Fetch data khi component **mount**
* Render danh sách ProductCard

---

#### Luồng chạy chi tiết

```
User vào /products
   ↓
ProductList mount
   ↓
useEffect([]) chạy 1 lần
   ↓
fetchProducts()
   ↓
getProducts()
   ↓
setProducts()
   ↓
React re-render UI
```

---

#### Vì sao dùng useEffect([])?

* `[]` = chỉ chạy **1 lần**
* Tương đương `componentDidMount`
* Tránh fetch lại vô hạn

---

### 2.5 ProductCard

Mục đích:

* Chỉ hiển thị UI
* Không chứa logic fetch

```tsx
<ProductCard product={product} />
```

👉 Đây là nguyên tắc **Separation of Concerns**.

---

## 3. Luồng Logout

### 3.1 Các file liên quan

```
src/
 ├─ context/AuthContext.tsx
 ├─ api/auth.ts
 └─ components/layout/Header.tsx
```

---

### 3.2 Auth Context – Vai trò

AuthContext chịu trách nhiệm:

* Lưu trạng thái đăng nhập
* Chia sẻ user cho toàn app
* Cung cấp login / logout

```ts
{
  isAuthenticated,
  user,
  loading,
  login(),
  logout()
}
```

---

### 3.3 Logout Flow (chi tiết)

#### Khi user click Logout

```
Header
  ↓
logout()
  ↓
authApi.logout()
  ↓
localStorage.clear token + user
  ↓
set user = null
set isAuthenticated = false
  ↓
React re-render toàn app
```

---

### 3.4 Điều gì xảy ra sau logout?

* Header:

  * Không còn user → hiện Login link
* ProtectedRoute:

  * isAuthenticated = false
  * Redirect về /login
* API:

  * Không còn token trong header

---

### 3.5 Vì sao logout không cần gọi API?

DummyJSON:

* Không có endpoint logout thật
* JWT chỉ là demo

➡️ Logout bản chất là:

> **Xoá trạng thái phía client**

---

## 4. Tổng kết tư duy quan trọng

### Product Flow

* Page fetch data
* Component render UI
* API layer tách biệt
* State thay đổi → React tự render

### Logout Flow

* Không reload page
* Không gọi API
* Context update → UI đổi toàn bộ



End of document.
