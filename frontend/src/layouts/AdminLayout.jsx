import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import {
  FaChartLine,
  FaPlus,
  FaSignOutAlt,
  FaClipboardList,
  FaBars,
  FaTimes, 
  FaSun,
  FaMoon
} from "react-icons/fa";

const AdminLayout = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

 return (
  <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside
      className={`fixed z-50 h-full w-64 bg-black/90 text-white backdrop-blur-sm border-r border-[var(--color-border)] shadow-lg transform transition-transform duration-300
      border-r border-[var(--color-border)] p-6 transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
    >
      {/* Mobile Close */}
      <div className="flex justify-between items-center lg:hidden mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">
          Menu
        </h2>
        <FaTimes onClick={() => setSidebarOpen(false)} className="cursor-pointer" />
      </div>

      <h2 className="hidden lg:block text-2xl font-semibold text-[var(--color-primary)] mb-10">
        Command Center
      </h2>

      <nav className="space-y-3">
        <button
          onClick={() => {
            navigate("/admin-dashboard");
            setSidebarOpen(false);
          }}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-white hover:bg-gray-800 transition"
        >
          <FaChartLine /> Dashboard
        </button>

        <button
          onClick={() => {
            navigate("/admin-dashboard/add-product");
            setSidebarOpen(false);
          }}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-white hover:bg-gray-800 transition"
        >
          <FaPlus /> Add Product
        </button>

        <button
          onClick={() => {
            navigate("/admin-dashboard/orders");
            setSidebarOpen(false);
          }}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-white hover:bg-gray-800 transition"
        >
          <FaClipboardList /> Manage Orders
        </button>
      </nav>

      <div className="absolute bottom-10 left-6 right-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>

    {/* Main Content */}
    <div className="flex-1 lg:ml-64">

      {/* Topbar */}
      <div className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-[var(--color-border)] bg-[var(--color-card)] fixed left-0 right-0 lg:left-64 z-30">

  <div className="flex items-center gap-4">
    <FaBars
      className="text-xl cursor-pointer lg:hidden"
      onClick={() => setSidebarOpen(true)}
    />

    <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-primary)]">
      Admin Dashboard
    </h1>
  </div>

  <div className="flex items-center gap-4">

    {/* Theme Toggle */}
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[var(--color-primary)]/10 transition"
    >
      {darkMode ? (
        <FaSun className="text-[var(--color-primary)]" />
      ) : (
        <FaMoon className="text-[var(--color-primary)]" />
      )}
    </button>

    {/* Avatar */}
    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold">
      M
    </div>

  </div>
</div>


      <div className="pt-28 px-6 lg:px-10 pb-10">
        <Outlet />
      </div>
    </div>
  </div>
);
    
};

export default AdminLayout;