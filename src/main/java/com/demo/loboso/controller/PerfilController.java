package com.demo.loboso.controller;

import com.demo.loboso.dto.ChangePasswordRequest;
import com.demo.loboso.dto.UserDTO;
import com.demo.loboso.model.Usuario;
import com.demo.loboso.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final UsuarioService usuarioService;

    public PerfilController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<Usuario> getCurrentUser() {
        Usuario usuario = usuarioService.getCurrentUser();
        return ResponseEntity.ok(usuario);
    }

    @PutMapping
    public ResponseEntity<Usuario> updateCurrentUser(@Valid @RequestBody UserDTO userDTO) {
        Usuario usuario = usuarioService.updateCurrentUser(userDTO);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Usuario currentUser = usuarioService.getCurrentUser();
            usuarioService.changePassword(currentUser.getId(), request);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}