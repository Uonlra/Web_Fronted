import { Link, NavLink } from 'react-router-dom'
import '../css/Navbar.css'

const getNavLinkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-link" aria-label="u's cinema home">
                    <span className="brand-mark" aria-hidden="true">◎</span>
                    <span className="brand-name">u's cinema</span>
                </Link>
            </div>

            <div className="navbar-links">
                <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
                <NavLink to="/movies" className={getNavLinkClass}>Movies</NavLink>
                <NavLink to="/favorites" className={getNavLinkClass}>Favorites</NavLink>
                <NavLink to="/watchlist" className={getNavLinkClass}>Watchlist</NavLink>
            </div>

            <form className="nav-search" role="search" onSubmit={(event) => event.preventDefault()}>
                <span className="nav-search-icon" aria-hidden="true">⌕</span>
                <input type="search" placeholder="Search movies, shows..." aria-label="Search movies" />
                <span className="nav-search-key" aria-hidden="true">⌘ K</span>
            </form>

            <div className="navbar-actions" aria-label="User actions">
                <button className="notification-button" type="button" aria-label="Notifications">
                    <span aria-hidden="true">♧</span>
                </button>
                <div className="user-chip">
                    <span className="user-avatar" aria-hidden="true">un</span>
                    <span className="user-name">Uonlra</span>
                    <span className="user-chevron" aria-hidden="true">⌄</span>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
