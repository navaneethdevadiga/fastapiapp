type Props = {
    onLogout?: () => void;
}

function NavBar({onLogout}: Props){
    return(
        <nav>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
                {onLogout && <li style={{float: 'right'}}><button onClick={onLogout} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>Logout</button></li>}
            </ul>
        </nav>
    )
}

export default NavBar