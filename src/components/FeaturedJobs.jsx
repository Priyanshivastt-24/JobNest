import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/jobs/featured')
      .then(res => setJobs(res.data.slice(0, 3)))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const formatSalary = (min, max) => {
    if (!min && !max) return '';
    const fmt = (v) => `$${(parseInt(v) / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const getTypeLabel = (type) => {
    return type?.toUpperCase().replace('-', '-') || 'FULL-TIME';
  };

  if (loading) {
    return (
      <section className="jobs">
        <div className="section-header">
          <h2>Featured Opportunities</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="jobs">
      <div className="section-header">
        <h2>Featured Opportunities</h2>
        <Link to="/jobs">Browse All →</Link>
      </div>
      <div className="job-grid">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company} • {job.location}</p>
            <span className="tag">{getTypeLabel(job.type)}</span>
            {formatSalary(job.salaryMin, job.salaryMax) && (
              <span className="salary">{formatSalary(job.salaryMin, job.salaryMax)}</span>
            )}
            <Link to={`/jobs/${job.id}`}>
              <button>Apply Now</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs
