import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const steps = ["PLACED", "CONFIRMED", "SHIPPED"];

const OrderHistory = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/api/orders/user-orders?userId=${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.log("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  const getStepIndex = (status) => steps.indexOf(status);

  if (!user)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center text-gray-400 text-xl">
        Please login to view your orders
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-primary)] text-2xl">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center text-gray-400">
        <h2 className="text-3xl font-semibold mb-4">No orders yet 📦</h2>
        <button
          onClick={() => navigate("/home")}
          className="px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-semibold hover:scale-105 transition"
        >
          Start Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">

      {/* ===== Banner Section ===== */}  
      <div className="h-[350px] md:h-[500px] relative flex items-center justify-center overflow-hidden">
        <img
          src="./historyOrder.jpg"
          alt="checkout banner"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>

        <motion.h2 
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-4xl md:text-5xl font-bold text-white">
          Order History
        </motion.h2>
      </div>

      {/* Orders List */}
      <div className="max-w-5xl mx-auto mt-12 px-6 space-y-6">
        {orders.map((order, index) => {
          const currentStep = getStepIndex(order.status);

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-[var(--color-card)] border border-[var(--color-border)] 
                rounded-3xl p-8 shadow-2xl relative z-10"
            >
              {/* HEADER SECTION */}
              <div className="flex flex-col md:flex-row justify-between gap-6">

                <div className="flex gap-6 items-center">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[var(--color-border)]">
                    <img
                      src={order.product?.image}
                      alt={order.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)]">
                      {order.product?.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Order ID: {order._id}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-[var(--color-primary)]">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">Qty: {order.quantity}</p>
                </div>
              </div>

              {/* TRACKING PROGRESS */}
              <div className="mt-8">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  {steps.map((step, i) => (
                    <span key={i}>{step}</span>
                  ))}
                </div>

                <div className="relative h-2 bg-white/10 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="absolute h-2 bg-gradient-to-r from-[var(--color-primary)] to-cyan-400 rounded-full"
                  />
                </div>
              </div>

              {/* Expandable Details */}
              <button
                onClick={() => setOpenOrder(openOrder === order._id ? null : order._id)}
                className="mt-6 text-[var(--color-primary)] text-sm font-semibold hover:underline"
              >
                {openOrder === order._id ? "Hide Details" : "View Details"}
              </button>

              <AnimatePresence>
                {openOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-6 border-t border-[var(--color-border)] pt-6 text-gray-400 space-y-2"
                  >
                    <p>Product Price: ${order.product?.price}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Warehouse: {order.warehouseUsed}</p>
                    <p>Status: {order.status}</p>
                    <p>Total Paid: ${order.totalPrice}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;