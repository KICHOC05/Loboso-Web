package com.demo.loboso.controller;

import com.demo.loboso.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminApiController {

    private final UsuarioService usuarioService;

    public AdminApiController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioService.getTotalUsuarios());
        stats.put("usuariosActivos", usuarioService.getUsuariosActivos());
        stats.put("totalServicios", 5);
        stats.put("usuariosAdmin", usuarioService.getUsuariosAdmin());
        stats.put("usuariosNormales", usuarioService.getUsuariosNormales());
        return ResponseEntity.ok(stats);
    }
}