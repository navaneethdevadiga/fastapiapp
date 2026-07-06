import "./NavBar.css";

type Props = {
    onLogout?: () => void;
}

function NavBar({ onLogout }: Props) {
    return (
        <nav className="navbar">
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
                {onLogout && (
                    <li className="logout-item">
                        <button className="logout-btn" onClick={onLogout}>
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default NavBar;