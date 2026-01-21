# E-Commerce App – Luồng xử lý Product (Infinite Scroll + Search) & Logout

Tài liệu này mô tả **luồng xử lý (flow)** trong ứng dụng React + TypeScript cho:

* Product → ProductList (Infinite Scroll + Search)
* Logout

Mục tiêu: hiểu **bản chất React (state, effect, re-render)**, **API layer**, **tư duy tách trách nhiệm**.

---

## 1. Tổng quan kiến trúc

```
UI (Component / Page)
   ↓
State (useState, useEffect)
   ↓
API Layer (products.ts)
   ↓
DummyJSON API
```

Nguyên tắc:

* **Page**: giữ state + điều khiển flow
* **Component**: chỉ render UI
* **API layer**: tất cả fetch tập trung một chỗ
* **State đổi → React tự re-render**

---

## 2. Luồng Product → ProductList (Infinite Scroll + Search)

### 2.1 Các file liên quan

```
src/
 ├─ types/product.ts
 ├─ api/products.ts
 ├─ pages/ProductList.tsx
 └─ components/
     └─ product/ProductCard.tsx
```

---

## 2.2 Product Type (types/product.ts)

Mục đích:

* Định nghĩa **kiểu dữ liệu chuẩn**
* Dùng chung cho API + UI
* Tránh lỗi runtime

```ts
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
```

---

## 2.3 API Layer – getProducts (api/products.ts)

### Vai trò

* Page **không gọi fetch trực tiếp**
* Dễ thay API / mock / test
* Gom toàn bộ logic request

### API hỗ trợ 2 mode

* **Normal list**
* **Search list**

```ts
getProducts(skip, limit, query?)
```

Mapping API DummyJSON:

* Không search:

```
GET /products?skip=0&limit=20
```

* Có search:

```
GET /products/search?q=phone&skip=0&limit=20
```

---

## 2.4 ProductList – Trách nhiệm chính

ProductList **không chỉ render**, mà còn:

* Quản lý state:

  * products
  * skip
  * hasMore
  * loading
  * isFetchingMore
  * searchQuery
  * debouncedSearchQuery
* Điều khiển:

  * initial load
  * infinite scroll
  * search + debounce
* Quyết định **khi nào gọi API**

---

## 2.5 Luồng load sản phẩm ban đầu (Initial Load)

```
User vào /products
   ↓
ProductList mount
   ↓
useEffect(debouncedSearchQuery)
   ↓
fetchProducts(isLoadMore = false)
   ↓
getProducts(skip=0, limit=20)
   ↓
setProducts(response.products)
   ↓
setSkip(20)
   ↓
React re-render ProductGrid
```

📌 Chỉ **ProductGrid render lại**, header & search không đổi.

---

## 2.6 Infinite Scroll – Load thêm khi chạm đáy

### Điều kiện trigger

```
window.innerHeight + window.scrollY
>= documentHeight - threshold
```

và:

* Không đang fetch
* Còn dữ liệu (`hasMore = true`)

---

### Luồng Infinite Scroll

```
User scroll xuống cuối trang
   ↓
handleScroll detect chạm đáy
   ↓
fetchProducts(isLoadMore = true)
   ↓
getProducts(skip=20, limit=20)
   ↓
append products mới vào list cũ
   ↓
setSkip(40)
   ↓
React re-render ProductGrid
```

📌 **Chỉ load thêm 20 sản phẩm mỗi lần**

📌 **Không fetch liên tục khi chưa chạm đáy**

---

## 2.7 Search với Debounce (Quan trọng)

### Vì sao cần debounce?

Nếu không debounce:

```
gõ "iphone"
→ i
→ ip
→ iph
→ ipho
→ iphon
→ iphone
```

➡️ **6 request API** ❌

---

### Luồng Search + Debounce

```
User gõ vào ô search
   ↓
setSearchQuery()
   ↓
useEffect(searchQuery)
   ↓
setTimeout(400ms)
   ↓
setDebouncedSearchQuery()
```

---

### Khi debouncedSearchQuery thay đổi

```
debouncedSearchQuery change
   ↓
reset:
   - products = []
   - skip = 0
   - hasMore = true
   ↓
fetchProducts(isLoadMore = false)
   ↓
getProducts(search query)
   ↓
render lại danh sách mới
```

📌 Infinite scroll **vẫn hoạt động bình thường với search**

---

## 2.8 Clear Search

Khi user xoá hết text search:

```
searchQuery = ''
   ↓
debouncedSearchQuery = ''
   ↓
reset skip + products
   ↓
fetchProducts list mặc định
```

➡️ Trở về danh sách ban đầu

---

## 2.9 Tối ưu render – Vì sao không render lại header?

Cách làm:

```
ProductList
 ├─ ProductListHeader (static)
 └─ ProductGrid (dynamic)
```

* `products` chỉ truyền vào `ProductGrid`
* Khi products đổi → **chỉ grid render lại**

👉 Tránh re-render không cần thiết
👉 Chuẩn tư duy performance React

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

## 3.2 AuthContext – Vai trò

AuthContext quản lý:

* isAuthenticated
* user
* token
* login()
* logout()

➡️ **Toàn app dùng chung trạng thái auth**

---

## 3.3 Logout Flow

```
User click Logout (Header)
   ↓
logout()
   ↓
authApi.logout()
   ↓
localStorage.remove token + user
   ↓
set isAuthenticated = false
set user = null
   ↓
React re-render toàn app
```

---

## 3.4 Sau khi Logout

* Header:

  * Không còn user → hiện Login
* ProtectedRoute:

  * Redirect về /login
* API:

  * Không còn token trong header

📌 Không reload page
📌 Không cần gọi API logout

---

## 3.5 Vì sao logout không gọi API?

DummyJSON:

* Không có logout thật
* Token chỉ demo

➡️ Logout = **xoá trạng thái phía client**

---

## 4. Tổng kết tư duy quan trọng

### Product Flow

* Infinite scroll = **load theo nhu cầu**
* Search = **debounce + reset paging**
* Page điều khiển flow
* Component chỉ render
* State đổi → React tự render

### Logout Flow

* Context là trung tâm
* Không reload
* Không gọi API
* UI tự cập nhật theo state

---

**End of document.**
