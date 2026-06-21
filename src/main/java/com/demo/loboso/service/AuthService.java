package com.demo.loboso.service;

import com.demo.loboso.dto.RegisterRequest;
import com.demo.loboso.model.Usuario;
import com.demo.loboso.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean registerUser(RegisterRequest request) {
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return false;
        }
        
        // Verificar que las contraseñas coincidan
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return false;
        }
        
        // Crear nuevo usuario
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol("ROLE_USER")
                .activo(true)
                .build();
        
        usuarioRepository.save(usuario);
        return true;
    }
    
    public boolean registerAdmin(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return false;
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return false;
        }
        
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol("ROLE_ADMIN")
                .activo(true)
                .build();
        
        usuarioRepository.save(usuario);
        return true;
    }
}