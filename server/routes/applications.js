const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, requireRole } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Apply to a job
// @access  Private (seeker only)
router.post('/', auth, requireRole('seeker'), async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      status: 'pending'
    });

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error submitting application' });
  }
});

// @route   GET /api/applications/my
// @desc    Get my applications (for seekers)
// @access  Private (seeker)
router.get('/my', auth, requireRole('seeker'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'postedBy', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Get my applications error:', err);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job (employer who posted it)
// @access  Private (employer)
router.get('/job/:jobId', auth, requireRole('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Get job applications error:', err);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update application status
// @access  Private (employer)
router.patch('/:id/status', auth, requireRole('employer'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id)
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ message: 'Server error updating application' });
  }
});

module.exports = router;
