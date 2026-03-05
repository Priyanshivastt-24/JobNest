import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">💼</span>
        <span>JobNest</span>
      </Link>
      <nav>
        <Link to="/jobs">Jobs</Link>
        <Link to="/jobs?category=Engineering">Engineering</Link>
        <Link to="/jobs?category=Design">Design</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
            {user.role === 'employer' && (
              <Link to="/post-job" className="primary-btn">Post a Job</Link>
            )}
            <button onClick={logout} className="signin logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="signin">Sign In</Link>
            <Link to="/register" className="primary-btn">Get Started</Link>
          </>
        )}
      </div>
      <div className="mobile-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Navbar
