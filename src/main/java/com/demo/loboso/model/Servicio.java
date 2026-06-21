package com.demo.loboso.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(length = 1000)
    private String descripcionLarga;

    @Column(length = 500)
    private String imagenUrl;

    @Column(length = 500)
    private String imagenPublicId;

    @ElementCollection
    @CollectionTable(name = "servicio_caracteristicas", joinColumns = @JoinColumn(name = "servicio_id"))
    @Column(name = "caracteristica")
    private List<String> caracteristicas = new ArrayList<>();

    private Double precioBase;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "orden")
    private Integer orden = 0;

    @Column(name = "whatsapp_message")
    private String whatsappMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructores
    public Servicio() {}

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}