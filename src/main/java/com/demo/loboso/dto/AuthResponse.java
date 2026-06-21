package com.demo.loboso.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String email;
    private String rol;
    
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public AuthResponse(boolean success, String message, String email, String rol) {
        this.success = success;
        this.message = message;
        this.email = email;
        this.rol = rol;
    }
    
    // Getters y Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}