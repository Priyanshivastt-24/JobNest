# JobNest 🚀

**JobNest** is a full-stack job portal connecting ambitious professionals with world-class engineering, design, marketing, and leadership opportunities.

---

## 🛠️ Technology Stack

- **Backend**: Java, Spring Boot 3.3.4, Spring MVC, Spring Data JPA, Hibernate, MySQL, Spring Security (BCrypt), JJWT
- **Frontend / Templating**: HTML5, CSS3, JavaScript (ES6+), Thymeleaf
- **SPA Client (Alternative)**: React 19, Vite, Axios, React Router DOM, React Toastify

---

## 🌟 Key Features

1. **Job Search & Filtering**: Multi-criteria search by keyword, city/remote, industry category, and employment type.
2. **Dual Client Architecture**:
   - **Thymeleaf Full-Stack Web Application**: Server-rendered HTML templates with rich CSS design, responsive layout, modal dialogues, and flash toasts.
   - **REST API Support**: Built-in REST controllers (`/api/**`) with JWT and CORS allowing the React/Vite SPA or mobile apps to connect seamlessly.
3. **Role-Based Access Control**:
   - **Job Seeker**: Browse openings, submit 1-click applications with custom cover letters, and track application review status in real-time.
   - **Employer**: Publish job listings, manage compensation bands, inspect applicant credentials, and toggle status (`pending`, `reviewed`, `accepted`, `rejected`).
4. **Pre-Seeded Demo Data**: Includes verified users (`seeker@demo.com`, `employer@demo.com`) and 9 realistic tech opportunities.

---

## 🏃 Quick Start Guide

### 1. Run the Spring Boot Backend

Using Maven:
```bash
cd backend
mvn spring-boot:run
```

Or using the included Maven wrapper on Windows:
```bash
cd backend
./mvnw.cmd spring-boot:run
```

Or run the packaged JAR directly with the in-memory H2 profile (zero MySQL setup required):
```bash
java -jar backend/target/jobnest-backend-1.0.0.jar --spring.profiles.active=h2
```

The Spring Boot application will start on **`http://localhost:5000`**.

### 2. Access the Application

- **Thymeleaf Web UI**: Open your browser to [`http://localhost:5000`](http://localhost:5000)
- **Browse Jobs**: [`http://localhost:5000/jobs`](http://localhost:5000/jobs)
- **Dashboard**: [`http://localhost:5000/dashboard`](http://localhost:5000/dashboard)
- **Sign In**: [`http://localhost:5000/login`](http://localhost:5000/login)
- **Health Check API**: [`http://localhost:5000/api/health`](http://localhost:5000/api/health)

---

## 🗄️ MySQL Database Setup

By default, the backend connects to MySQL at:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobnest_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```
To configure your MySQL credentials, edit [`backend/src/main/resources/application.properties`](file:///c:/Users/Dell/Downloads/JobNest/backend/src/main/resources/application.properties) or set the environment variables `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.

A reference DDL schema is provided at [`backend/src/main/resources/mysql-schema.sql`](file:///c:/Users/Dell/Downloads/JobNest/backend/src/main/resources/mysql-schema.sql).

---

## 👥 Demo Credentials

- **Job Seeker**: `seeker@demo.com` | `password123`
- **Employer**: `employer@demo.com` | `password123`
