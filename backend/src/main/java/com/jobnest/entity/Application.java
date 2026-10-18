package com.jobnest.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "job_id", nullable = false, length = 36)
    private String jobId;

    @Column(name = "applicant_id", nullable = false, length = 36)
    private String applicantId;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(nullable = false, length = 30)
    private String status; // "pending", "reviewed", "accepted", "rejected"

    @Column(name = "applied_at", nullable = false, length = 50)
    private String appliedAt;

    public Application() {
        this.id = UUID.randomUUID().toString();
        this.status = "pending";
        this.appliedAt = Instant.now().toString();
    }

    public Application(String jobId, String applicantId, String coverLetter) {
        this.id = UUID.randomUUID().toString();
        this.jobId = jobId;
        this.applicantId = applicantId;
        this.coverLetter = coverLetter;
        this.status = "pending";
        this.appliedAt = Instant.now().toString();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(String applicantId) {
        this.applicantId = applicantId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(String appliedAt) {
        this.appliedAt = appliedAt;
    }
}
