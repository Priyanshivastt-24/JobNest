# JobNest Backend

JobNest is a modern, full-stack job portal platform built with **Java, Spring Boot, Spring MVC, Spring Data JPA, MySQL, HTML, CSS, JavaScript, and Thymeleaf**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Language** | Java 21 / 26 |
| **Framework** | Spring Boot 3.3.4, Spring MVC |
| **Persistence & ORM** | Spring Data JPA, Hibernate |
| **Database** | MySQL 8.0+ (with H2 in-memory profile for instant testing) |
| **Security & Auth** | Spring Security, BCrypt Password Hashing, JJWT (JSON Web Token) |
| **Templating & UI** | Thymeleaf, Modern Semantic HTML5, Vanilla CSS3, JavaScript (ES6+) |
| **Build Tool** | Apache Maven / `mvnw.cmd` |

---

## 📁 Project Architecture

```
backend/
├── pom.xml                                      # Maven build file with all starters
├── mvnw.cmd & mvnw                              # Cross-platform Maven wrappers
├── src/
│   ├── main/
│   │   ├── java/com/jobnest/
│   │   │   ├── JobNestApplication.java          # @SpringBootApplication entry point
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java          # Spring Security filter chain & BCrypt encoder
│   │   │   │   ├── CorsConfig.java              # CORS configuration for cross-origin clients
│   │   │   │   └── JwtUtil.java                 # HMAC-SHA256 JWT generator and validator
│   │   │   ├── entity/
│   │   │   │   ├── User.java                    # JPA Entity: users table
│   │   │   │   ├── Job.java                     # JPA Entity: jobs table
│   │   │   │   └── Application.java             # JPA Entity: applications table
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java          # Spring Data JPA interface for User
│   │   │   │   ├── JobRepository.java           # Spring Data JPA with custom search queries
│   │   │   │   └── ApplicationRepository.java   # Spring Data JPA for candidate applications
│   │   │   ├── service/
│   │   │   │   ├── UserService.java             # User registration & authentication logic
│   │   │   │   ├── JobService.java              # Job posting, filtering, and deletion
│   │   │   │   └── ApplicationService.java      # Application submission and status workflows
│   │   │   ├── controller/
│   │   │   │   ├── web/                         # Spring MVC Controllers returning Thymeleaf views
│   │   │   │   │   ├── HomeWebController.java   # / (Landing page, featured jobs, categories)
│   │   │   │   │   ├── JobWebController.java    # /jobs, /jobs/{id}, /post-job, apply modal
│   │   │   │   │   ├── AuthWebController.java   # /login, /register, /logout
│   │   │   │   │   └── DashboardWebController.java # /dashboard (Employer & Seeker views)
│   │   │   │   └── api/                         # REST API Controllers (for SPA/mobile)
│   │   │   │       ├── AuthRestController.java  # /api/auth/** (register, login, me)
│   │   │   │       ├── JobRestController.java   # /api/jobs/** (CRUD, search, categories)
│   │   │   │       ├── ApplicationRestController.java # /api/applications/**
│   │   │   │       └── HealthController.java    # /api/health
│   │   │   ├── dto/                             # Data Transfer Objects
│   │   │   └── init/
│   │   │       └── DataInitializer.java         # Auto-populates demo users, jobs & application
│   │   └── resources/
│   │       ├── application.properties           # MySQL database configuration
│   │       ├── application-h2.properties        # Fallback in-memory database profile
│   │       ├── mysql-schema.sql                 # MySQL schema reference script
│   │       ├── static/                          # Static assets (CSS, JS, images)
│   │       │   ├── css/jobnest.css              # Custom responsive stylesheet
│   │       │   └── js/main.js                   # Client interactions & modal handlers
│   │       └── templates/                       # Thymeleaf HTML5 templates
│   │           ├── fragments/                   # navbar, footer, head fragments
│   │           ├── index.html                   # Homepage
│   │           ├── jobs.html                    # Job search and directory
│   │           ├── job-details.html             # Job details & application modal
│   │           ├── post-job.html                # Employer job creation form
│   │           ├── dashboard.html               # Dual employer/seeker dashboard
│   │           ├── login.html                   # Sign in with 1-click demo buttons
│   │           └── register.html                # Account creation
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17, 21, or 26** installed (`java -version`)
- **Maven** (or use the included `mvnw.cmd` / IntelliJ bundled Maven)
- **MySQL 8.0+** (optional: runs out of the box with the default or `h2` profile)

---

### Running the Application

#### Option 1: Run with Maven
```bash
cd backend
mvn spring-boot:run
```
Or using the Maven wrapper:
```bash
cd backend
./mvnw.cmd spring-boot:run
```

#### Option 2: Run with In-Memory H2 Profile (No MySQL setup needed)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Or execute the pre-built JAR:
```bash
java -jar backend/target/jobnest-backend-1.0.0.jar --spring.profiles.active=h2
```

---

## 🗄️ MySQL Database Configuration

In `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobnest_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

You can also pass environment variables:
```bash
set DB_URL=jdbc:mysql://localhost:3306/jobnest_db
set DB_USERNAME=root
set DB_PASSWORD=your_password
```

Hibernate will automatically create and update the database tables (`spring.jpa.hibernate.ddl-auto=update`).

---

## 👤 Pre-Seeded Demo Accounts

The database is automatically pre-seeded with demo data on initial startup:

| Role | Email | Password | Features |
|---|---|---|---|
| **Job Seeker** | `seeker@demo.com` | `password123` | Search jobs, 1-click apply, track application status on dashboard |
| **Employer** | `employer@demo.com` | `password123` | Post new jobs, view applicant resumes/letters, update status (`reviewed`, `accepted`, `rejected`) |

*Tip: The `/login` page includes 1-click demo buttons to auto-populate credentials instantly.*

---

## 🌐 Endpoints Overview

### Thymeleaf Web Pages (HTML + CSS + JS)
- `http://localhost:5000/` – Home / Landing page
- `http://localhost:5000/jobs` – Browse and filter jobs
- `http://localhost:5000/jobs/{id}` – Job details & application modal
- `http://localhost:5000/post-job` – Employer post job form
- `http://localhost:5000/dashboard` – Candidate and Employer live dashboard
- `http://localhost:5000/login` – Sign in
- `http://localhost:5000/register` – Create account

### REST APIs (JSON / Dual Mode)
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login and obtain JWT token
- `GET /api/auth/me` – Current user profile (Bearer token)
- `GET /api/jobs` – Filterable jobs list (`search`, `location`, `category`, `type`)
- `GET /api/jobs/featured` – Top 6 featured jobs
- `GET /api/jobs/categories` – Grouped category counts
- `GET /api/jobs/my` – Employer's posted jobs
- `POST /api/jobs` – Post new job (Employer role required)
- `DELETE /api/jobs/{id}` – Delete job (Owner only)
- `POST /api/applications` – Submit job application
- `GET /api/applications/my` – Seeker's application history
- `GET /api/applications/job/{jobId}` – Employer's applicants for a job
- `PATCH /api/applications/{id}/status` – Update candidate status
- `GET /api/health` – Health check endpoint
