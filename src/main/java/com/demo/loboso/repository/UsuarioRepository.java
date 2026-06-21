package com.demo.loboso.repository;

import com.demo.loboso.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    long countByActivoTrue();
    
    long countByRol(String rol);
    
    Page<Usuario> findByActivoTrue(Pageable pageable);
    
    Page<Usuario> findByRol(String rol, Pageable pageable);
    
    Page<Usuario> findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCase(String nombre, String email, Pageable pageable);
}