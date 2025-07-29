// client/src/store/useLiveStore.js
import { io } from "socket.io-client";
import { create } from "zustand";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://openpin-cloud-backend.vercel.app";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  path: "/api/socket.io",
  transports: ["websocket"],
});

// Debug logging
socket.on("connect", () => console.log("✅ WS connected", socket.id));
socket.on("connect_error", (err) =>
  console.error("❌ WS connection error", err)
);
socket.on("disconnect", (reason) => console.warn("⚠️ WS disconnected", reason));

const useLiveStore = create((set, get) => ({
  liveData: {},
  isOnline: false,
  connect: (secret) => {
    if (socket.connected) {
      socket.emit("register", { secret });
      return;
    }
    socket.on("deviceStatus", ({ secret, status }) => {
      console.log(`Device ${secret} status: ${status}`);
      if (status === "online") {
        set({ isOnline: true });
      } else {
        set({ isOnline: false });
      }
      // console.log(`Device ${secret} status: ${status}`);
    });
    // Subscribe to data
    socket.on("dataUpdate", ({ data }) => {
      set({ liveData: data });
    });
    socket.on("featureUpdate", ({ key, value }) => {
      set((state) => ({ liveData: { ...state.liveData, [key]: value } }));
    });

    // Connect and register
    socket.connect();
    socket.emit("register", { secret });
  },
  disconnect: () => {
    socket.disconnect();
    set({ liveData: {} });
  },
  sendControl: (secret, key, value) => {
    socket.emit("control", { secret, key, value });
    // optimistic UI update
    set((state) => ({ liveData: { ...state.liveData, [key]: value } }));
  },
}));

export default useLiveStore;
