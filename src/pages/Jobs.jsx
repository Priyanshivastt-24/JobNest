import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTitle, setSearchTitle] = useState(searchParams.get('search') || '')
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '')
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '')
  const [filterType, setFilterType] = useState(searchParams.get('type') || '')

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchTitle) params.search = searchTitle
      if (searchLocation) params.location = searchLocation
      if (filterCategory) params.category = filterCategory
      if (filterType) params.type = filterType

      const res = await api.get('/jobs', { params })
      setJobs(res.data)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (searchTitle) params.search = searchTitle
    if (searchLocation) params.location = searchLocation
    if (filterCategory) params.category = filterCategory
    if (filterType) params.type = filterType
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchTitle('')
    setSearchLocation('')
    setFilterCategory('')
    setFilterType('')
    setSearchParams({})
  }

  return (
    <section className="jobs-page">
      <div className="jobs-page-header">
        <h1>Find Your Next Opportunity</h1>
        <p>Browse {jobs.length} jobs from top companies worldwide</p>
      </div>

      <form className="jobs-search-form" onSubmit={handleSearch}>
        <div className="search-bar">
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
          <button className="primary-btn" type="submit">Search</button>
        </div>

        <div className="filters-row">
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value)
              const params = Object.fromEntries(searchParams)
              if (e.target.value) params.category = e.target.value
              else delete params.category
              setSearchParams(params)
            }}
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value)
              const params = Object.fromEntries(searchParams)
              if (e.target.value) params.type = e.target.value
              else delete params.type
              setSearchParams(params)
            }}
          >
            <option value="">All Types</option>
            <option value="FULL-TIME">Full-Time</option>
            <option value="PART-TIME">Part-Time</option>
            <option value="REMOTE">Remote</option>
            <option value="CONTRACT">Contract</option>
            <option value="ON-SITE">On-Site</option>
          </select>

          {(searchTitle || searchLocation || filterCategory || filterType) && (
            <button type="button" className="clear-btn" onClick={clearFilters}>
              Clear Filters ✕
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
          <button className="primary-btn" onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.company} • {job.location}</p>
              <div className="job-card-tags">
                <span className="tag">{job.type}</span>
                <span className="salary">
                  ${Math.round(job.salaryMin / 1000)}k – ${Math.round(job.salaryMax / 1000)}k
                </span>
              </div>
              <Link to={`/jobs/${job._id}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Jobs
