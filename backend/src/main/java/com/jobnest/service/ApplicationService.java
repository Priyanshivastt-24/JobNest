package com.jobnest.service;

import com.jobnest.entity.Application;
import com.jobnest.entity.Job;
import com.jobnest.entity.User;
import com.jobnest.repository.ApplicationRepository;
import com.jobnest.repository.JobRepository;
import com.jobnest.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Application apply(String jobId, String applicantId, String coverLetter) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            throw new NoSuchElementException("Job not found.");
        }

        if (applicationRepository.existsByJobIdAndApplicantId(jobId, applicantId)) {
            throw new IllegalStateException("You have already applied to this job.");
        }

        Application application = new Application(jobId, applicantId, coverLetter != null ? coverLetter.trim() : "");
        return applicationRepository.save(application);
    }

    public List<Map<String, Object>> getApplicationsByApplicant(String applicantId) {
        List<Application> apps = applicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicantId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Application app : apps) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", app.getId());
            map.put("jobId", app.getJobId());
            map.put("applicantId", app.getApplicantId());
            map.put("coverLetter", app.getCoverLetter());
            map.put("status", app.getStatus());
            map.put("appliedAt", app.getAppliedAt());

            Optional<Job> jobOpt = jobRepository.findById(app.getJobId());
            map.put("job", jobOpt.orElse(null));

            result.add(map);
        }

        return result;
    }

    public List<Map<String, Object>> getApplicationsByJob(String jobId, String employerId) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            throw new NoSuchElementException("Job not found.");
        }

        Job job = jobOpt.get();
        if (!job.getPostedBy().equals(employerId)) {
            throw new SecurityException("Not authorized to view applicants for this job.");
        }

        List<Application> apps = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Application app : apps) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", app.getId());
            map.put("jobId", app.getJobId());
            map.put("applicantId", app.getApplicantId());
            map.put("coverLetter", app.getCoverLetter());
            map.put("status", app.getStatus());
            map.put("appliedAt", app.getAppliedAt());

            Optional<User> userOpt = userRepository.findById(app.getApplicantId());
            if (userOpt.isPresent()) {
                User u = userOpt.get();
                Map<String, Object> applicantInfo = new HashMap<>();
                applicantInfo.put("id", u.getId());
                applicantInfo.put("name", u.getName());
                applicantInfo.put("email", u.getEmail());
                map.put("applicant", applicantInfo);
            } else {
                map.put("applicant", null);
            }

            result.add(map);
        }

        return result;
    }

    public boolean hasApplied(String jobId, String applicantId) {
        if (jobId == null || applicantId == null) return false;
        return applicationRepository.existsByJobIdAndApplicantId(jobId, applicantId);
    }

    public Application updateStatus(String applicationId, String status) {
        List<String> validStatuses = Arrays.asList("pending", "reviewed", "accepted", "rejected");
        if (!validStatuses.contains(status)) {
            throw new IllegalArgumentException("Invalid application status: " + status);
        }

        Optional<Application> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            throw new NoSuchElementException("Application not found.");
        }

        Application application = appOpt.get();
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
