// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

// Pages & Layouts
import Landing from "./pages/Landing"
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Cancel from "./pages/Cancel";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminLayout from "./layouts/AdminLayout";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  const user = useAuthStore((state) => state.user);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <>
      <ToastContainer position="bottom-right" />

      {/* Show Navbar only for customers */}
      {user && user.role === "customer" && (
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      )}

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin-dashboard" : "/home"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* Customer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard"
           element={<AdminLayout darkMode={darkMode} toggleTheme={toggleTheme} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* Catch-all: redirect to login if not logged in */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? user.role === "admin"
                    ? "/admin-dashboard"
                    : "/home"
                  : "/"
              }
              replace
            />
          }
        />
        {/* show footer only for customers */}
      </Routes>
       {user && user.role === "customer" && (
        <Footer />
      )}
    </>
  );
}

export default App;