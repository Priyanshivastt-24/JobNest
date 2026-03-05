import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function seed() {
    console.log('🌱 Seeding database...');

    const salt = await bcrypt.genSalt(10);

    const users = [
        {
            id: uuidv4(),
            name: 'Alex Johnson',
            email: 'seeker@demo.com',
            password: await bcrypt.hash('password123', salt),
            role: 'seeker',
            createdAt: new Date().toISOString(),
        },
        {
            id: uuidv4(),
            name: 'Sarah Chen',
            email: 'employer@demo.com',
            password: await bcrypt.hash('password123', salt),
            role: 'employer',
            createdAt: new Date().toISOString(),
        },
    ];

    const employerId = users[1].id;

    const jobs = [
        {
            id: uuidv4(),
            title: 'Staff Data Engineer',
            company: 'Quant Analytics',
            location: 'Palo Alto, CA',
            type: 'Full-time',
            salaryMin: '180000',
            salaryMax: '240000',
            description: 'We are looking for a Staff Data Engineer to join our growing data platform team. You will design and build scalable data pipelines, work with petabyte-scale datasets, and drive architectural decisions. Experience with Spark, Kafka, and cloud data warehouses required. You\'ll mentor junior engineers and collaborate cross-functionally with ML and product teams.',
            category: 'Engineering',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Senior Fintech Architect',
            company: 'Silverline Global',
            location: 'Remote',
            type: 'Remote',
            salaryMin: '160000',
            salaryMax: '210000',
            description: 'Design and implement next-generation financial technology solutions. Lead architecture decisions for our payment processing platform serving millions of transactions daily. Requires deep knowledge of distributed systems, microservices, and financial regulations. Experience with real-time data streaming and event-driven architecture is a plus.',
            category: 'Engineering',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Head of Cyber Security',
            company: 'DefendCore',
            location: 'New York, NY',
            type: 'Full-time',
            salaryMin: '220000',
            salaryMax: '300000',
            description: 'Lead our cybersecurity division and protect enterprise clients from evolving threats. You will build and manage a team of security analysts, implement zero-trust architecture, and oversee incident response. CISSP certification and 10+ years of experience in enterprise security required.',
            category: 'Engineering',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Senior UX Designer',
            company: 'PixelCraft Studios',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salaryMin: '130000',
            salaryMax: '175000',
            description: 'Create exceptional user experiences for our suite of creative tools. You will conduct user research, build prototypes in Figma, and collaborate with engineering to deliver pixel-perfect interfaces. Strong portfolio showcasing complex product design is required. Experience with design systems and component libraries preferred.',
            category: 'Design',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Brand Identity Designer',
            company: 'NovaBrand Agency',
            location: 'Austin, TX',
            type: 'Full-time',
            salaryMin: '90000',
            salaryMax: '130000',
            description: 'Develop compelling brand identities for Fortune 500 clients. You will create visual systems including logos, typography, color palettes, and brand guidelines. Must have expertise in Adobe Creative Suite and experience working with cross-functional teams. This role combines creative excellence with strategic thinking.',
            category: 'Design',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Growth Marketing Manager',
            company: 'RocketScale',
            location: 'Remote',
            type: 'Remote',
            salaryMin: '110000',
            salaryMax: '150000',
            description: 'Drive user acquisition and retention strategies for our B2B SaaS platform. You will own the full marketing funnel, run A/B experiments, manage paid channels (Google, LinkedIn, Meta), and build automated email nurture sequences. Experience with HubSpot, Mixpanel, and growth hacking techniques required.',
            category: 'Marketing',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Content Strategy Lead',
            company: 'ContentFlow',
            location: 'Chicago, IL',
            type: 'Full-time',
            salaryMin: '95000',
            salaryMax: '135000',
            description: 'Build and execute content strategies that drive organic growth and brand authority. Manage a team of writers, oversee editorial calendar, and work with SEO specialists. Experience creating long-form content, video scripts, and social media campaigns for tech companies is essential.',
            category: 'Marketing',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'VP of Finance',
            company: 'CapitalEdge',
            location: 'Boston, MA',
            type: 'Full-time',
            salaryMin: '200000',
            salaryMax: '280000',
            description: 'Oversee all financial operations for a fast-growing fintech startup. Responsibilities include financial planning, fundraising support, board reporting, and building out the finance team. CPA or CFA required with 12+ years of experience in corporate finance or investment banking.',
            category: 'Finance',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Financial Analyst',
            company: 'TrueNorth Capital',
            location: 'Denver, CO',
            type: 'Full-time',
            salaryMin: '85000',
            salaryMax: '115000',
            description: 'Analyze financial data, build models, and provide actionable insights to drive business decisions. You will create financial forecasts, prepare presentations for senior leadership, and support M&A due diligence. Proficiency in Excel, SQL, and financial modeling required.',
            category: 'Finance',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Full Stack Developer',
            company: 'CodeNexus',
            location: 'Seattle, WA',
            type: 'Full-time',
            salaryMin: '140000',
            salaryMax: '190000',
            description: 'Build end-to-end features for our developer tools platform used by thousands of engineering teams. Requires strong experience with React, Node.js, PostgreSQL, and AWS. You\'ll work in an agile environment, ship fast, and contribute to open-source projects.',
            category: 'Engineering',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Product Designer',
            company: 'Flowspace',
            location: 'Remote',
            type: 'Remote',
            salaryMin: '120000',
            salaryMax: '160000',
            description: 'Design intuitive interfaces for our project management platform. You will own the end-to-end design process from research to high-fidelity mockups. Strong skills in Figma, prototyping, and user testing required. Experience designing for SaaS products is a bonus.',
            category: 'Design',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'DevOps Engineer',
            company: 'CloudForge',
            location: 'Portland, OR',
            type: 'Full-time',
            salaryMin: '145000',
            salaryMax: '195000',
            description: 'Build and maintain CI/CD pipelines, manage Kubernetes clusters, and optimize cloud infrastructure on AWS and GCP. You\'ll implement infrastructure-as-code with Terraform, monitor system health, and collaborate with development teams to improve deployment velocity.',
            category: 'Engineering',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'SEO Specialist',
            company: 'SearchBright',
            location: 'Miami, FL',
            type: 'Contract',
            salaryMin: '75000',
            salaryMax: '100000',
            description: 'Optimize web properties for search engines and drive organic traffic growth. Conduct keyword research, technical audits, and link-building campaigns. Experience with SEMrush, Ahrefs, Google Analytics, and Google Search Console is essential.',
            category: 'Marketing',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 13 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Risk Analyst',
            company: 'SafeHaven Insurance',
            location: 'Charlotte, NC',
            type: 'Full-time',
            salaryMin: '80000',
            salaryMax: '110000',
            description: 'Assess and quantify financial risks across our insurance portfolio. Build risk models, analyze claims data, and provide recommendations to the underwriting team. Strong background in statistics, actuarial science, or quantitative finance required.',
            category: 'Finance',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        },
        {
            id: uuidv4(),
            title: 'Mobile App Developer',
            company: 'AppStream',
            location: 'Los Angeles, CA',
            type: 'Full-time',
            salaryMin: '130000',
            salaryMax: '180000',
            description: 'Develop cross-platform mobile applications using React Native. You\'ll build new features, optimize performance, and ensure seamless user experiences on iOS and Android. Experience with native modules, app store deployment, and mobile CI/CD pipelines required.',
            category: 'Engineering',
            postedBy: employerId,
            posterName: 'Sarah Chen',
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
    ];

    const data = { users, jobs, applications: [] };
    const filePath = path.join(DATA_DIR, 'database.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`✅ Seeded ${users.length} users and ${jobs.length} jobs`);
    console.log('\n📋 Demo Accounts:');
    console.log('   Job Seeker: seeker@demo.com / password123');
    console.log('   Employer:   employer@demo.com / password123');
}

seed().catch(console.error);
