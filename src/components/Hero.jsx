import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="hero-wrapper">
      <section className="hero">
        <div className="hero-text">
          <span className="badge">2,568 Job Available</span>
          <h1>You Can Choose Your<br /><span>Dream Job</span></h1>
          <p>
            Find great jobs to build your bright career. We have thousands of jobs in
            this platform. Connect with elite teams and industry leaders.
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-input-group">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Job title or keywords"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="search-input-group">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text"
                placeholder="Choose City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose Category</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
            <button type="submit" className="primary-btn">Find Jobs</button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>1.5M+</strong>
              <span>Jobs Posted</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <strong>150K+</strong>
              <span>Active Users</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <strong>98%</strong>
              <span>Success Rate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero
