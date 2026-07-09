import type {LoginRequest,LoginResponse,RegisterRequest,RegisterResponse} from "../types/user";
import axios from "axios";
const API_URL = "http://localhost:8000/auth";

export const login = async (credentials:LoginRequest):Promise<LoginResponse>=>{
    const params = new URLSearchParams();
    params.append("username", credentials.email);
    params.append("password", credentials.password);

    const response = await axios.post<LoginResponse>(`${API_URL}/login`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("token", response.data.access_token);
    return response.data;
}

export const register = async (user:RegisterRequest):Promise<LoginResponse>=>{
    await axios.post<RegisterResponse>(`${API_URL}/register`, user);
    return await login({ email: user.email, password: user.password });
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
