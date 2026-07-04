import type {LoginRequest,LoginResponse,RegisterRequest,RegisterResponse} from "../types/user";
import axios from "axios";
const API_URL = "http://localhost:8000/auth";

export const login = async (credentials:LoginRequest):Promise<LoginResponse>=>{
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
        username: credentials.email,
        password: credentials.password,
    });

    localStorage.setItem("token", response.data.access_token);
    return response.data;
}

export const register = async (user:RegisterRequest):Promise<RegisterResponse>=>{
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`,user);
    return response.data;
}

export const logout = () => {
    localStorage.removeItem("token");
}

export const isLoggedIn = (): boolean => {
    return localStorage.getItem("token") !== null;
}

export const getToken = (): string | null => {
    return localStorage.getItem("token");
}
