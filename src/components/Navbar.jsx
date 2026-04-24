import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">💼</span>
        <span>JobNest</span>
      </Link>
      <nav>
        <Link to="/jobs">Jobs</Link>
        <Link to="/#companies">Companies</Link>
        <Link to="/#about">About</Link>
        <Link to="/#contact">Contact</Link>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="signin">👤 {user.name}</Link>
            <button className="primary-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="signin">Sign In</Link>
            <Link to="/register">
              <button className="primary-btn">Get Started</button>
            </Link>
          </>
        )}
      </div>
      <div className="mobile-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  )
}

export default Navbar
