import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/jobs/featured')
      .then(res => setJobs(res.data.slice(0, 6)))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    const fmt = (v) => `$${(parseInt(v) / 1000).toFixed(0)}k`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const typeClass = (type) => {
    if (!type) return 'fulltime';
    const t = type.toLowerCase().replace(/[^a-z]/g, '');
    if (t.includes('remote')) return 'remote';
    if (t.includes('contract')) return 'contract';
    if (t.includes('part')) return 'parttime';
    return 'fulltime';
  };

  const typeLabel = (type) => {
    if (!type) return 'Full Time';
    return type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return (
      <section className="jobs">
        <div className="section-header-centered">
          <h2>Recent Job Circulars</h2>
          <p className="subtitle">Explore the newest job openings from verified employers</p>
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
        <div>
          <span className="section-label">LATEST OPENINGS</span>
          <h2>Recent Job Circulars</h2>
        </div>
        <Link to="/jobs" className="view-all-link">
          View All Jobs
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
      <div className="job-grid">
        {jobs.map((job) => (
          <div className="job-card-finate" key={job.id}>
            <div className="company-info-block">
              <div className="company-logo-avatar">
                {job.company?.charAt(0) || 'C'}
              </div>
              <div className="company-details">
                <span className="company-name-text">{job.company}</span>
                <span className="location-text">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {job.location}
                </span>
              </div>
            </div>
            <h3 className="job-title-text">{job.title}</h3>
            <div className="job-tags-row">
              <span className={`job-tag-type ${typeClass(job.type)}`}>
                {typeLabel(job.type)}
              </span>
              <span className="job-category-tag">{job.category}</span>
            </div>
            <p className="job-desc-preview">{job.description?.slice(0, 110)}...</p>
            <div className="job-footer-block">
              <div className="salary-block">
                <span className="salary-amt">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                <span className="salary-period">/ year</span>
              </div>
              <Link to={`/jobs/${job.id}`} className="apply-btn-finate">
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="browse-all-container">
        <Link to="/jobs" className="primary-btn browse-all-btn">Browse All Jobs</Link>
      </div>
    </section>
  );
}

export default FeaturedJobs
