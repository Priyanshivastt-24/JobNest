import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs')
        setJobs(res.data.slice(0, 3))
      } catch {
        setJobs([])
      }
    }
    fetchJobs()
  }, [])

  return (
    <section className="jobs">
      <div className="section-header">
        <h2>Featured Opportunities</h2>
        <Link to="/jobs">Browse All →</Link>
      </div>
      <div className="job-grid">
        {jobs.length > 0 ? jobs.map(job => (
          <div className="job-card" key={job._id}>
            <h3>{job.title}</h3>
            <p>{job.company} • {job.location}</p>
            <span className="tag">{job.type}</span>
            <span className="salary">
              ${Math.round(job.salaryMin / 1000)}k – ${Math.round(job.salaryMax / 1000)}k
            </span>
            <Link to={`/jobs/${job._id}`}><button>Apply Now</button></Link>
          </div>
        )) : (
          <>
            <div className="job-card">
              <h3>Staff Data Engineer</h3>
              <p>Quant Analytics • Palo Alto, CA</p>
              <span className="tag">FULL-TIME</span>
              <span className="salary">$180k – $240k</span>
              <Link to="/jobs"><button>View Jobs</button></Link>
            </div>
            <div className="job-card">
              <h3>Senior Fintech Architect</h3>
              <p>Silverline Global • Remote</p>
              <span className="tag">REMOTE</span>
              <span className="salary">$160k – $210k</span>
              <Link to="/jobs"><button>View Jobs</button></Link>
            </div>
            <div className="job-card">
              <h3>Head of Cyber Security</h3>
              <p>DefendCore • New York, NY</p>
              <span className="tag">ON-SITE</span>
              <span className="salary">$220k – $300k</span>
              <Link to="/jobs"><button>View Jobs</button></Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default FeaturedJobs
