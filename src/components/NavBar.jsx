import { NavLink, useNavigate } from 'react-router-dom'

function NavBar({ isDarkMode, toggleTheme, isLoggedIn, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <NavLink 
        to="/" 
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
        end
      >
        Home
      </NavLink>
      <NavLink 
        to="/projects" 
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
      >
        Projects
      </NavLink>
      <NavLink 
        to="/tasks" 
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
      >
        Tasks
      </NavLink>
      <NavLink 
        to="/contact" 
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
      >
        Contact
      </NavLink>

      {/* Auth link — Login or Logout based on auth state */}
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="navbar__link navbar__link--auth"
          style={{ marginLeft: 'auto', border: '1px dashed #ff5f57', color: '#ff5f57' }}
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) => `navbar__link navbar__link--auth${isActive ? ' navbar__link--active' : ''}`}
          style={{ marginLeft: 'auto', border: '1px dashed currentColor' }}
        >
          Login
        </NavLink>
      )}

      <button 
        onClick={toggleTheme}
        className="navbar__link"
        style={{ border: '1px dashed currentColor' }}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </nav>
  )
}

export default NavBar
