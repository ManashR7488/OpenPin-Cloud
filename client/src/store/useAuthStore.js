import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "./../config/axios.configer";

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  profile: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/api/auth/profile");
      set({ user: res.data.user, isLoading: false });
      console.log(res, user);
    } catch (err) {
      set({ user: null, token: null, isLoading: false });
      console.log(res, user);
      // toast.error("Session expired, please log in again.");
    }
  },

  login: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", formData);
      const { user } = res.data;
      set({ user, isLoading: false });
      toast.success("Login successful!");
      console.log(res, user);
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      toast.error(msg);
      console.log(res, user);
      throw new Error(msg);
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/api/auth/register", formData);
      const { user } = res.data;
      set({ user, isLoading: false });
      toast.success("Registration successful!");
      console.log(res, user);
    } catch (err) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      toast.error(msg);
      console.log(res, user);
      throw new Error(msg);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/api/auth/logout");
      set({ user: null, isLoading: false });
      toast.info("Logout Succsesfully");
      console.log(res, user);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      set({ isLoading: false });
      console.log(res, user);
      throw new Error(msg);
    }
  },
}));

export default useAuthStore;
