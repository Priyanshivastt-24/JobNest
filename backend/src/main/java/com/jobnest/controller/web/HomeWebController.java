package com.jobnest.controller.web;

import com.jobnest.entity.Job;
import com.jobnest.service.JobService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@Controller
public class HomeWebController {

    private final JobService jobService;

    public HomeWebController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        List<Job> featuredJobs = jobService.getFeaturedJobs(6);
        List<Map<String, Object>> categories = jobService.getCategoryCounts();

        model.addAttribute("featuredJobs", featuredJobs);
        model.addAttribute("categories", categories);
        model.addAttribute("currentUser", session.getAttribute("currentUser"));

        return "index";
    }
}
