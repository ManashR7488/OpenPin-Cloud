import { create } from "zustand";
import axiosInstance from "../config/axios.configer";
import { toast } from "react-toastify";

const useDataStore = create((set, get) => ({
  projects: [],
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/api/projects");
      const { projects } = res.data;
      set({ projects, isLoading: false });
      console.log(get().projects);
    } catch (error) {
      set({ isLoading: false });
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    //   console.log(msg, error);
    }
  },

  addProject: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/api/projects/create", formData);
      const { project } = res.data;
      set((state) => ({
        projects: [...state.projects, project],
        isLoading: false,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      set({ isLoading: false });
    //   console.log(msg, err);
      throw new Error(msg);
    }
  },

  updateProject: async (formData, id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/api/projects/${id}`, formData);
      //   console.log(res)
      const { project } = res.data;
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === project._id ? project : p
        ),
        isLoading: false,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      set({ isLoading: false });
    //   console.log(msg, err);
      throw new Error(msg);
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/api/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        isLoading: false,
      }));
      toast.info("Project deleted.");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      set({ isLoading: false });
    //   console.log(msg, err);
      throw new Error(msg);
    }
  }
}));

export default useDataStore;
