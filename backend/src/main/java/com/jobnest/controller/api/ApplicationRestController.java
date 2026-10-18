package com.jobnest.controller.api;

import com.jobnest.config.JwtUtil;
import com.jobnest.dto.ApplicationRequest;
import com.jobnest.entity.Application;
import com.jobnest.service.ApplicationService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/applications")
public class ApplicationRestController {

    private final ApplicationService applicationService;
    private final JwtUtil jwtUtil;

    public ApplicationRestController(ApplicationService applicationService, JwtUtil jwtUtil) {
        this.applicationService = applicationService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody ApplicationRequest req, HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        String role = claims.get("role", String.class);
        if (!"seeker".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Only job seekers can apply"));
        }

        if (req.getJobId() == null || req.getJobId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Job ID is required"));
        }

        try {
            Application application = applicationService.apply(req.getJobId(), claims.getSubject(), req.getCoverLetter());
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        List<Map<String, Object>> apps = applicationService.getApplicationsByApplicant(claims.getSubject());
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsByJob(@PathVariable String jobId, HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        try {
            List<Map<String, Object>> apps = applicationService.getApplicationsByJob(jobId, claims.getSubject());
            return ResponseEntity.ok(apps);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body, HttpServletRequest request) {
        Claims claims = getClaims(request);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization required"));
        }

        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        try {
            Application app = applicationService.updateStatus(id, status);
            return ResponseEntity.ok(app);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
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
