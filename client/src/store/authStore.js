import { createStore } from "zustand/vanilla";
import axios from "axios";

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

axios.defaults.withCredentials = true;

export const authStore = createStore((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  registerCustomer: async (fName, lName, username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/auth/register/customer`, {
        fName,
        lName,
        username,
        email,
        password,
      });
      if (response.data.success)
        set({
          isCheckingAuth: false,
          isLoading: false,
        });
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "An error occured during registration",
        isLoading: false,
      });
      throw err;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${URL}/auth/login`, {
        username,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "An error occured during log in",
        isLoading: false,
      });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${URL}/auth/me`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({ isCheckingAuth: false, isAuthenticated: false });
    }
  },

  clearError: async () => set({ error: null }),
}));
