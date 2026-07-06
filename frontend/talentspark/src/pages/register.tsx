import { useState } from "react";
import { register } from "../Services/AuthService";
import "./auth.css";

type Props = {
    onRegister: () => void;
    onSwitchToLogin: () => void;
}

function Register({ onRegister, onSwitchToLogin }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await register({ name, email, password, role });
            console.log("Registration successful!");
            onRegister();
        } catch (error: any) {
            console.error("Error during registration:", error);
            setError(error.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join Talentspark today</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                    />
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
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role (e.g., user, admin)"
                        required
                    />
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? "Registering..." : "Register"}
                    </button>
                    <p className="auth-switch">
                        Already have an account?{" "}
                        <button type="button" onClick={onSwitchToLogin}>
                            Login
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register;