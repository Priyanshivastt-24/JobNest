package com.jobnest.service;

import com.jobnest.entity.User;
import com.jobnest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String name, String email, String rawPassword, String role) {
        if (name == null || name.isBlank() || email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Name, email, and password are required.");
        }

        String normalizedEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("User already exists with this email.");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        User user = new User(name.trim(), normalizedEmail, encodedPassword, (role != null && !role.isBlank()) ? role : "seeker");
        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String email, String rawPassword) {
        if (email == null || rawPassword == null) {
            return Optional.empty();
        }

        String normalizedEmail = email.toLowerCase().trim();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isPresent() && passwordEncoder.matches(rawPassword, userOpt.get().getPassword())) {
            return userOpt;
        }

        return Optional.empty();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmail(email.toLowerCase().trim());
    }

    public boolean existsByEmail(String email) {
        if (email == null) return false;
        return userRepository.existsByEmail(email.toLowerCase().trim());
    }
}
