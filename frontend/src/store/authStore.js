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
      login: async (email, password) => {
  try {
    set({ loading: true, error: null });

    const res = await api.get("/api/users");

    const existingUser = res.data.find((u) => u.email === email);

    if (!existingUser) {
      throw new Error("User not found. Please sign up first.");
    }

    if (existingUser.password !== password) {
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


      // Register new user
      register: async (name, email, password, role = "customer") => {
  try {
    set({ loading: true, error: null });

    const newUser = await api.post("/api/users", {
      name,
      email,
      password,
      role
    });

    set({ user: newUser.data, loading: false });

    return newUser.data;

  } catch (err) {
    set({
      error: err.response?.data?.error || err.message,
      loading: false
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