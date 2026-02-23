const Navbar = () => (
  <header className="navbar">
    <div className="logo">
      <span className="logo-icon">💼</span>
      <span>JobNest</span>
    </div>
    <nav>
      <a href="#">Jobs</a>
      <a href="#">Companies</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
    <div className="nav-actions">
      <a href="#" className="signin">Sign In</a>
      <button className="primary-btn">Post a Job</button>
    </div>
    <div className="mobile-toggle">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </header>
)

export default Navbar
