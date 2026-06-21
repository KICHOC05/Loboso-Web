package com.demo.loboso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("titulo", "Dashboard Administrativo");
        return "admin/dashboard";
    }
    
    @GetMapping("/usuarios")
    public String usuarios(Model model) {
        model.addAttribute("titulo", "Gestión de Usuarios");
        return "admin/usuarios";
    }
    
    @GetMapping("/servicios")
    public String servicios(Model model) {
        model.addAttribute("titulo", "Gestión de Servicios");
        return "admin/servicios";
    }
    
    @GetMapping("/perfil")
    public String perfil(Model model) {
        model.addAttribute("titulo", "Perfil del Administrador");
        return "admin/perfil";
    }
}