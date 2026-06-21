package com.demo.loboso.service;

import com.demo.loboso.dto.ServicioDTO;
import com.demo.loboso.model.Servicio;
import com.demo.loboso.repository.ServicioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final CloudinaryService cloudinaryService;

    public ServicioService(ServicioRepository servicioRepository, CloudinaryService cloudinaryService) {
        this.servicioRepository = servicioRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public List<Servicio> getAllServiciosActivos() {
        return servicioRepository.findByActivoTrueOrderByOrdenAsc();
    }

    public Page<Servicio> getAllServicios(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orden").ascending());
        
        if (search != null && !search.isEmpty()) {
            return servicioRepository.findByNombreContainingIgnoreCase(search, pageable);
        }
        
        return servicioRepository.findAll(pageable);
    }

    public Servicio getServicioById(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }

    @Transactional
    public Servicio createServicio(ServicioDTO servicioDTO, MultipartFile imagen) throws IOException {
        Servicio servicio = new Servicio();
        servicio.setNombre(servicioDTO.getNombre());
        servicio.setDescripcion(servicioDTO.getDescripcion());
        servicio.setDescripcionLarga(servicioDTO.getDescripcionLarga());
        servicio.setCaracteristicas(servicioDTO.getCaracteristicas());
        servicio.setPrecioBase(servicioDTO.getPrecioBase());
        servicio.setActivo(servicioDTO.getActivo() != null ? servicioDTO.getActivo() : true);
        servicio.setOrden(servicioDTO.getOrden() != null ? servicioDTO.getOrden() : 0);
        servicio.setWhatsappMessage(servicioDTO.getWhatsappMessage());
        
        if (imagen != null && !imagen.isEmpty()) {
            String publicId = "servicio_" + System.currentTimeMillis();
            var uploadResult = cloudinaryService.uploadImage(imagen, publicId);
            servicio.setImagenUrl((String) uploadResult.get("secure_url"));
            servicio.setImagenPublicId((String) uploadResult.get("public_id"));
        }
        
        return servicioRepository.save(servicio);
    }

    @Transactional
    public Servicio updateServicio(Long id, ServicioDTO servicioDTO, MultipartFile imagen) throws IOException {
        Servicio servicio = getServicioById(id);
        
        servicio.setNombre(servicioDTO.getNombre());
        servicio.setDescripcion(servicioDTO.getDescripcion());
        servicio.setDescripcionLarga(servicioDTO.getDescripcionLarga());
        servicio.setCaracteristicas(servicioDTO.getCaracteristicas());
        servicio.setPrecioBase(servicioDTO.getPrecioBase());
        servicio.setActivo(servicioDTO.getActivo());
        servicio.setOrden(servicioDTO.getOrden());
        servicio.setWhatsappMessage(servicioDTO.getWhatsappMessage());
        
        if (imagen != null && !imagen.isEmpty()) {
            // Eliminar imagen anterior si existe
            if (servicio.getImagenPublicId() != null) {
                cloudinaryService.deleteImage(servicio.getImagenPublicId());
            }
            
            String publicId = "servicio_" + id + "_" + System.currentTimeMillis();
            var uploadResult = cloudinaryService.uploadImage(imagen, publicId);
            servicio.setImagenUrl((String) uploadResult.get("secure_url"));
            servicio.setImagenPublicId((String) uploadResult.get("public_id"));
        }
        
        return servicioRepository.save(servicio);
    }

    @Transactional
    public void deleteServicio(Long id) throws IOException {
        Servicio servicio = getServicioById(id);
        
        if (servicio.getImagenPublicId() != null) {
            cloudinaryService.deleteImage(servicio.getImagenPublicId());
        }
        
        servicioRepository.delete(servicio);
    }

    @Transactional
    public void toggleServicioStatus(Long id) {
        Servicio servicio = getServicioById(id);
        servicio.setActivo(!servicio.getActivo());
        servicioRepository.save(servicio);
    }

    public long getTotalServicios() {
        return servicioRepository.count();
    }

    public long getServiciosActivos() {
        return servicioRepository.countByActivoTrue();
    }
}