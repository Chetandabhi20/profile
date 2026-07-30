import { NavLink } from 'react-router-dom'

function NavBar({ isDarkMode, toggleTheme }) {
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
        to="/contact" 
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
      >
        Contact
      </NavLink>
      
      <button 
        onClick={toggleTheme}
        className="navbar__link"
        style={{ marginLeft: 'auto', border: '1px dashed currentColor' }}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </nav>
  )
}

export default NavBar
