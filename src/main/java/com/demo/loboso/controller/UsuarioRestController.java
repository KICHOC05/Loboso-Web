package com.demo.loboso.controller;

import com.demo.loboso.dto.ChangePasswordRequest;
import com.demo.loboso.dto.UserDTO;
import com.demo.loboso.model.Usuario;
import com.demo.loboso.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioRestController {

    private final UsuarioService usuarioService;

    public UsuarioRestController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<Page<Usuario>> getUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) Boolean activo) {
        
        Page<Usuario> usuarios = usuarioService.getAllUsuarios(page, size, search, rol, activo);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioService.getUsuarioById(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@Valid @RequestBody UserDTO userDTO) {
        try {
            Usuario usuario = usuarioService.createUsuario(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        try {
            Usuario usuario = usuarioService.updateUsuario(id, userDTO);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        try {
            usuarioService.deleteUsuario(id);
            return ResponseEntity.ok(Map.of("message", "Usuario eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUsuarioStatus(@PathVariable Long id) {
        try {
            usuarioService.toggleUsuarioStatus(id);
            return ResponseEntity.ok(Map.of("message", "Estado del usuario actualizado"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePasswordByAdmin(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("password");
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
            }
            usuarioService.changePasswordByAdmin(id, newPassword);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}