# 🔐 Giải Thích Luồng Hoạt Động Authentication

## 📋 Mục Lục
1. [Cấu Trúc Tổng Thể](#1-cấu-trúc-tổng-thể)
2. [Luồng Khởi Động App](#2-luồng-khởi-động-app)
3. [Luồng Đăng Nhập](#3-luồng-đăng-nhập)
4. [Luồng Truy Cập Protected Route](#4-luồng-truy-cập-protected-route)
5. [Luồng Logout](#5-luồng-logout)
6. [Data Flow Diagram](#6-data-flow-diagram)

---

## 1. Cấu Trúc Tổng Thể

```
App (Root Component)
│
├── BrowserRouter (React Router)
│   │
│   └── AuthProvider (Context Provider)
│       │
│       ├── State Management:
│       │   ├── isAuthenticated: boolean
│       │   ├── user: User | null
│       │   ├── token: string | null
│       │   └── loading: boolean
│       │
│       └── Routes
│           ├── Public Routes (/login, /products)
│           └── Protected Routes (/cart, /checkout, /order-confirmation)
```

### Các Layer Chính:

1. **API Layer** (`src/api/auth.ts`)
   - Gọi API external (DummyJSON)
   - Quản lý localStorage
   - Trả về dữ liệu đã xử lý

2. **Context Layer** (`src/context/AuthContext.tsx`)
   - Quản lý global state
   - Cung cấp functions: login, logout, checkAuth
   - Tự động kiểm tra authentication khi app khởi động

3. **Component Layer** (Pages & Components)
   - Login Page: Form đăng nhập
   - ProtectedRoute: Bảo vệ routes cần authentication
   - Các pages khác: Sử dụng AuthContext

---

## 2. Luồng Khởi Động App

### Bước 1: App Component Mount
```tsx
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>  {/* 👈 Context Provider bọc toàn bộ app */}
        <Routes>...</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Bước 2: AuthProvider Khởi Tạo
```tsx
export const AuthProvider = ({ children }) => {
  // 1. Khởi tạo state với giá trị mặc định
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Bắt đầu với loading = true
  
  // 2. useEffect chạy khi component mount
  useEffect(() => {
    checkAuth(); // 👈 Tự động kiểm tra authentication
  }, [checkAuth]);
}
```

### Bước 3: checkAuth() Function Chạy
```tsx
const checkAuth = useCallback(() => {
  // 1. Đọc user từ localStorage
  const currentUser = authApi.getCurrentUser();
  
  // 2. Đọc token từ localStorage
  const currentToken = authApi.isAuthenticated() 
    ? localStorage.getItem('token') 
    : null;
  
  // 3. Kiểm tra và cập nhật state
  if (currentUser && currentToken) {
    setIsAuthenticated(true);  // ✅ Đã đăng nhập
    setUser(currentUser);
    setToken(currentToken);
  } else {
    setIsAuthenticated(false); // ❌ Chưa đăng nhập
    setUser(null);
    setToken(null);
  }
  
  setLoading(false); // 👈 Hoàn thành kiểm tra
}, []);
```

### Bước 4: RootRoute Component Xử Lý Redirect
```tsx
const RootRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();
  
  // Nếu đang loading → hiển thị Loading component
  if (loading) {
    return <Loading />;
  }
  
  // Nếu đã đăng nhập → redirect đến /products
  // Nếu chưa đăng nhập → redirect đến /login
  return <Navigate to={isAuthenticated ? '/products' : '/login'} replace />;
};
```

### 📊 Timeline Khởi Động:
```
t0: App mount
    ↓
t1: AuthProvider mount → loading = true
    ↓
t2: useEffect chạy → gọi checkAuth()
    ↓
t3: checkAuth() đọc localStorage
    ↓
t4: Cập nhật state (isAuthenticated, user, token)
    ↓
t5: loading = false
    ↓
t6: RootRoute render → redirect
```

---

## 3. Luồng Đăng Nhập

### Bước 1: User Nhập Thông Tin
```tsx
// Login.tsx
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

// User nhập vào form → state được cập nhật
<Input
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

### Bước 2: User Click Login Button
```tsx
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // Ngăn form submit mặc định
  
  // 1. Validate form
  if (!validateForm()) {
    return; // Nếu invalid → dừng lại
  }
  
  // 2. Set loading state
  setLoading(true);
  
  // 3. Gọi login function từ AuthContext
  try {
    await login(username, password);
    // 4. Nếu thành công → redirect
    navigate('/products', { replace: true });
  } catch (err) {
    // 5. Nếu lỗi → hiển thị error message
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Bước 3: AuthContext.login() Được Gọi
```tsx
// AuthContext.tsx
const login = useCallback(async (username: string, password: string) => {
  try {
    // 1. Gọi API login
    const userData = await authApi.login(username, password);
    
    // 2. Đọc token từ localStorage (đã được lưu bởi authApi.login)
    const tokenData = localStorage.getItem('token');
    
    // 3. Cập nhật Context state
    setIsAuthenticated(true);
    setUser(userData);
    setToken(tokenData);
  } catch (error) {
    // 4. Nếu lỗi → reset state và throw error
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    throw error;
  }
}, []);
```

### Bước 4: authApi.login() Gọi API
```tsx
// api/auth.ts
export const login = async (username: string, password: string) => {
  // 1. Tạo login request data
  const loginData: LoginRequest = { username, password };
  
  // 2. Gọi API POST /auth/login
  const response = await api.post<LoginResponse>('/auth/login', loginData);
  
  // 3. Lưu token vào localStorage
  storage.setToken(response.token);
  
  // 4. Tạo user object và lưu vào localStorage
  const user: User = {
    id: response.id,
    username: response.username,
    email: response.email,
    // ... các field khác
  };
  storage.setUser(user);
  
  // 5. Trả về user object
  return user;
};
```

### Bước 5: API Request Flow
```tsx
// utils/api.ts
const apiRequest = async (endpoint, options) => {
  // 1. Tạo headers
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // 2. Gọi fetch API
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers,
  });
  
  // 3. Kiểm tra response status
  if (!response.ok) {
    throw new ApiException(...);
  }
  
  // 4. Parse JSON response
  const data = await response.json();
  return data;
};
```

### 📊 Timeline Đăng Nhập:
```
t0: User nhập username/password
    ↓
t1: Click "Login" button
    ↓
t2: validateForm() → kiểm tra required fields
    ↓
t3: setLoading(true) → disable form
    ↓
t4: login(username, password) từ AuthContext
    ↓
t5: authApi.login() → gọi API
    ↓
t6: api.post() → fetch POST /auth/login
    ↓
t7: DummyJSON API trả về LoginResponse
    ↓
t8: storage.setToken() → lưu token vào localStorage
    ↓
t9: storage.setUser() → lưu user vào localStorage
    ↓
t10: Context state được cập nhật (isAuthenticated = true)
    ↓
t11: navigate('/products') → redirect đến products page
```

---

## 4. Luồng Truy Cập Protected Route

### Kịch Bản: User Truy Cập `/cart` Khi Chưa Đăng Nhập

### Bước 1: User Navigate Đến `/cart`
```tsx
// App.tsx
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>
```

### Bước 2: ProtectedRoute Component Render
```tsx
// ProtectedRoute.tsx
export const ProtectedRoute = ({ children }) => {
  // 1. Lấy authentication state từ Context
  const { isAuthenticated, loading } = useAuthContext();
  
  // 2. Nếu đang loading → hiển thị Loading
  if (loading) {
    return <Loading />;
  }
  
  // 3. Nếu chưa đăng nhập → redirect đến /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // 👈 Redirect!
  }
  
  // 4. Nếu đã đăng nhập → render children (Cart component)
  return <>{children}</>;
};
```

### 📊 Timeline Protected Route:
```
t0: User navigate đến /cart
    ↓
t1: ProtectedRoute mount
    ↓
t2: useAuthContext() → lấy isAuthenticated, loading
    ↓
t3: Kiểm tra loading?
    ├─ YES → render <Loading />
    └─ NO → tiếp tục
    ↓
t4: Kiểm tra isAuthenticated?
    ├─ NO → <Navigate to="/login" /> (redirect)
    └─ YES → render <Cart />
```

---

## 5. Luồng Logout

### Bước 1: User Click Logout Button
```tsx
// Trong bất kỳ component nào
const { logout } = useAuthContext();

const handleLogout = () => {
  logout(); // 👈 Gọi logout function
};
```

### Bước 2: AuthContext.logout() Được Gọi
```tsx
// AuthContext.tsx
const logout = useCallback(() => {
  // 1. Gọi authApi.logout() để xóa localStorage
  authApi.logout();
  
  // 2. Reset Context state
  setIsAuthenticated(false);
  setUser(null);
  setToken(null);
}, []);
```

### Bước 3: authApi.logout() Xóa localStorage
```tsx
// api/auth.ts
export const logout = (): void => {
  // Xóa token và user khỏi localStorage
  storage.removeToken();
  storage.removeUser();
};
```

### Bước 4: Context State Update → Re-render
```tsx
// Khi state thay đổi:
isAuthenticated: true → false
user: User → null
token: string → null

// → Tất cả components sử dụng AuthContext sẽ re-render
// → ProtectedRoute sẽ redirect về /login
```

### 📊 Timeline Logout:
```
t0: User click "Logout"
    ↓
t1: logout() từ AuthContext
    ↓
t2: authApi.logout() → xóa localStorage
    ↓
t3: Context state reset (isAuthenticated = false)
    ↓
t4: Tất cả components re-render
    ↓
t5: ProtectedRoute phát hiện !isAuthenticated
    ↓
t6: Redirect về /login (nếu đang ở protected route)
```

---

## 6. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Action                          │
│                  (Nhập form, click button)                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Login Component                          │
│  - useState cho form fields                                 │
│  - handleSubmit() → gọi login() từ Context                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    AuthContext                              │
│  - login() → gọi authApi.login()                           │
│  - Cập nhật state: isAuthenticated, user, token            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (authApi)                      │
│  - Gọi api.post('/auth/login')                             │
│  - Lưu token và user vào localStorage                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Base (utils/api.ts)                  │
│  - apiRequest() → fetch API                                 │
│  - Xử lý headers, error handling                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  DummyJSON API                              │
│              https://dummyjson.com/auth/login               │
│                  Trả về LoginResponse                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Response Flow (Ngược lại)                  │
│  LoginResponse → authApi → Context → Component              │
│  → Navigate to /products                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### 1. **React Context API**
- `createContext()`: Tạo context
- `Context.Provider`: Cung cấp giá trị cho children
- `useContext()`: Sử dụng context trong components

### 2. **State Management**
- **Global State** (Context): `isAuthenticated`, `user`, `token`
- **Local State** (Component): Form fields, loading, errors
- **Persistent State** (localStorage): Token và user info

### 3. **Authentication Flow**
```
localStorage ←→ Context State ←→ Components
     ↑                ↑              ↑
  Persistent      Global State   UI Updates
```

### 4. **Protection Mechanism**
- ProtectedRoute kiểm tra `isAuthenticated` từ Context
- Nếu `false` → redirect đến `/login`
- Nếu `true` → render protected content

### 5. **Persistence**
- Token và user được lưu vào localStorage
- Khi app khởi động lại → `checkAuth()` đọc từ localStorage
- Đảm bảo user vẫn đăng nhập sau khi refresh page

---

## 💡 Tại Sao Làm Như Vậy?

### 1. **Context API thay vì Prop Drilling**
- Tránh truyền props qua nhiều level
- Dễ dàng access authentication state từ bất kỳ component nào

### 2. **Tách biệt Layer**
- **API Layer**: Chỉ xử lý API calls và localStorage
- **Context Layer**: Quản lý global state
- **Component Layer**: Chỉ hiển thị UI và handle user interactions

### 3. **Type Safety**
- TypeScript đảm bảo type safety ở mọi layer
- Dễ dàng catch errors trong development

### 4. **Separation of Concerns**
- Mỗi file có một trách nhiệm rõ ràng
- Dễ dàng test và maintain

---

## 🎯 Tóm Tắt

1. **App khởi động** → AuthProvider check localStorage → Set state
2. **User đăng nhập** → API call → Save to localStorage → Update Context → Navigate
3. **Truy cập protected route** → ProtectedRoute check Context → Allow/Redirect
4. **Logout** → Clear localStorage → Reset Context → Redirect

Luồng này đảm bảo:
- ✅ Authentication state được quản lý tập trung
- ✅ Persistent login sau khi refresh
- ✅ Protected routes được bảo vệ tự động
- ✅ Type-safe với TypeScript
- ✅ Dễ dàng maintain và extend
