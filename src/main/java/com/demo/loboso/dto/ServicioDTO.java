package com.demo.loboso.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ServicioDTO {
    
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    @Size(max = 1000, message = "La descripción larga no puede exceder 1000 caracteres")
    private String descripcionLarga;
    
    private String imagenUrl;
    
    private String imagenPublicId;
    
    private List<String> caracteristicas;
    
    private Double precioBase;
    
    private Boolean activo;
    
    private Integer orden;
    
    private String whatsappMessage;
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public String getDescripcionLarga() { return descripcionLarga; }
    public void setDescripcionLarga(String descripcionLarga) { this.descripcionLarga = descripcionLarga; }
    
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    
    public String getImagenPublicId() { return imagenPublicId; }
    public void setImagenPublicId(String imagenPublicId) { this.imagenPublicId = imagenPublicId; }
    
    public List<String> getCaracteristicas() { return caracteristicas; }
    public void setCaracteristicas(List<String> caracteristicas) { this.caracteristicas = caracteristicas; }
    
    public Double getPrecioBase() { return precioBase; }
    public void setPrecioBase(Double precioBase) { this.precioBase = precioBase; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    
    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
    
    public String getWhatsappMessage() { return whatsappMessage; }
    public void setWhatsappMessage(String whatsappMessage) { this.whatsappMessage = whatsappMessage; }
}