import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobApplicants, setJobApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'seeker') {
            fetchMyApplications();
        } else {
            fetchMyJobs();
        }
    }, [user]);

    const fetchMyApplications = async () => {
        try {
            const res = await axios.get('/api/applications/my');
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyJobs = async () => {
        try {
            const res = await axios.get('/api/jobs/my');
            setMyJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const viewApplicants = async (jobId) => {
        setSelectedJob(jobId);
        try {
            const res = await axios.get(`/api/applications/job/${jobId}`);
            setJobApplicants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (appId, status) => {
        try {
            await axios.patch(`/api/applications/${appId}/status`, { status });
            viewApplicants(selectedJob);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        const colors = { pending: '#f59e0b', reviewed: '#3b82f6', accepted: '#10b981', rejected: '#ef4444' };
        return colors[status] || '#6b7280';
    };

    if (!user) return null;

    if (loading) {
        return (
            <div className="loading-state" style={{ padding: '6rem 5%' }}>
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {user.name}! 👋</h1>
                    <p className="dashboard-role">
                        {user.role === 'seeker' ? '🔍 Job Seeker Dashboard' : '🏢 Employer Dashboard'}
                    </p>
                </div>
                {user.role === 'employer' && (
                    <Link to="/post-job" className="primary-btn">+ Post New Job</Link>
                )}
            </div>

            {user.role === 'seeker' ? (
                <div className="dashboard-section">
                    <h2>My Applications ({applications.length})</h2>
                    {applications.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📋</span>
                            <h3>No applications yet</h3>
                            <p>Start exploring jobs and apply to get started</p>
                            <Link to="/jobs" className="primary-btn">Browse Jobs</Link>
                        </div>
                    ) : (
                        <div className="applications-grid">
                            {applications.map((app) => (
                                <div key={app.id} className="application-card">
                                    <div className="app-header">
                                        <h3>{app.job?.title || 'Job Removed'}</h3>
                                        <span
                                            className="status-badge"
                                            style={{ background: getStatusColor(app.status) }}
                                        >
                                            {app.status}
                                        </span>
                                    </div>
                                    <p>{app.job?.company} • {app.job?.location}</p>
                                    <p className="app-date">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                                    {app.job && (
                                        <Link to={`/jobs/${app.jobId}`} className="view-link">View Job →</Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="dashboard-section">
                    <h2>My Posted Jobs ({myJobs.length})</h2>
                    {myJobs.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📝</span>
                            <h3>No jobs posted yet</h3>
                            <p>Post your first job to start receiving applications</p>
                            <Link to="/post-job" className="primary-btn">Post a Job</Link>
                        </div>
                    ) : (
                        <>
                            <div className="employer-jobs-grid">
                                {myJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className={`employer-job-card ${selectedJob === job.id ? 'active' : ''}`}
                                        onClick={() => viewApplicants(job.id)}
                                    >
                                        <h3>{job.title}</h3>
                                        <p>{job.company} • {job.location}</p>
                                        <span className={`type-badge ${job.type.toLowerCase().replace('-', '')}`}>
                                            {job.type}
                                        </span>
                                        <p className="app-date">
                                            Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {selectedJob && (
                                <div className="applicants-section">
                                    <h3>Applicants ({jobApplicants.length})</h3>
                                    {jobApplicants.length === 0 ? (
                                        <p className="no-applicants">No applications received yet</p>
                                    ) : (
                                        <div className="applicants-list">
                                            {jobApplicants.map((app) => (
                                                <div key={app.id} className="applicant-card">
                                                    <div className="applicant-info">
                                                        <div className="applicant-avatar">
                                                            {app.applicant?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <h4>{app.applicant?.name || 'Unknown'}</h4>
                                                            <p>{app.applicant?.email}</p>
                                                            {app.coverLetter && (
                                                                <p className="cover-letter">"{app.coverLetter}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="applicant-actions">
                                                        <span
                                                            className="status-badge"
                                                            style={{ background: getStatusColor(app.status) }}
                                                        >
                                                            {app.status}
                                                        </span>
                                                        <div className="status-buttons">
                                                            <button
                                                                onClick={() => updateStatus(app.id, 'reviewed')}
                                                                className="status-btn reviewed"
                                                            >Review</button>
                                                            <button
                                                                onClick={() => updateStatus(app.id, 'accepted')}
                                                                className="status-btn accepted"
                                                            >Accept</button>
                                                            <button
                                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                                className="status-btn rejected"
                                                            >Reject</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
