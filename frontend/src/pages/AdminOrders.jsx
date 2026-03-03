// /pages/AdminOrders.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
  CONFIRMED: "bg-green-500/20 text-green-400 border border-green-400/30",
  SHIPPED: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
  CANCELLED: "bg-red-500/20 text-red-400 border border-red-400/30",
};

const AdminOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [updating, setUpdating] = useState({}); // track button loading per order

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.log("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating((prev) => ({ ...prev, [orderId]: true }));
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.log("Failed to update status:", err);
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (!user || user.role !== "admin")
    return (
      <div className="text-center pt-45 text-white text-xl">
        Admin access only
      </div>
    );

  if (loading)
    return (
      <div className="text-center pt-45 text-[var-(--color-primary)] text2xl">
        Loading orders...
      </div>
    );

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);



    return (
  <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">

    {/* Header */}
    <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-primary)] mb-10">
      Order Management
    </h2>

    {/* Filter Bar */}
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"].map((s) => (
        <button
          key={s}
          onClick={() => setFilter(s)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition
            ${
              filter === s
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"
            }`}
        >
          {s}
        </button>
      ))}
    </div>

    {/* Orders */}
    <AnimatePresence>
      {filteredOrders.length === 0 ? (
        <motion.p
          key="no-orders"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center text-[var(--color-muted)] text-lg"
        >
          No orders found
        </motion.p>
      ) : (
        filteredOrders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.04 }}
            className="bg-[var(--color-card)] border border-[var(--color-border)]
            rounded-3xl p-6 mb-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">

              {/* Image */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-[var(--color-border)]">
                <img
                  src={order.product?.image}
                  alt={order.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-semibold">
                  {order.product?.name}
                </h3>

                <p className="text-sm text-[var(--color-muted)]">
                  Customer: {order.user?.name} ({order.user?.email})
                </p>

                <p className="text-sm text-[var(--color-muted)]">
                  Qty: {order.quantity} | Warehouse: {order.warehouseUsed}
                </p>

                <p className="text-sm text-[var(--color-muted)]">
                  Total: <span className="font-medium text-[var(--color-primary)]">${order.totalPrice}</span>
                </p>

                <p className="text-xs text-[var(--color-muted)]">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Status + Actions */}
              <div className="flex flex-col items-center gap-4">

                {/* Status Badge */}
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    order.status === "PENDING"
                      ? "bg-yellow-50 text-yellow-600"
                      : order.status === "CONFIRMED"
                      ? "bg-green-100 text-green-600"
                      : order.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap justify-center">

                  <button
                    disabled={order.status !== "PENDING" || updating[order._id]}
                    onClick={() => updateStatus(order._id, "CONFIRMED")}
                    className="px-3 py-1 rounded-lg text-md border border-[var(--color-success)] 
                    text-[var(--color-success)] hover:bg-[var(--color-success)] 
                    hover:text-white transition disabled:opacity-40"
                  >
                    Confirm
                  </button>

                  <button
                    disabled={order.status !== "CONFIRMED" || updating[order._id]}
                    onClick={() => updateStatus(order._id, "SHIPPED")}
                    className="px-3 py-1 rounded-lg text-md border border-[var(--color-primary)] 
                    text-[var(--color-primary)] hover:bg-[var(--color-primary)] 
                    hover:text-white transition disabled:opacity-40"
                  >
                    Ship
                  </button>

                  <button
                    disabled={
                      order.status === "SHIPPED" ||
                      order.status === "CANCELLED" ||
                      updating[order._id]
                    }
                    onClick={() => updateStatus(order._id, "CANCELLED")}
                    className="px-3 py-1 rounded-lg text-md border border-[var(--color-danger)] 
                    text-[var(--color-danger)] hover:bg-[var(--color-danger)] 
                    hover:text-white transition disabled:opacity-40"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </AnimatePresence>
  </div>
);
};

export default AdminOrders;