import { useState } from 'react';
import "./welcome.css";

function Welcome() {
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(count + 1);
    }
    return (
        <div className="welcome-container">
            <h1 className="welcome-title">Welcome to Talentspark</h1>
            <p className="welcome-subtitle">Your career journey starts here</p>
            <div className="counter-wrapper">
                <span className="counter">{count}</span>
                <button className="counter-btn" onClick={increment}>
                    Increment
                </button>
            </div>
        </div>
    )
}

export default Welcome;