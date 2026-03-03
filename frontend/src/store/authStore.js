// store/authStore.js
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

      // Login / create user
     login: async (name, role) => {
  try {
    set({ loading: true, error: null });

    const res = await api.get("/api/users");

    if(role === "admin" && name!== "Misbah"){
      throw new Error("Invalid admin credentials");
    }


    let existingUser = res.data.find(
      (u) => u.name === name && u.role === role
    );

    if (!existingUser) {
      const newUser = await api.post("/api/users", { name, role });
      existingUser = newUser.data.user;
    }

    set({ user: existingUser, loading: false });

  } catch (err) {
    set({
      error: err.response?.data?.error || err.message,
      loading: false,
    });
  }
},

      // Logout
      logout: () => {
        // Clear cart
        useCartStore.getState().clearCart();
        // Remove user
        set({ user: null, error: null });
      },
    }),
    { name: "auth-storage" } // persist auth info
  )
);          