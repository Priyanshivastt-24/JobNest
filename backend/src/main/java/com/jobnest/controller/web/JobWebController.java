package com.jobnest.controller.web;

import com.jobnest.entity.Job;
import com.jobnest.entity.User;
import com.jobnest.service.ApplicationService;
import com.jobnest.service.JobService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
public class JobWebController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public JobWebController(JobService jobService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/jobs")
    public String browseJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            Model model,
            HttpSession session) {

        List<Job> jobs = jobService.getJobs(search, location, category, type);

        model.addAttribute("jobs", jobs);
        model.addAttribute("search", search != null ? search : "");
        model.addAttribute("location", location != null ? location : "");
        model.addAttribute("selectedCategory", category != null ? category : "");
        model.addAttribute("selectedType", type != null ? type : "");
        model.addAttribute("totalCount", jobs.size());
        model.addAttribute("currentUser", session.getAttribute("currentUser"));

        return "jobs";
    }

    @GetMapping("/jobs/{id}")
    public String viewJob(@PathVariable String id, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        Optional<Job> jobOpt = jobService.getJobById(id);
        if (jobOpt.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Job not found.");
            return "redirect:/jobs";
        }

        Job job = jobOpt.get();
        User currentUser = (User) session.getAttribute("currentUser");

        boolean hasApplied = false;
        boolean isOwner = false;

        if (currentUser != null) {
            hasApplied = applicationService.hasApplied(job.getId(), currentUser.getId());
            isOwner = job.getPostedBy().equals(currentUser.getId());
        }

        model.addAttribute("job", job);
        model.addAttribute("hasApplied", hasApplied);
        model.addAttribute("isOwner", isOwner);
        model.addAttribute("currentUser", currentUser);

        return "job-details";
    }

    @GetMapping("/post-job")
    public String postJobPage(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Please log in to post a job.");
            return "redirect:/login";
        }
        if (!"employer".equalsIgnoreCase(currentUser.getRole())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Only employer accounts can post jobs.");
            return "redirect:/jobs";
        }

        model.addAttribute("currentUser", currentUser);
        return "post-job";
    }

    @PostMapping("/post-job")
    public String handlePostJob(
            @RequestParam String title,
            @RequestParam String company,
            @RequestParam String location,
            @RequestParam(defaultValue = "Full-time") String type,
            @RequestParam(required = false) String salaryMin,
            @RequestParam(required = false) String salaryMax,
            @RequestParam String description,
            @RequestParam String category,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null || !"employer".equalsIgnoreCase(currentUser.getRole())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Only employers can post jobs.");
            return "redirect:/login";
        }

        try {
            Job job = new Job(
                    title,
                    company,
                    location,
                    type,
                    salaryMin != null ? salaryMin.trim() : "",
                    salaryMax != null ? salaryMax.trim() : "",
                    description,
                    category,
                    currentUser.getId(),
                    currentUser.getName()
            );

            Job saved = jobService.createJob(job);
            redirectAttributes.addFlashAttribute("successMessage", "Job posted successfully!");
            return "redirect:/jobs/" + saved.getId();
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/post-job";
        }
    }

    @PostMapping("/jobs/{id}/apply")
    public String handleApply(
            @PathVariable String id,
            @RequestParam(required = false) String coverLetter,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Please log in as a job seeker to apply.");
            return "redirect:/login";
        }
        if (!"seeker".equalsIgnoreCase(currentUser.getRole())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Only job seekers can apply for jobs.");
            return "redirect:/jobs/" + id;
        }

        try {
            applicationService.apply(id, currentUser.getId(), coverLetter);
            redirectAttributes.addFlashAttribute("successMessage", "Application submitted successfully! Track it in your dashboard.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/jobs/" + id;
    }

    @PostMapping("/jobs/{id}/delete")
    public String handleDeleteJob(@PathVariable String id, HttpSession session, RedirectAttributes redirectAttributes) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser == null) {
            return "redirect:/login";
        }

        try {
            jobService.deleteJob(id, currentUser.getId());
            redirectAttributes.addFlashAttribute("successMessage", "Job successfully deleted.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/dashboard";
    }
}
