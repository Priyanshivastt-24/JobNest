import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/applications — apply to a job
router.post('/', authMiddleware, (req, res) => {
    try {
        if (req.user.role !== 'seeker') {
            return res.status(403).json({ message: 'Only job seekers can apply' });
        }

        const { jobId, coverLetter } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        const job = db.getJobById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existing = db.getApplication(jobId, req.user.id);
        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        const application = {
            id: uuidv4(),
            jobId,
            applicantId: req.user.id,
            coverLetter: coverLetter || '',
            status: 'pending',
            appliedAt: new Date().toISOString(),
        };

        db.createApplication(application);
        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/applications/my — seeker's applications
router.get('/my', authMiddleware, (req, res) => {
    try {
        const apps = db.getApplicationsByApplicant(req.user.id);
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/applications/job/:jobId — applications for a specific job (employer)
router.get('/job/:jobId', authMiddleware, (req, res) => {
    try {
        const job = db.getJobById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.postedBy !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const apps = db.getApplicationsByJob(req.params.jobId);
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PATCH /api/applications/:id/status — update status (employer)
router.patch('/:id/status', authMiddleware, (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const app = db.updateApplicationStatus(req.params.id, status);
        if (!app) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;
