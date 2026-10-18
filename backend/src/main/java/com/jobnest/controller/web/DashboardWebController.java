package com.jobnest.controller.web;

import com.jobnest.entity.Job;
import com.jobnest.entity.User;
import com.jobnest.service.ApplicationService;
import com.jobnest.service.JobService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;

@Controller
public class DashboardWebController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public DashboardWebController(JobService jobService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Please log in to access your dashboard.");
            return "redirect:/login";
        }

        model.addAttribute("currentUser", currentUser);

        if ("employer".equalsIgnoreCase(currentUser.getRole())) {
            // Employer view
            List<Job> myJobs = jobService.getJobsByPoster(currentUser.getId());
            model.addAttribute("myJobs", myJobs);

            // Fetch applicants for each posted job
            Map<String, List<Map<String, Object>>> jobApplicantsMap = new HashMap<>();
            int totalApplications = 0;
            int pendingCount = 0;
            int acceptedCount = 0;

            for (Job job : myJobs) {
                List<Map<String, Object>> apps = applicationService.getApplicationsByJob(job.getId(), currentUser.getId());
                jobApplicantsMap.put(job.getId(), apps);
                totalApplications += apps.size();

                for (Map<String, Object> app : apps) {
                    String status = (String) app.get("status");
                    if ("pending".equalsIgnoreCase(status)) pendingCount++;
                    if ("accepted".equalsIgnoreCase(status)) acceptedCount++;
                }
            }

            model.addAttribute("jobApplicantsMap", jobApplicantsMap);
            model.addAttribute("totalApplications", totalApplications);
            model.addAttribute("pendingCount", pendingCount);
            model.addAttribute("acceptedCount", acceptedCount);

        } else {
            // Seeker view
            List<Map<String, Object>> myApplications = applicationService.getApplicationsByApplicant(currentUser.getId());
            model.addAttribute("myApplications", myApplications);

            int pendingCount = 0;
            int reviewedCount = 0;
            int acceptedCount = 0;

            for (Map<String, Object> app : myApplications) {
                String status = (String) app.get("status");
                if ("pending".equalsIgnoreCase(status)) pendingCount++;
                if ("reviewed".equalsIgnoreCase(status)) reviewedCount++;
                if ("accepted".equalsIgnoreCase(status)) acceptedCount++;
            }

            model.addAttribute("totalApplied", myApplications.size());
            model.addAttribute("pendingCount", pendingCount);
            model.addAttribute("reviewedCount", reviewedCount);
            model.addAttribute("acceptedCount", acceptedCount);
        }

        return "dashboard";
    }

    @PostMapping("/applications/{id}/status")
    public String updateApplicationStatus(
            @PathVariable String id,
            @RequestParam String status,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null || !"employer".equalsIgnoreCase(currentUser.getRole())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Unauthorized action.");
            return "redirect:/login";
        }

        try {
            applicationService.updateStatus(id, status);
            redirectAttributes.addFlashAttribute("successMessage", "Applicant status updated to " + status.toUpperCase() + ".");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/dashboard";
    }
}
