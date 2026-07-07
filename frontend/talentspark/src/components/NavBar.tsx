import "./NavBar.css";

type Props = {
    onLogout?: () => void;
}

function NavBar({ onLogout }: Props) {
    return (
        <nav className="navbar">
            <a href="#" className="navbar-brand">
                <div className="navbar-logo">TS</div>
                <span>TalentSpark</span>
            </a>
            <ul className="navbar-nav">
                <li className="nav-item active">Home</li>
                <li className="nav-item">About</li>
                <li className="nav-item">Contact</li>
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