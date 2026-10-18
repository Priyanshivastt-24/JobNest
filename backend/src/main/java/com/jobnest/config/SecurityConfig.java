package com.jobnest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabled for unified API + Thymeleaf form simplicity
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/jobs/**",
                    "/login",
                    "/register",
                    "/logout",
                    "/dashboard/**",
                    "/post-job/**",
                    "/applications/**",
                    "/api/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/favicon.ico",
                    "/h2-console/**"
                ).permitAll()
                .anyRequest().permitAll()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
