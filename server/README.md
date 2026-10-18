# JobNest Backend

The JobNest backend has transitioned to **Java, Spring Boot, Spring MVC, Spring Data JPA, MySQL, HTML, CSS, JavaScript, and Thymeleaf**.

### Location
The complete backend is located in:
```
../backend/
```

### Running the Backend
From the root directory or the `backend/` directory:
```bash
# Using Maven wrapper
cd backend
./mvnw.cmd spring-boot:run

# Or with Maven directly
mvn spring-boot:run

# Or using the pre-compiled JAR (with H2 in-memory or MySQL)
java -jar target/jobnest-backend-1.0.0.jar
java -jar target/jobnest-backend-1.0.0.jar --spring.profiles.active=h2
```

### Endpoints
- **Thymeleaf Web UI**: `http://localhost:5000/`
- **Browse Jobs**: `http://localhost:5000/jobs`
- **Candidate & Employer Dashboard**: `http://localhost:5000/dashboard`
- **REST APIs**: `http://localhost:5000/api/**`
