import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  //  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    } 
  }, [user, navigate]);
  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-hidden relative">

          {/* Glow Effects */}
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 md:bg-[var(--color-primary)]/20 blur-3xl rounded-full"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] md:bg-[var(--color-primary)]/10 blur-3xl rounded-full"></div>

   
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="flex flex-col pt-5 pb-5 items-center justify-center flex-1 text-center px-6">

        {/* Image */}
        <motion.img
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          src="/ill1.webp"
          alt="Ecommerce"
          className="w-[400px] md:w-[500px] mb-4 object-contain"
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]/90"
        >
         Shop Smart. Live Better
        </motion.h1>

        {/* Description */}
        <p className="text-gray-500 text-md max-w-xl mb-6 mt-2">
          Discover a world of convenience at your fingertips. Shop the latest trends, Your perfect purchase is just a click away!
        </p>

        {/* Get Started Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/home")}
          className="px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition"
        >
          Get Started
        </motion.button>

      </div>
    </div>
  );
};

export default Landing;