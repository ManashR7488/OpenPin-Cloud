import axios from "axios";

const axiosInstance = axios.create({
   baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://openpin-cloud-backend.vercel.app",
    withCredentials: true,
});

export default axiosInstance