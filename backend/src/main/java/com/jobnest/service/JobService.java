package com.jobnest.service;

import com.jobnest.entity.Job;
import com.jobnest.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getJobs(String search, String location, String category, String type) {
        return jobRepository.searchJobs(
                (search != null && !search.isBlank()) ? search.trim() : null,
                (location != null && !location.isBlank()) ? location.trim() : null,
                (category != null && !category.isBlank()) ? category.trim() : null,
                (type != null && !type.isBlank()) ? type.trim() : null
        );
    }

    public List<Job> getFeaturedJobs(int limit) {
        List<Job> top = jobRepository.findTop6ByOrderByCreatedAtDesc();
        if (top.size() > limit) {
            return top.subList(0, limit);
        }
        return top;
    }

    public List<Job> getJobsByPoster(String postedBy) {
        return jobRepository.findByPostedByOrderByCreatedAtDesc(postedBy);
    }

    public Optional<Job> getJobById(String id) {
        return jobRepository.findById(id);
    }

    public List<Map<String, Object>> getCategoryCounts() {
        return jobRepository.getCategoryCounts();
    }

    public Job createJob(Job job) {
        if (job.getTitle() == null || job.getTitle().isBlank()) {
            throw new IllegalArgumentException("Job title is required.");
        }
        if (job.getCompany() == null || job.getCompany().isBlank()) {
            throw new IllegalArgumentException("Company name is required.");
        }
        if (job.getLocation() == null || job.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location is required.");
        }
        if (job.getDescription() == null || job.getDescription().isBlank()) {
            throw new IllegalArgumentException("Description is required.");
        }
        if (job.getCategory() == null || job.getCategory().isBlank()) {
            throw new IllegalArgumentException("Category is required.");
        }
        return jobRepository.save(job);
    }

    public boolean deleteJob(String jobId, String userId) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return false;
        }
        Job job = jobOpt.get();
        if (!job.getPostedBy().equals(userId)) {
            throw new SecurityException("You are not authorized to delete this job.");
        }
        jobRepository.delete(job);
        return true;
    }
}
