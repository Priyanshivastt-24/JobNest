import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApply, setShowApply] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`/api/jobs/${id}`);
            setJob(res.data);
        } catch {
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        setMessage('');
        try {
            await axios.post('/api/applications', { jobId: id, coverLetter });
            setApplied(true);
            setShowApply(false);
            setMessage('🎉 Application submitted successfully!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Application failed');
        } finally {
            setApplying(false);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Competitive';
        const fmt = (v) => `$${parseInt(v).toLocaleString()}`;
        if (min && max) return `${fmt(min)} – ${fmt(max)}`;
        if (min) return `From ${fmt(min)}`;
        return `Up to ${fmt(max)}`;
    };

    if (loading) {
        return (
            <div className="loading-state" style={{ padding: '6rem 5%' }}>
                <div className="spinner"></div>
                <p>Loading job details...</p>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="job-detail-page">
            <div className="job-detail-header">
                <Link to="/jobs" className="back-link">← Back to Jobs</Link>
                <div className="job-detail-title">
                    <h1>{job.title}</h1>
                    <div className="job-detail-meta">
                        <span className="company-name">🏢 {job.company}</span>
                        <span className="location-name">📍 {job.location}</span>
                        <span className={`type-badge ${job.type.toLowerCase().replace('-', '')}`}>
                            {job.type}
                        </span>
                    </div>
                    <div className="job-detail-salary">
                        💰 {formatSalary(job.salaryMin, job.salaryMax)}
                    </div>
                    <div className="job-detail-date">
                        Posted {new Date(job.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {message && (
                <div className={`detail-message ${applied ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="job-detail-body">
                <div className="job-detail-description">
                    <h2>About This Role</h2>
                    <p>{job.description}</p>
                    <div className="job-detail-tags">
                        <span className="detail-tag">📂 {job.category}</span>
                    </div>
                </div>

                <div className="job-detail-actions">
                    {!user ? (
                        <div className="apply-box">
                            <h3>Interested in this role?</h3>
                            <p>Sign in to apply for this position</p>
                            <Link to="/login" className="primary-btn">Sign In to Apply</Link>
                        </div>
                    ) : user.role === 'employer' ? (
                        <div className="apply-box">
                            <h3>Employer Account</h3>
                            <p>Switch to a seeker account to apply for jobs</p>
                        </div>
                    ) : applied ? (
                        <div className="apply-box applied">
                            <h3>✅ Application Sent</h3>
                            <p>Your application has been submitted. Good luck!</p>
                            <Link to="/dashboard" className="primary-btn">View My Applications</Link>
                        </div>
                    ) : showApply ? (
                        <form className="apply-form" onSubmit={handleApply}>
                            <h3>Apply for this Position</h3>
                            <div className="form-group">
                                <label>Cover Letter (optional)</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Tell the employer why you're a great fit..."
                                    rows={6}
                                />
                            </div>
                            <button type="submit" className="auth-btn" disabled={applying}>
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setShowApply(false)}>
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <div className="apply-box">
                            <h3>Ready to apply?</h3>
                            <p>Take the next step in your career</p>
                            <button onClick={() => setShowApply(true)} className="primary-btn">
                                Apply Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
