-- ─────────────────────────────────────────────────────────────────
-- JobNest MySQL Database Schema
-- Database: jobnest_db
-- ─────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS jobnest_db;
USE jobnest_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'seeker',
    created_at VARCHAR(50) NOT NULL
);

-- 2. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    salary_min VARCHAR(50),
    salary_max VARCHAR(50),
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    posted_by VARCHAR(36) NOT NULL,
    poster_name VARCHAR(100) NOT NULL,
    created_at VARCHAR(50) NOT NULL,
    INDEX idx_jobs_category (category),
    INDEX idx_jobs_type (type),
    INDEX idx_jobs_posted_by (posted_by)
);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL,
    applicant_id VARCHAR(36) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    applied_at VARCHAR(50) NOT NULL,
    INDEX idx_applications_job (job_id),
    INDEX idx_applications_applicant (applicant_id)
);
