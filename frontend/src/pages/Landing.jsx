import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-hidden relative">

          {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)]/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-3xl rounded-full"></div>

      {/* ---------------- NAVBAR ---------------- */}
      <nav className="flex justify-between px-16 py-4 items-center px-8 py-5 border-b border-gray-200">

        {/* Logo */}
        <div className="flex items-center gap-3">
            <img src="/L2.png" alt="logo" className="w-10 h-10" />
          <span className="text-2xl font-sans font-bold text-[var(--color-primary)]">Mini E-Store</span>
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-[var(--color-primary)] text-white text-lg cursor-pointer rounded-lg font-semibold hover:opacity-90"
        >
          Login
        </button>

      </nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">

        {/* Image */}
        <motion.img
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          src="/L1.png"
          alt="Ecommerce"
          className="w-[350px] md:w-[400px] h-[350px] mb-1 object-contain"
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Welcome Customers & Admins 👋
        </motion.h1>

        {/* Description */}
        <p className="text-gray-400 text-md max-w-xl mb-5">
          This platform allows customers to explore products and place orders
          while administrators can manage inventory, orders, and analytics from
          a powerful dashboard.
        </p>

        {/* Get Started Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full shadow-lg"
        >
          Get Started
        </motion.button>

      </div>
    </div>
  );
};

export default Landing;