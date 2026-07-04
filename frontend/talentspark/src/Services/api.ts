import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach the Bearer token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (config.headers && typeof config.headers === "object") {
            (config.headers as Record<string, unknown>)["Authorization"] = `Bearer ${token}`;
        } else {
            config.headers = { Authorization: `Bearer ${token}` } as any;
        }
    }
    return config;
});

export default api;
export { API_BASE_URL };