package com.jobnest.controller.api;

import com.jobnest.config.JwtUtil;
import com.jobnest.dto.JobRequest;
import com.jobnest.entity.Job;
import com.jobnest.service.JobService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobRestController {

    private final JobService jobService;
    private final JwtUtil jwtUtil;

    public JobRestController(JobService jobService, JwtUtil jwtUtil) {
        this.jobService = jobService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<Job>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type) {
        List<Job> jobs = jobService.getJobs(search, location, category, type);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Job>> getFeaturedJobs() {
        List<Job> jobs = jobService.getFeaturedJobs(6);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategoryCounts() {
        List<Map<String, Object>> categories = jobService.getCategoryCounts();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyJobs(HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        List<Job> jobs = jobService.getJobsByPoster(claims.getSubject());
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        Optional<Job> jobOpt = jobService.getJobById(id);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job not found"));
        }
        return ResponseEntity.ok(jobOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobRequest req, HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        String role = claims.get("role", String.class);
        if (!"employer".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Only employers can post jobs"));
        }

        if (req.getTitle() == null || req.getCompany() == null || req.getLocation() == null ||
            req.getDescription() == null || req.getCategory() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please fill all required fields"));
        }

        String posterName = claims.get("name", String.class);
        if (posterName == null) posterName = "Employer";

        Job job = new Job(
                req.getTitle(),
                req.getCompany(),
                req.getLocation(),
                req.getType() != null ? req.getType() : "Full-time",
                req.getSalaryMin() != null ? req.getSalaryMin() : "",
                req.getSalaryMax() != null ? req.getSalaryMax() : "",
                req.getDescription(),
                req.getCategory(),
                claims.getSubject(),
                posterName
        );

        Job saved = jobService.createJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id, HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        try {
            boolean deleted = jobService.deleteJob(id, claims.getSubject());
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job not found"));
            }
            return ResponseEntity.ok(Map.of("message", "Job deleted"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    private Claims getClaims(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        try {
            return jwtUtil.parseToken(authHeader.substring(7));
        } catch (Exception e) {
            return null;
        }
    }
}
