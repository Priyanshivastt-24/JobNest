import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`navbar ${isHome ? 'navbar-home' : 'navbar-subpage'}`}>
      <Link to="/" className="logo">
        <img src={logo} alt="JobNest Logo" className="logo-img" />
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
      <div className="mobile-toggle" id="mobile-menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Navbar
