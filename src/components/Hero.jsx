const Hero = () => (
  <section className="hero">
    <div className="hero-text">
      <span className="badge">✨ 2,400+ new opportunities today</span>
      <h1>Find the Right Job,<br/><span>Faster Than Ever</span></h1>
      <p>
        Join 100k+ professionals who found their dream careers through JobNest.
        We connect elite talent with the world's most innovative companies.
      </p>
      <div className="search-bar">
        <input type="text" placeholder="Job title or company" />
        <input type="text" placeholder="City or remote" />
        <button className="primary-btn">Search Jobs</button>
      </div>
      <div className="ai-badge">AI-Enhanced Job Matching</div>
    </div>
    <div className="hero-image">
      <img 
        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop" 
        alt="Modern workspace with professionals collaborating"
      />
      <div className="stats">
        👥 Active Users<br/>
        <strong>150,000+</strong>
      </div>
    </div>
  </section>
)

export default Hero
