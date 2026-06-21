package com.demo.loboso.controller;

import com.demo.loboso.model.Servicio;
import com.demo.loboso.service.ServicioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioPublicApiController {

    private final ServicioService servicioService;

    public ServicioPublicApiController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Servicio>> getServiciosActivos() {
        List<Servicio> servicios = servicioService.getAllServiciosActivos();
        return ResponseEntity.ok(servicios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> getServicio(@PathVariable Long id) {
        Servicio servicio = servicioService.getServicioById(id);
        return ResponseEntity.ok(servicio);
    }
}