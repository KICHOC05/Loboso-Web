package com.demo.loboso.controller;

import com.demo.loboso.dto.AuthResponse;
import com.demo.loboso.dto.LoginRequest;
import com.demo.loboso.dto.RegisterRequest;
import com.demo.loboso.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                            @RequestParam(value = "logout", required = false) String logout,
                            Model model) {
        if (error != null) {
            model.addAttribute("error", "Email o contraseña incorrectos");
        }
        if (logout != null) {
            model.addAttribute("message", "Has cerrado sesión exitosamente");
        }
        return "login";
    }

    @GetMapping("/registro")
    public String registerPage(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "registro";
    }

    @PostMapping("/registro")
    public String registerUser(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                               BindingResult result,
                               Model model) {
        
        if (result.hasErrors()) {
            return "registro";
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            model.addAttribute("error", "Las contraseñas no coinciden");
            return "registro";
        }
        
        boolean registered = authService.registerUser(request);
        
        if (registered) {
            return "redirect:/login?registered";
        } else {
            model.addAttribute("error", "El email ya está registrado");
            return "registro";
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        return "dashboard";
    }
}