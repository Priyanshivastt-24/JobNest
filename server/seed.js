const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo users
    const salt = await bcrypt.genSalt(10);

    const seeker = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: await bcrypt.hash('password123', salt),
      role: 'seeker'
    });

    const employer = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: await bcrypt.hash('password123', salt),
      role: 'employer'
    });

    console.log('👤 Created demo users');
    console.log('   Seeker  → priya@example.com / password123');
    console.log('   Employer → rajesh@example.com / password123');

    // Create demo jobs
    const jobs = await Job.insertMany([
      {
        title: 'Staff Data Engineer',
        company: 'Quant Analytics',
        location: 'Palo Alto, CA',
        type: 'FULL-TIME',
        salaryMin: 180000,
        salaryMax: 240000,
        category: 'Engineering',
        description: 'We are looking for an experienced Staff Data Engineer to design, build, and maintain our data infrastructure. You will work with big data technologies and cloud platforms to support our analytics pipeline.',
        postedBy: employer._id
      },
      {
        title: 'Senior Fintech Architect',
        company: 'Silverline Global',
        location: 'Remote',
        type: 'REMOTE',
        salaryMin: 160000,
        salaryMax: 210000,
        category: 'Engineering',
        description: 'Join our team as a Senior Fintech Architect to lead the design of scalable, secure financial systems. Experience with microservices, cloud-native architecture, and payment systems required.',
        postedBy: employer._id
      },
      {
        title: 'Head of Cyber Security',
        company: 'DefendCore',
        location: 'New York, NY',
        type: 'ON-SITE',
        salaryMin: 220000,
        salaryMax: 300000,
        category: 'Engineering',
        description: 'Lead our cybersecurity initiatives as Head of Cyber Security. You will define security strategy, manage incident response, and ensure compliance across all platforms.',
        postedBy: employer._id
      },
      {
        title: 'Senior UI/UX Designer',
        company: 'PixelCraft Studios',
        location: 'San Francisco, CA',
        type: 'FULL-TIME',
        salaryMin: 130000,
        salaryMax: 180000,
        category: 'Design',
        description: 'Create beautiful, intuitive user experiences for our suite of SaaS products. You will lead design sprints, conduct user research, and collaborate closely with engineering teams.',
        postedBy: employer._id
      },
      {
        title: 'Growth Marketing Manager',
        company: 'LaunchPad Digital',
        location: 'Austin, TX',
        type: 'FULL-TIME',
        salaryMin: 110000,
        salaryMax: 150000,
        category: 'Marketing',
        description: 'Drive user acquisition and retention through data-driven marketing strategies. Experience with paid channels, SEO, content marketing, and marketing analytics required.',
        postedBy: employer._id
      },
      {
        title: 'Financial Analyst',
        company: 'Capital Bridge',
        location: 'Chicago, IL',
        type: 'FULL-TIME',
        salaryMin: 95000,
        salaryMax: 130000,
        category: 'Finance',
        description: 'Analyze financial data, create forecasting models, and provide insights to senior leadership. Strong Excel and SQL skills required along with a finance or accounting degree.',
        postedBy: employer._id
      },
      {
        title: 'Brand Designer',
        company: 'Chromatic Agency',
        location: 'Remote',
        type: 'REMOTE',
        salaryMin: 90000,
        salaryMax: 125000,
        category: 'Design',
        description: 'Shape brand identities for our Fortune 500 clients. You will create visual systems, brand guidelines, and marketing collateral that tell compelling stories.',
        postedBy: employer._id
      },
      {
        title: 'DevOps Lead',
        company: 'CloudNova',
        location: 'Seattle, WA',
        type: 'FULL-TIME',
        salaryMin: 170000,
        salaryMax: 220000,
        category: 'Engineering',
        description: 'Lead our DevOps team in building and maintaining CI/CD pipelines, container orchestration, and cloud infrastructure on AWS and GCP.',
        postedBy: employer._id
      }
    ]);

    console.log(`💼 Created ${jobs.length} demo jobs`);

    // Create a demo application
    await Application.create({
      job: jobs[0]._id,
      applicant: seeker._id,
      status: 'pending'
    });

    console.log('📄 Created 1 demo application');
    console.log('\n🎉 Seed completed successfully!');
    console.log('   You can now start the server with: npm run dev');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
