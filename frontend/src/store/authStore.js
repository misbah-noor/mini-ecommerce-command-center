import { create } from "zustand";
import api from "../api/axios";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cartStore";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      // Login
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });

          // POST request instead of GET
          const res = await api.post("/api/login", { email, password });

          set({ user: res.data }); // save logged-in user
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false }); // always reset loading
        }
      },

      // Register
      register: async (name, email, password, role = "customer") => {
        try {
          set({ loading: true, error: null });

          const res = await api.post("/api/users", { name, email, password, role });

          set({ user: res.data });
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false });
        }
      },

      // Logout
      logout: () => {
        useCartStore.getState().clearCart();
        set({ user: null, error: null });
      },
    }),
    { name: "auth-storage" }
  )
);