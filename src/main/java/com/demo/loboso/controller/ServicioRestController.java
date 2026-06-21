package com.demo.loboso.controller;

import com.demo.loboso.dto.ServicioDTO;
import com.demo.loboso.model.Servicio;
import com.demo.loboso.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/servicios")
@PreAuthorize("hasRole('ADMIN')")
public class ServicioRestController {

    private final ServicioService servicioService;

    public ServicioRestController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping
    public ResponseEntity<Page<Servicio>> getServicios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        Page<Servicio> servicios = servicioService.getAllServicios(page, size, search);
        return ResponseEntity.ok(servicios);
    }

    @GetMapping("/activos")
    public ResponseEntity<?> getServiciosActivos() {
        return ResponseEntity.ok(servicioService.getAllServiciosActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> getServicio(@PathVariable Long id) {
        Servicio servicio = servicioService.getServicioById(id);
        return ResponseEntity.ok(servicio);
    }

    @PostMapping
    public ResponseEntity<?> createServicio(
            @Valid @RequestPart("servicio") ServicioDTO servicioDTO,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Servicio servicio = servicioService.createServicio(servicioDTO, imagen);
            return ResponseEntity.status(HttpStatus.CREATED).body(servicio);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateServicio(
            @PathVariable Long id,
            @Valid @RequestPart("servicio") ServicioDTO servicioDTO,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Servicio servicio = servicioService.updateServicio(id, servicioDTO, imagen);
            return ResponseEntity.ok(servicio);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteServicio(@PathVariable Long id) {
        try {
            servicioService.deleteServicio(id);
            return ResponseEntity.ok(Map.of("message", "Servicio eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleServicioStatus(@PathVariable Long id) {
        try {
            servicioService.toggleServicioStatus(id);
            return ResponseEntity.ok(Map.of("message", "Estado del servicio actualizado"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}