// /pages/Cart.jsx
import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCartStore();
  const fetchCart = useCartStore.getState().fetchCart;
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
     if (user?._id) fetchCart();
  }, [user?._id]);

  if (!user)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-muted)] text-xl">
        Please login to see your cart
      </div>
    );

    if (cart.length === 0)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center text-gray-400">
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty 🛒</h2>
        <button
          onClick={() => navigate("/home")}
          className="px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-semibold hover:scale-105 transition"
        >
          Start Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20">

      {/* ===== Banner Section ===== */}  
      <div className="h-[350px] md:h-[500px] relative flex items-center justify-center overflow-hidden">
        <img
          src="./cart3.png"
          alt="cart b2nner"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.h2 
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative text-4xl md:text-5xl font-bold text-[var(--color-primary)]">
                  Order History
                </motion.h2>
           
        
      </div>

      {/* ===== Cart Content ===== */}
      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-8">

       

        {cart.map((item) => (
          <motion.div
            key={item._id}
            whileHover={{ scale: 1.01 }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-28 h-28 object-contain rounded-xl bg-[var(--color-bg)] p-4"
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {item.product.name}
                </h3>
                <p className="text-[var(--color-primary)] font-bold mt-2">
                  ${item.product.price}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  updateQuantity(item._id, Math.max(1, item.quantity - 1))
                }
                className="px-3 py-1 border border-[var(--color-border)] rounded-lg"
              >
                −
              </button>

              <span className="font-semibold">{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item._id, item.quantity + 1)
                }
                className="px-3 py-1 border border-[var(--color-border)] rounded-lg"
              >
                +
              </button>
            </div>

            <div className="font-semibold text-lg">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer transition"
            >
              Remove
            </button>
          </motion.div>
        ))}

        {/* ===== Total Section ===== */}
        {cart.length > 0 && (
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center mt-10 shadow-sm">
            <h3 className="text-2xl font-semibold">
              Total:
              <span className="ml-3 text-[var(--color-primary)] font-bold">
                ${getTotal().toFixed(2)}
              </span>
            </h3>

            <button
              onClick={() =>
                navigate("/checkout", { state: { cart } })
              }
              className="mt-4 md:mt-0 px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 transition cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;