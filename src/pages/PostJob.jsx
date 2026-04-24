import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const PostJob = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'FULL-TIME',
    salaryMin: '', salaryMax: '', category: 'Engineering', description: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/jobs', {
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax)
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'employer') {
    return (
      <section className="auth-page">
        <div className="empty-state">
          <span className="empty-icon">🔒</span>
          <h3>Employer access only</h3>
          <p>You need an employer account to post jobs</p>
          <button className="primary-btn" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <div className="auth-card post-job-card">
        <div className="auth-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to attract top talent</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input id="title" name="title" placeholder="e.g. Senior React Developer" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input id="company" name="company" placeholder="e.g. Acme Corp" value={form.company} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" placeholder="e.g. Remote, New York" value={form.location} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Job Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="FULL-TIME">Full-Time</option>
                <option value="PART-TIME">Part-Time</option>
                <option value="REMOTE">Remote</option>
                <option value="CONTRACT">Contract</option>
                <option value="ON-SITE">On-Site</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">Min Salary ($)</label>
              <input id="salaryMin" name="salaryMin" type="number" placeholder="e.g. 80000" value={form.salaryMin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="salaryMax">Max Salary ($)</label>
              <input id="salaryMax" name="salaryMax" type="number" placeholder="e.g. 120000" value={form.salaryMax} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea id="description" name="description" rows="5" placeholder="Describe the role, requirements, and benefits..." value={form.description} onChange={handleChange} required />
          </div>
          <button type="submit" className="primary-btn auth-submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default PostJob
