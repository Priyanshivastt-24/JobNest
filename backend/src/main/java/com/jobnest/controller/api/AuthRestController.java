package com.jobnest.controller.api;

import com.jobnest.config.JwtUtil;
import com.jobnest.dto.AuthRequest;
import com.jobnest.dto.AuthResponse;
import com.jobnest.dto.RegisterRequest;
import com.jobnest.entity.User;
import com.jobnest.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthRestController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            User user = userService.registerUser(req.getName(), req.getEmail(), req.getPassword(), req.getRole());

            String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getEmail(), user.getRole());

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());

            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, userMap));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            Optional<User> userOpt = userService.authenticateUser(req.getEmail(), req.getPassword());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
            }

            User user = userOpt.get();
            String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getEmail(), user.getRole());

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());

            return ResponseEntity.ok(new AuthResponse(token, userMap));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No token, authorization denied"));
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = jwtUtil.parseToken(token);
            String userId = claims.getSubject();
            Optional<User> userOpt = userService.findById(userId);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
            }

            User user = userOpt.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", user.getId());
            resp.put("name", user.getName());
            resp.put("email", user.getEmail());
            resp.put("role", user.getRole());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token is not valid"));
        }
    }
}
