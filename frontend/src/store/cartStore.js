import { create } from "zustand";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

export const useCartStore = create((set, get) => ({
  cart: [],

  // Fetch orders for the logged-in user
 fetchCart: async () => {
  const user = useAuthStore.getState().user;
  if (!user?._id) return;

  try {
    const res = await api.get(
      `/api/orders/user-orders?userId=${user._id}`
    );
    set({ cart: res.data });
  } catch (err) {
    console.log("Fetch cart error:", err);
  }
},

  // Add product to cart
addToCart: async (product, quantity = 1) => {
  const authState = useAuthStore.getState();
  const user = authState.user;

  if (!user || !user._id) return;

  try {
    await api.post("/api/orders", {
      user: user._id,
      product: product._id,
      quantity,
    });

    // IMPORTANT LINE
    await get().fetchCart();

  } catch (err) {
    console.log("Add to cart error:", err.response?.data || err.message);
  }
},


  // Remove an order from cart
  removeFromCart: async (orderId) => {
    try {
      await api.delete(`/api/orders/${orderId}`);
      set((state) => ({
        cart: state.cart.filter((item) => item._id !== orderId),
      }));
    } catch (err) {
      console.log("Remove error:", err);
    }
  },

  // Update quantity of an order
  updateQuantity: async (orderId, quantity) => {
    try {
      await api.put(`/api/orders/${orderId}`, { quantity });
      set((state) => ({
        cart: state.cart.map((item) =>
          item._id === orderId ? { ...item, quantity } : item
        ),
      }));
    } catch (err) {
      console.log("Update error:", err);
    }
  },

  // Clear cart (on logout)
  clearCart: () => set({ cart: [] }),

  // Compute total price
  getTotal: () => {
    const cart = get().cart;
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },
}));