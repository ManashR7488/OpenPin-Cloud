import { create } from "zustand";
import axiosInstance from "../config/axios.configer";
import { toast } from "react-toastify";

const useDataStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  devices: [],
  currentProject: {},
  isFetching: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/api/projects");
      set({ projects: res.data.projects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    }
  },

  addProject: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/api/projects/create", formData);
      set((state) => ({
        projects: [...state.projects, res.data.project],
        isLoading: false,
      }));
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      set({ isLoading: false });
      throw new Error(msg);
    }
  },

  updateProject: async (formData, id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/api/projects/${id}`, formData);
      const { project } = res.data;
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? project : p)),
        isLoading: false,
      }));
      toast.success("Project updated.");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      set({ isLoading: false });
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
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      set({ isLoading: false });
      throw new Error(msg);
    }
  },

  fetchOneProject: async (id) => {
    try {
      const res = await axiosInstance.get(`/api/projects/${id}`);
      const { project } = await res.data;
      set({
        currentProject: project,
        devices: project.devices || [],
      });
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      //
    }
  },
  fetchDevice: async () => {},

  addDevice: async (formData) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.post(
        `/api/projects/${get().currentProject._id}/devices/create`,
        formData
      );
      const { device } = await res.data;
      set((state) => ({
        devices: [...state.devices, device],
        isFetching: false,
      }));
      toast.success("Device created");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ isFetching: false });
    }
  },
  updateDevice: async (formData, id) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.patch(
        `/api/projects/${get().currentProject._id}/devices/${id}`,
        formData
      );
      const { device } = await res.data;
      set((state) => ({
        devices: state.devices.map((p) => (p._id === id ? device : p)),
        isFetching: false,
      }));
      toast.success("Device updated");
    } catch {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      set({ isFetching: false });
      throw new Error(msg);
    } finally {
      set({ isFetching: false });
    }
  },
  deleteDevice: async (id) => {
    try {
      await axiosInstance.delete(
        `/api/projects/${get().currentProject._id}/devices/${id}`
      );
      set((state) => ({
        devices: state.devices.filter((p) => p._id !== id),
        isFetching: false,
      }));
      toast.info("Device deleted");
    } catch {
      toast.error("Failed to delete device");
    } finally {
      set({ isFetching: false });
    }
  },
}));

export default useDataStore;
