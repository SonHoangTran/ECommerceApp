import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { Login } from './pages/Login';
import { ProductList } from './pages/ProductList';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Loading } from './components/common/Loading';
import { Header } from './components/layout/Header';
import { CartProvider } from './context/CartContext';

/**
 * Root route component that handles redirects based on authentication
 */
const RootRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return (
    <Navigate
      to={isAuthenticated ? '/products' : '/login'}
      replace
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Header />
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductList />} />
          
          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          
          {/* Root Route - Redirect based on authentication */}
          <Route path="/" element={<RootRoute />} />
          
          {/* Catch all - redirect to products */}
          <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
