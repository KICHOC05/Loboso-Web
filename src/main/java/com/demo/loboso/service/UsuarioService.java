package com.demo.loboso.service;

import com.demo.loboso.dto.ChangePasswordRequest;
import com.demo.loboso.dto.UserDTO;
import com.demo.loboso.model.Usuario;
import com.demo.loboso.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<Usuario> getAllUsuarios(int page, int size, String search, String rol, Boolean activo) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        if (search != null && !search.isEmpty()) {
            return usuarioRepository.findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        }
        
        if (rol != null && !rol.isEmpty()) {
            return usuarioRepository.findByRol(rol, pageable);
        }
        
        if (activo != null) {
            if (activo) {
                return usuarioRepository.findByActivoTrue(pageable);
            }
        }
        
        return usuarioRepository.findAll(pageable);
    }

    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    @Transactional
    public Usuario createUsuario(UserDTO userDTO) {
        if (usuarioRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + userDTO.getEmail());
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombre(userDTO.getNombre());
        usuario.setEmail(userDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        usuario.setRol(userDTO.getRol() != null ? userDTO.getRol() : "ROLE_USER");
        usuario.setActivo(userDTO.isActivo());
        
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario updateUsuario(Long id, UserDTO userDTO) {
        Usuario usuario = getUsuarioById(id);
        
        // Verificar si el email ya existe para otro usuario
        if (!usuario.getEmail().equals(userDTO.getEmail()) && 
            usuarioRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + userDTO.getEmail());
        }
        
        usuario.setNombre(userDTO.getNombre());
        usuario.setEmail(userDTO.getEmail());
        usuario.setRol(userDTO.getRol());
        usuario.setActivo(userDTO.isActivo());
        
        // Si se proporciona una nueva contraseña, actualizarla
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void deleteUsuario(Long id) {
        Usuario usuario = getUsuarioById(id);
        usuarioRepository.delete(usuario);
    }

    @Transactional
    public void toggleUsuarioStatus(Long id) {
        Usuario usuario = getUsuarioById(id);
        usuario.setActivo(!usuario.isActivo());
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        Usuario usuario = getUsuarioById(id);
        
        // Verificar contraseña actual
        if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        
        // Verificar que las nuevas contraseñas coincidan
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Las nuevas contraseñas no coinciden");
        }
        
        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void changePasswordByAdmin(Long id, String newPassword) {
        Usuario usuario = getUsuarioById(id);
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
    }

    public long getTotalUsuarios() {
        return usuarioRepository.count();
    }

    public long getUsuariosActivos() {
        return usuarioRepository.countByActivoTrue();
    }

    public long getUsuariosAdmin() {
        return usuarioRepository.countByRol("ROLE_ADMIN");
    }

    public long getUsuariosNormales() {
        return usuarioRepository.countByRol("ROLE_USER");
    }

    public Usuario getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    @Transactional
    public Usuario updateCurrentUser(UserDTO userDTO) {
        Usuario currentUser = getCurrentUser();
        currentUser.setNombre(userDTO.getNombre());
        currentUser.setEmail(userDTO.getEmail());
        return usuarioRepository.save(currentUser);
    }
}