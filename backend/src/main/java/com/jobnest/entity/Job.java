package com.jobnest.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 50)
    private String type; // e.g. "Full-time", "Remote", "Part-time", "Contract", "Internship"

    @Column(name = "salary_min", length = 50)
    private String salaryMin;

    @Column(name = "salary_max", length = 50)
    private String salaryMax;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // e.g. "Engineering", "Design", "Marketing", "Product", "Finance"

    @Column(name = "posted_by", nullable = false, length = 36)
    private String postedBy;

    @Column(name = "poster_name", nullable = false, length = 100)
    private String posterName;

    @Column(name = "created_at", nullable = false, length = 50)
    private String createdAt;

    public Job() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now().toString();
    }

    public Job(String title, String company, String location, String type,
               String salaryMin, String salaryMax, String description,
               String category, String postedBy, String posterName) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.company = company;
        this.location = location;
        this.type = (type != null && !type.isBlank()) ? type : "Full-time";
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.description = description;
        this.category = category;
        this.postedBy = postedBy;
        this.posterName = posterName;
        this.createdAt = Instant.now().toString();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(String salaryMin) {
        this.salaryMin = salaryMin;
    }

    public String getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(String salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(String postedBy) {
        this.postedBy = postedBy;
    }

    public String getPosterName() {
        return posterName;
    }

    public void setPosterName(String posterName) {
        this.posterName = posterName;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    // Helper for salary formatting
    public String getFormattedSalary() {
        if ((salaryMin == null || salaryMin.isBlank()) && (salaryMax == null || salaryMax.isBlank())) {
            return "Competitive";
        }
        if (salaryMin != null && !salaryMin.isBlank() && (salaryMax == null || salaryMax.isBlank())) {
            return "$" + formatNumber(salaryMin) + "+";
        }
        if ((salaryMin == null || salaryMin.isBlank()) && salaryMax != null && !salaryMax.isBlank()) {
            return "Up to $" + formatNumber(salaryMax);
        }
        return "$" + formatNumber(salaryMin) + " - $" + formatNumber(salaryMax);
    }

    private String formatNumber(String val) {
        try {
            long num = Long.parseLong(val.replaceAll("[^0-9]", ""));
            return String.format("%,d", num);
        } catch (Exception e) {
            return val;
        }
    }
}
