// /components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { FaShoppingCart, FaClipboardList, FaStore, FaSun, FaMoon } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Navbar = ({ darkMode, toggleTheme }) => {
  const cart = useCartStore((state) => state.cart);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="fixed w-full z-50 backdrop-blur-sm bg-white/60 border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        
        {/* LOGO */}
        <Link
          to="/home"
          className="flex items-center gap-2 text-sm sm:text-xl md:text-2xl font-bold tracking-wide text-[var(--color-primary)]"
        >
          <FaStore className="text-[var(--color-primary)] text-xl md:text-3xl" />
          Mini E-Store
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-1 md:gap-4 md:gap-6 text-[var(--color-text)] font-medium">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--color-primary)]/10 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun className="text-[var(--color-primary)]" /> : <FaMoon className="text-[var(--color-primary)]" />}
          </button>

          {/* Customer Links */}
          {user && user.role === "customer" && (
            <>
              <Link
                to="/orders"
                className="flex items-center gap-1 hover:text-[var(--color-primary)] transition"
              >
                <FaClipboardList />
                Orders
              </Link>

              <Link
                to="/cart"
                className="relative flex items-center gap-1 hover:text-[var(--color-primary)] transition"
              >
                <FaShoppingCart />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[var(--color-primary)] text-[var(--color-bg)] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* Avatar + Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="ml-2 w-6 h-6 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center font-bold cursor-pointer shadow-sm">
                  {firstLetter}
                </div>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm p-4 text-[var(--color-text)]"
                    >
                      <p className="text-sm text-[var(--color-muted)] mb-2">Logged in as</p>
                      <p className="font-semibold mb-4">{user.name}</p>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-[var(--color-primary)] text-[var(--color-bg)] py-2 rounded-lg font-semibold hover:scale-105 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {!user && <Link to="/login" className="text-[var(--color-primary)] font-semibold">Login</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;