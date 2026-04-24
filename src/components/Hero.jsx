import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTitle) params.set('search', searchTitle)
    if (searchLocation) params.set('location', searchLocation)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <section className="hero">
      <div className="hero-text">
        <span className="badge">✨ 2,400+ new opportunities today</span>
        <h1>Find the Right Job,<br/><span>Faster Than Ever</span></h1>
        <p>
          Join 100k+ professionals who found their dream careers through JobNest.
          We connect elite talent with the world's most innovative companies.
        </p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title or company"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="City or remote"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button className="primary-btn" type="submit">Search Jobs</button>
        </form>
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
}

export default Hero
