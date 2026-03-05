import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/jobs — list with search/filter
router.get('/', (req, res) => {
    try {
        const { search, location, category, type } = req.query;
        const jobs = db.getJobs({ search, location, category, type });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/jobs/featured — homepage featured jobs
router.get('/featured', (req, res) => {
    try {
        const jobs = db.getFeaturedJobs(6);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/jobs/categories — category counts
router.get('/categories', (req, res) => {
    try {
        const categories = db.getCategoryCounts();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/jobs/my — employer's posted jobs
router.get('/my', authMiddleware, (req, res) => {
    try {
        const jobs = db.getJobs({ postedBy: req.user.id });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/jobs/:id — single job
router.get('/:id', (req, res) => {
    try {
        const job = db.getJobById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/jobs — create job (employer only)
router.post('/', authMiddleware, (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can post jobs' });
        }

        const { title, company, location, type, salaryMin, salaryMax, description, category } = req.body;

        if (!title || !company || !location || !description || !category) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const job = {
            id: uuidv4(),
            title,
            company,
            location,
            type: type || 'Full-time',
            salaryMin: salaryMin || '',
            salaryMax: salaryMax || '',
            description,
            category,
            postedBy: req.user.id,
            posterName: req.user.name,
            createdAt: new Date().toISOString(),
        };

        db.createJob(job);
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE /api/jobs/:id — delete job (owner only)
router.delete('/:id', authMiddleware, (req, res) => {
    try {
        const job = db.getJobById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.postedBy !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        db.deleteJob(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;
