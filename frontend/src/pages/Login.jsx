// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = await login(name, email, password, "customer");
    if (!user) return;

    if (user.role === "admin") 
       navigate("/admin-dashboard", { replace: true });
    else
       navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen pt-27 bg-white text-black overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)]/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-3xl rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center p-6 relative z-10"
      >
        <div className="backdrop-blur-2xl bg-black/90 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold  bg-gradient-to-r from-white via-[var(--color-primary)] to-white bg-clip-text text-transparent text-center mb-8">Welcome To Our Store</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

           

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full p-4 font-semibold rounded-xl bg-[var(--color-primary)] text-black shadow-lg shadow-[var(--color-primary)]/10 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;