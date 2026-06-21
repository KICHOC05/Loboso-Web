package com.demo.loboso.repository;

import com.demo.loboso.model.Servicio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    
    List<Servicio> findByActivoTrueOrderByOrdenAsc();
    
    Page<Servicio> findByActivoTrue(Pageable pageable);
    
    Page<Servicio> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    
    @Modifying
    @Transactional
    @Query("UPDATE Servicio s SET s.activo = :activo WHERE s.id = :id")
    void updateActivoStatus(@Param("id") Long id, @Param("activo") boolean activo);
    
    long countByActivoTrue();
}