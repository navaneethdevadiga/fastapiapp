import {useState} from "react";
import {register} from "../Services/AuthService";

type Props = {
    onRegister: () => void;
    onSwitchToLogin: () => void;
}

function Register({onRegister, onSwitchToLogin}: Props){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await register({name,email,password,role});
            console.log("Registration successful!");
            onRegister();
        } catch (error: any) {
            console.error("Error during registration:", error);
            setError(error.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    }   
    return(
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" required/>
            <br />
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/>
            <br />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required/>
            <br />
            <input type="text" value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Role" required/>
            <br />
            <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            <p>Already have an account? <button type="button" onClick={onSwitchToLogin}>Login</button></p>
        </form>
    )
}

export default Register;