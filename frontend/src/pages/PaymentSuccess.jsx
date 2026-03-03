import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex justify-center items-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-success-glow)]/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color-success-glow)]/10 blur-3xl rounded-full"></div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/8 shadow-2xl rounded-3xl p-10 flex flex-col items-center text-center max-w-md w-full relative z-10"
      >

        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="bg-[var(--color-success)] rounded-full p-5 mb-6 shadow-lg"
        >
          <FaCheckCircle className="text-white text-6xl" />
        </motion.div>

        {/* Success Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold bg-[var(--color-success)] bg-clip-text text-transparent mb-4 pb-5"
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-400 mb-8 text-lg"
        >
          Thank you for your purchase. Your order has been processed successfully.
        </motion.p>

        {/* Back Home Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link
            to="/home"
            className="bg-gradient-to-r from-[var(--color-success)] to-cyan-400 hover:scale-[1.05] transition-all px-6 py-3 rounded-2xl font-bold shadow-lg text-black"
          >
            Go Back Home
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}