import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Checkout from './pages/order/Checkout';
import Orders from './pages/order/Orders';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequireAuth from './pages/admin/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Admin routes (no navbar/footer) */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Public routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
              <Route path="/orders" element={<PublicLayout><Orders /></PublicLayout>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ConvexProvider>
  );
}

export default App;
