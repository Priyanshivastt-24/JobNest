package com.jobnest.controller.web;

import com.jobnest.entity.User;
import com.jobnest.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
public class AuthWebController {

    private final UserService userService;

    public AuthWebController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String loginPage(HttpSession session, Model model) {
        if (session.getAttribute("currentUser") != null) {
            return "redirect:/dashboard";
        }
        return "login";
    }

    @PostMapping("/login")
    public String handleLogin(
            @RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        Optional<User> userOpt = userService.authenticateUser(email, password);
        if (userOpt.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Invalid email or password.");
            return "redirect:/login";
        }

        User user = userOpt.get();
        session.setAttribute("currentUser", user);
        redirectAttributes.addFlashAttribute("successMessage", "Welcome back, " + user.getName() + "!");
        return "redirect:/dashboard";
    }

    @GetMapping("/register")
    public String registerPage(HttpSession session, Model model) {
        if (session.getAttribute("currentUser") != null) {
            return "redirect:/dashboard";
        }
        return "register";
    }

    @PostMapping("/register")
    public String handleRegister(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(defaultValue = "seeker") String role,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        try {
            User user = userService.registerUser(name, email, password, role);
            session.setAttribute("currentUser", user);
            redirectAttributes.addFlashAttribute("successMessage", "Account created successfully! Welcome to JobNest.");
            return "redirect:/dashboard";
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/register";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        session.invalidate();
        redirectAttributes.addFlashAttribute("successMessage", "You have been logged out.");
        return "redirect:/";
    }
}
