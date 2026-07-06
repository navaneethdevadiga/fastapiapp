import { useState } from "react";
import { login } from "../Services/AuthService";
import "./auth.css";

type Props = {
    onLogin: () => void;
    onSwitchToRegister: () => void;
}

function Login({ onLogin, onSwitchToRegister }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login({ email, password });
            console.log("Login successful, token stored");
            onLogin(); // Token is already stored in localStorage by AuthService
        } catch (error: any) {
            console.error("Error during login:", error);
            const detail = error?.response?.data?.detail;
            setError(typeof detail === "string" ? detail : "Login failed. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <button type="button" onClick={onSwitchToRegister}>
                            Register
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;