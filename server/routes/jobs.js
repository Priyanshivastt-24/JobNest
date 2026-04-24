const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, requireRole } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs (with optional search, filter by category/type/location)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, type, location } = req.query;
    const filter = {};

    // Text search across title and company
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (type) {
      filter.type = type.toUpperCase();
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/jobs/categories
// @desc    Get category list with job counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryIcons = {
      'Engineering': '⚙️',
      'Design': '🎨',
      'Marketing': '📈',
      'Finance': '💰',
      'Technology': '💻',
      'Healthcare': '🏥',
      'Sales': '🤝',
      'Education': '📚'
    };

    const result = categories.map(c => ({
      name: c._id,
      count: c.count,
      icon: categoryIcons[c._id] || '📋'
    }));

    res.json(result);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ message: 'Server error fetching job' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (employer only)
router.post('/', auth, requireRole('employer'), async (req, res) => {
  try {
    const { title, company, location, type, salaryMin, salaryMax, category, description } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      salaryMin,
      salaryMax,
      category,
      description,
      postedBy: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ message: 'Server error creating job' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (owner only)
router.put('/:id', auth, requireRole('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (owner only)
router.delete('/:id', auth, requireRole('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ message: 'Server error deleting job' });
  }
});

module.exports = router;
