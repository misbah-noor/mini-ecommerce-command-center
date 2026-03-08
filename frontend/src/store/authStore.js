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

      // Login / auto-create user
      login: async (name, email, password, role = "customer") => {
        try {
          set({ loading: true, error: null });

          // Fetch all users
          const res = await api.get("/api/users");
          let existingUser = res.data.find((u) => u.email === email);

          // Admin check
          if (role === "admin" && email !== "misbah@admin.com") {
            throw new Error("Invalid admin credentials");
          }

          if (!existingUser) {
            // Create new user (customer)
            const newUser = await api.post("/api/users", {
              name,
              email,
              password,
              role: role === "admin" ? "admin" : "customer",
            });
            existingUser = newUser.data;
          } else if (existingUser.password !== password) {
            throw new Error("Invalid password");
          }

          set({ user: existingUser, loading: false });

          return existingUser;

        } catch (err) {
          set({
            error: err.response?.data?.error || err.message,
            loading: false,
          });
        }
      },

      // Logout
      logout: () => {
        useCartStore.getState().clearCart();
        set({ user: null, error: null });
      },
    }),
    { name: "auth-storage" } // persist auth info
  )
);