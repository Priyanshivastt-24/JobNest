import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`)
        setJob(res.data)
      } catch (err) {
        console.error('Failed to fetch job:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'seeker') {
      setMessage('Only job seekers can apply to jobs')
      return
    }

    setApplying(true)
    try {
      await api.post('/applications', { jobId: id })
      setApplied(true)
      setMessage('Application submitted successfully! ✅')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <section className="job-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="job-detail-page">
        <div className="empty-state">
          <span className="empty-icon">😕</span>
          <h3>Job not found</h3>
          <Link to="/jobs"><button className="primary-btn">Browse Jobs</button></Link>
        </div>
      </section>
    )
  }

  return (
    <section className="job-detail-page">
      <Link to="/jobs" className="back-link">← Back to Jobs</Link>

      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <h1>{job.title}</h1>
            <p className="job-detail-company">{job.company} • {job.location}</p>
          </div>
          <div className="job-detail-salary">
            ${Math.round(job.salaryMin / 1000)}k – ${Math.round(job.salaryMax / 1000)}k
          </div>
        </div>

        <div className="job-detail-tags">
          <span className="tag">{job.type}</span>
          <span className="tag">{job.category}</span>
        </div>

        <div className="job-detail-body">
          <h3>About This Role</h3>
          <p>{job.description}</p>

          {job.postedBy && (
            <div className="job-posted-by">
              <span>Posted by: {job.postedBy.name}</span>
              <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {message && (
          <div className={`alert ${applied ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="job-detail-actions">
          {applied ? (
            <button className="primary-btn" disabled>✅ Applied</button>
          ) : (
            <button
              className="primary-btn"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default JobDetail
