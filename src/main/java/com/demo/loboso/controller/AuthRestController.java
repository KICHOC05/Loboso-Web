package com.demo.loboso.controller;

import com.demo.loboso.dto.AuthResponse;
import com.demo.loboso.dto.LoginRequest;
import com.demo.loboso.dto.RegisterRequest;
import com.demo.loboso.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final AuthService authService;

    public AuthRestController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Las contraseñas no coinciden"));
        }
        
        boolean registered = authService.registerUser(request);
        
        if (registered) {
            return ResponseEntity.ok(new AuthResponse(true, "Usuario registrado exitosamente"));
        } else {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "El email ya está registrado"));
        }
    }
}