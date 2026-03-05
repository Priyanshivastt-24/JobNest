import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Finance'];
const TYPES = ['Full-time', 'Remote', 'Contract'];

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [type, setType] = useState(searchParams.get('type') || '');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [searchParams]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchParams.get('q')) params.search = searchParams.get('q');
            if (searchParams.get('location')) params.location = searchParams.get('location');
            if (searchParams.get('category')) params.category = searchParams.get('category');
            if (searchParams.get('type')) params.type = searchParams.get('type');
            const res = await axios.get('/api/jobs', { params });
            setJobs(res.data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (location) params.set('location', location);
        if (category) params.set('category', category);
        if (type) params.set('type', type);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearch('');
        setLocation('');
        setCategory('');
        setType('');
        setSearchParams({});
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return '';
        const fmt = (v) => `$${(parseInt(v) / 1000).toFixed(0)}k`;
        if (min && max) return `${fmt(min)} – ${fmt(max)}`;
        if (min) return `From ${fmt(min)}`;
        return `Up to ${fmt(max)}`;
    };

    return (
        <div className="jobs-page">
            <div className="jobs-hero">
                <h1>Find Your Dream Job</h1>
                <p>Browse {jobs.length} opportunities from top companies worldwide</p>
            </div>

            <div className="jobs-content">
                <aside className="jobs-sidebar">
                    <form onSubmit={handleSearch}>
                        <h3>🔍 Search & Filter</h3>
                        <div className="filter-group">
                            <label>Keywords</label>
                            <input
                                type="text"
                                placeholder="Job title or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="City or remote..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Job Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="">All Types</option>
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="filter-btn">Apply Filters</button>
                        <button type="button" className="clear-btn" onClick={clearFilters}>Clear All</button>
                    </form>
                </aside>

                <main className="jobs-list">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading opportunities...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🔍</span>
                            <h3>No jobs found</h3>
                            <p>Try adjusting your search or filters</p>
                            <button onClick={clearFilters} className="primary-btn">Clear Filters</button>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <Link to={`/jobs/${job.id}`} key={job.id} className="job-list-card">
                                <div className="job-list-header">
                                    <div>
                                        <h3>{job.title}</h3>
                                        <p className="job-company">{job.company} • {job.location}</p>
                                    </div>
                                    <span className={`type-badge ${job.type.toLowerCase().replace('-', '')}`}>
                                        {job.type}
                                    </span>
                                </div>
                                <p className="job-description">{job.description.slice(0, 150)}...</p>
                                <div className="job-list-footer">
                                    <span className="salary">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                                    <span className="job-category-badge">{job.category}</span>
                                    <span className="job-date">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
