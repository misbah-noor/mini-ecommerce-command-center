// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Password validation
    if(password.length < 6){
      toast.error("Password must be at least 6 characters");
      return;
    }
    if(!email.includes("@")){
      toast.error("Please enter a valid email");
      return;
    }

    let user;
    if (isSignUp) {
      user = await register(name, email, password, "customer");

      if (user) {
        toast.success(`🎉Welcome ${user.name}! Account created.`);
        navigate("/home", { replace: true });
        return;
      }
    } else {
      user = await login(email, password);

      if (user) {
        toast.success(`Welcome back ${user.name}!`);
        navigate("/home", { replace: true });
      }
    }

    if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
    else navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen flex justify-center item-center bg-white text-black overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 md:bg-[var(--color-primary)]/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-3xl rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center p-4 md:p-0 relative z-10"
      >
        <div className="backdrop-blur-2xl bg-black/90 border border-white/10 shadow-2xl rounded-xl py-12 px-8 md:px-12 w-full max-w-xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[var(--color-primary)] to-white bg-clip-text text-transparent text-center mb-8">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {isSignUp && (
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full p-4 font-semibold rounded-xl bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/10 transition disabled:opacity-50"
            >
              {loading
                ? isSignUp
                  ? "Creating account..."
                  : "Logging in..."
                : isSignUp
                ? "Sign Up"
                : "Login"}
            </motion.button>

            {error && (
              <p className="text-red-400 text-center text-sm">{error}</p>
            )}
          </form>

          <p className="text-center text-gray-300 mt-4">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--color-primary)] font-semibold underline ml-1"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;