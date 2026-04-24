import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchData = async () => {
      try {
        if (user.role === 'seeker') {
          const res = await api.get('/applications/my')
          setData(res.data)
        } else {
          const res = await api.get('/jobs')
          setData(res.data.filter(j => j.postedBy?._id === user.id || j.postedBy === user.id))
        }
      } catch (err) { console.error('Dashboard fetch error:', err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [user, navigate])

  const handleLogout = () => { logout(); navigate('/') }

  const statusColor = { pending: '#f59e0b', reviewed: '#3b82f6', accepted: '#10b981', rejected: '#ef4444' }

  if (!user) return null

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}! 👋</h1>
          <p className="dashboard-role">{user.role === 'seeker' ? '🔍 Job Seeker' : '🏢 Employer'} • {user.email}</p>
        </div>
        <div className="dashboard-actions">
          {user.role === 'employer' && <Link to="/post-job"><button className="primary-btn">+ Post New Job</button></Link>}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading...</p></div>
      ) : user.role === 'seeker' ? (
        <div className="dashboard-section">
          <h2>My Applications ({data.length})</h2>
          {data.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📋</span><h3>No applications yet</h3><Link to="/jobs"><button className="primary-btn">Browse Jobs</button></Link></div>
          ) : (
            <div className="applications-list">
              {data.map(app => (
                <div key={app._id} className="application-card">
                  <div className="application-info">
                    <h3>{app.job?.title || 'Job removed'}</h3>
                    <p>{app.job?.company} • {app.job?.location}</p>
                    <span className="application-date">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="status-badge" style={{ backgroundColor: statusColor[app.status] || '#64748b' }}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard-section">
          <h2>My Posted Jobs ({data.length})</h2>
          {data.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">💼</span><h3>No jobs posted</h3><Link to="/post-job"><button className="primary-btn">Post a Job</button></Link></div>
          ) : (
            <div className="job-grid">
              {data.map(job => (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.company} • {job.location}</p>
                  <span className="tag">{job.type}</span>
                  <span className="salary">${Math.round(job.salaryMin/1000)}k – ${Math.round(job.salaryMax/1000)}k</span>
                  <Link to={`/jobs/${job._id}`}><button>View Details</button></Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default Dashboard
