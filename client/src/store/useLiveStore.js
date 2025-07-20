import { io } from 'socket.io-client';
import {create} from 'zustand';

const SOCKET_URL = (await import.meta.env.MODE) === "development"
    ? "http://localhost:5000"
    : "https://openpin-cloud-backend.vercel.app";

const useLiveStore = create((set, get) => ({
  socket: null,
  liveData: {},    // entire device data map

  connect: (secret) => {
    if (get().socket) return;
    const socket = io(SOCKET_URL, { autoConnect: false });
    // console.log(socket)
    socket.connect(() => console.log('WS connected'));
    socket.emit('register', { secret });

    // replace per-feature update with full data sync
    socket.on('dataUpdate', ({ data }) => {
      set({ liveData: data });
      // console.log(get().liveData)
    });

    // also keep backward compatibility for featureUpdate
    // socket.on('featureUpdate', ({ key, value }) => {
    //   set((state) => ({
    //     liveData: { ...state.liveData, [key]: value },
    //   }));
    // });

    socket.on('disconnect', () => {
      set({ socket: null });
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, liveData: {} });
  },

  sendControl: (secret, key, value) => {
    get().socket?.emit('control', { secret, key, value });
    // optimistic UI update
    set((state) => ({ liveData: { ...state.liveData, [key]: value } }));
  },
}));




export default useLiveStore;
