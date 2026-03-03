import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-danger)]/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--color-danger)]/10 blur-3xl rounded-full"></div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/8 shadow-2xl mt-6 rounded-3xl p-10 flex flex-col items-center text-center max-w-md w-full relative z-10"
      >

        {/* Red Icon Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="bg-[var(--color-danger)]/30 p-6 rounded-full mb-6 shadow-lg"
        >
          <FaTimes className="text-[var(--color-danger)] text-5xl" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold bg-[var(--color-danger)] bg-clip-text text-transparent mb-5 pb-8"
        >
          Payment Failed
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-400 mb-8 text-lg"
        >
          Oops! Something went wrong with your transaction. <br />
          Please try again.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col gap-4 w-full"
        >
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-[var(--color-danger)] hover:bg-red-500 text-white py-3 rounded-2xl font-bold shadow-lg transition transform hover:scale-105"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-2xl font-semibold shadow transition transform hover:scale-105"
          >
            Back to Home
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}