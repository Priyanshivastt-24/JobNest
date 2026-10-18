package com.jobnest.init;

import com.jobnest.entity.Application;
import com.jobnest.entity.Job;
import com.jobnest.entity.User;
import com.jobnest.repository.ApplicationRepository;
import com.jobnest.repository.JobRepository;
import com.jobnest.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("Data already present in database. Skipping seed.");
            return;
        }

        System.out.println("🌱 Seeding initial JobNest database with demo users and jobs...");

        // 1. Demo Users
        User seeker = new User("Alex Johnson", "seeker@demo.com", passwordEncoder.encode("password123"), "seeker");
        User employer = new User("Sarah Chen", "employer@demo.com", passwordEncoder.encode("password123"), "employer");

        userRepository.save(seeker);
        userRepository.save(employer);

        String employerId = employer.getId();
        String posterName = employer.getName();

        // 2. Demo Jobs
        List<Job> initialJobs = List.of(
            new Job(
                "Staff Data Engineer",
                "Quant Analytics",
                "Palo Alto, CA",
                "Full-time",
                "180000",
                "240000",
                "We are looking for a Staff Data Engineer to join our growing data platform team. You will design and build scalable data pipelines, work with petabyte-scale datasets, and drive architectural decisions. Experience with Spark, Kafka, and cloud data warehouses required. You'll mentor junior engineers and collaborate cross-functionally with ML and product teams.",
                "Engineering",
                employerId,
                posterName
            ),
            new Job(
                "Senior Fintech Architect",
                "Silverline Global",
                "Remote",
                "Remote",
                "160000",
                "210000",
                "Design and implement next-generation financial technology solutions. Lead architecture decisions for our payment processing platform serving millions of transactions daily. Requires deep knowledge of distributed systems, microservices, and financial regulations. Experience with real-time data streaming and event-driven architecture is a plus.",
                "Engineering",
                employerId,
                posterName
            ),
            new Job(
                "Head of Cyber Security",
                "DefendCore",
                "New York, NY",
                "Full-time",
                "220000",
                "300000",
                "Lead our cybersecurity division and protect enterprise clients from evolving threats. You will build and manage a team of security analysts, implement zero-trust architecture, and oversee incident response. CISSP certification and 10+ years of experience in enterprise security required.",
                "Engineering",
                employerId,
                posterName
            ),
            new Job(
                "Senior UX Designer",
                "PixelCraft Studios",
                "San Francisco, CA",
                "Full-time",
                "130000",
                "175000",
                "Create exceptional user experiences for our suite of creative tools. You will conduct user research, build prototypes in Figma, and collaborate with engineering to deliver pixel-perfect interfaces. Strong portfolio showcasing complex product design is required. Experience with design systems and component libraries preferred.",
                "Design",
                employerId,
                posterName
            ),
            new Job(
                "Brand Identity Designer",
                "NovaBrand Agency",
                "Remote",
                "Remote",
                "90000",
                "120000",
                "Craft memorable visual identities for cutting-edge startups and iconic global brands. You will oversee typography, design guidelines, packaging, and visual storytelling across all touchpoints.",
                "Design",
                employerId,
                posterName
            ),
            new Job(
                "Product Marketing Lead",
                "GrowthPulse",
                "Austin, TX",
                "Full-time",
                "140000",
                "180000",
                "Drive go-to-market strategies for our AI-powered SaaS product. Define positioning, launch campaigns, collaborate with sales enablement, and track adoption metrics. 5+ years B2B SaaS experience required.",
                "Marketing",
                employerId,
                posterName
            ),
            new Job(
                "Director of Product Management",
                "ApexCloud Systems",
                "Seattle, WA",
                "Full-time",
                "210000",
                "275000",
                "Lead product vision, roadmaps, and execution for enterprise cloud infrastructure products. Work closely with executive leadership, engineering, and sales to scale our core platform offerings to 10M+ users.",
                "Product",
                employerId,
                posterName
            ),
            new Job(
                "Principal Financial Analyst",
                "Vanguard Capital Partners",
                "Chicago, IL",
                "Full-time",
                "150000",
                "195000",
                "Perform complex financial modeling, market evaluations, and valuation analyses for strategic M&A and venture investments. CFA or MBA preferred with 6+ years in corporate finance or private equity.",
                "Finance",
                employerId,
                posterName
            ),
            new Job(
                "Principal Infrastructure Architect",
                "Cognitive Cloud Systems",
                "Boston, MA",
                "Full-time",
                "200000",
                "260000",
                "Design and lead next-generation distributed cloud infrastructure, resilient multi-region deployments, and zero-downtime microservice architectures serving global enterprises.",
                "Engineering",
                employerId,
                posterName
            )
        );

        List<Job> savedJobs = jobRepository.saveAll(initialJobs);

        // 3. Demo Application
        if (!savedJobs.isEmpty()) {
            Application demoApp = new Application(
                savedJobs.get(0).getId(),
                seeker.getId(),
                "I am very excited to apply for the Staff Data Engineer position. I have over 7 years of distributed data systems experience."
            );
            demoApp.setStatus("reviewed");
            applicationRepository.save(demoApp);
        }

        System.out.println("✅ Database seeding complete! Seeded 2 users, " + savedJobs.size() + " jobs, and 1 demo application.");
    }
}
