import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Finance'];
const TYPES = ['Full-time', 'Remote', 'Contract', 'Part-time'];

export default function PostJob() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', company: '', location: '', type: 'Full-time',
        salaryMin: '', salaryMax: '', description: '', category: 'Engineering',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user || user.role !== 'employer') {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1>Employer Access Only</h1>
                        <p>You need an employer account to post jobs</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('/api/jobs', form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-page">
            <div className="post-job-container">
                <div className="auth-header">
                    <h1>Post a New Job</h1>
                    <p>Find the perfect candidate for your team</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="post-job-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Job Title *</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required />
                        </div>
                        <div className="form-group">
                            <label>Company *</label>
                            <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. TechCorp" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Location *</label>
                            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. San Francisco, CA or Remote" required />
                        </div>
                        <div className="form-group">
                            <label>Job Type</label>
                            <select name="type" value={form.type} onChange={handleChange}>
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Min Salary (USD/year)</label>
                            <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} placeholder="e.g. 120000" />
                        </div>
                        <div className="form-group">
                            <label>Max Salary (USD/year)</label>
                            <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} placeholder="e.g. 180000" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Job Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, requirements..." rows={8} required />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Posting...' : 'Publish Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}
