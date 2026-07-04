import {useState} from "react";
import {login} from "../Services/AuthService";

type Props = {
    onLogin: () => void;
    onSwitchToRegister: () => void;
}

function Login({onLogin, onSwitchToRegister}: Props){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login({email,password});
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
    return(
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/>
            <br />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required/>
            <br />
            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            <p>Don't have an account? <button type="button" onClick={onSwitchToRegister}>Register</button></p>
        </form>
    )
}

export default Login;