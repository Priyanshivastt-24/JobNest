import logo from '../assets/logo.png'

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="JobNest Logo" className="logo-img" />
          </div>
          <p>Empowering careers through cutting-edge technology and intelligent job matching. Your next great opportunity starts here.</p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4>For Job Seekers</h4>
          <a href="#">Find Jobs</a>
          <a href="#">Browse Categories</a>
          <a href="#">Salary Guide</a>
          <a href="#">Career Advice</a>
        </div>
        <div>
          <h4>For Employers</h4>
          <a href="#">Post a Job</a>
          <a href="#">Browse Candidates</a>
          <a href="#">Pricing Plans</a>
          <a href="#">Recruitment Solutions</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Our Partners</a>
          <a href="#">Press &amp; Media</a>
          <a href="#">Contact</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">© 2025 JobNest Inc. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
