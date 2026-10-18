package com.jobnest.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtUtil(
            @Value("${jobnest.jwt.secret:jobnest-super-secret-key-2026-spring-boot-mysql-jwt-token-auth-must-be-long-enough}") String secret,
            @Value("${jobnest.jwt.expiration:604800000}") long expirationMillis) {
        // Ensure secret is at least 32 bytes for HMAC-SHA256
        String paddedSecret = secret;
        while (paddedSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            paddedSecret += "-padding-secret-key-jobnest-2026";
        }
        this.key = Keys.hmacShaKeyFor(paddedSecret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(String id, String name, String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(id)
                .claim("name", name)
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
