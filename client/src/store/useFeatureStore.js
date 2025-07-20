import {create} from 'zustand';
import axios from '../config/axios.configer';

const useFeatureStore = create((set, get) => ({
  currentDevice: null,
  features: [],
  loading: false,
  error: null,

  // Fetch device by IDs
  fetchDevice: async (projectId, deviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(
        `/api/projects/${projectId}/devices/${deviceId}`
      );
      set({ currentDevice: res.data.device, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch features
  fetchFeatures: async (projectId, deviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(
        `/api/projects/${projectId}/devices/${deviceId}/features`
      );
      set({ features: res.data.features, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Create feature
  addFeature: async (projectId, deviceId, featureData) => {
    set({ loading: true });
    try {
      const res = await axios.post(
        `/api/projects/${projectId}/devices/${deviceId}/features/create`,
        featureData
      );
      set((state) => ({
        features: [...state.features, res.data.feature],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Update feature
  updateFeature: async (projectId, deviceId, id, featureData) => {
    set({ loading: true });
    try {
      const res = await axios.patch(
        `/api/projects/${projectId}/devices/${deviceId}/features/${id}`,
        featureData
      );
      set((state) => ({
        features: state.features.map((f) =>
          f._id === id ? res.data.feature : f
        ), loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Delete feature
  deleteFeature: async (projectId, deviceId, id) => {
    set({ loading: true });
    try {
      await axios.delete(
        `/api/projects/${projectId}/devices/${deviceId}/features/${id}`
      );
      set((state) => ({
        features: state.features.filter((f) => f._id !== id), loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Local update of feature value
  setFeatureValue: (key, value) => {
    set((state) => ({
      features: state.features.map((f) =>
        f.key === key ? { ...f, value } : f
      ),
    }));
  },
}));



export default useFeatureStore;