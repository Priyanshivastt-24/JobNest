import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <span className="badge">✨ 2,400+ new opportunities today</span>
        <h1>Find the Right Job,<br /><span>Faster Than Ever</span></h1>
        <p>
          Join 100k+ professionals who found their dream careers through JobNest.
          We connect elite talent with the world's most innovative companies.
        </p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="City or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" className="primary-btn">Search Jobs</button>
        </form>
        <div className="ai-badge">AI-Enhanced Job Matching</div>
      </div>
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop"
          alt="Modern workspace with professionals collaborating"
        />
        <div className="stats">
          👥 Active Users<br />
          <strong>150,000+</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero
