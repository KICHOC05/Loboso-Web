package com.demo.loboso.config;

import com.demo.loboso.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class securityConfig {

    private final CustomUserDetailsService userDetailsService;

    public securityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new SimpleUrlAuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, 
                                                HttpServletResponse response,
                                                Authentication authentication) throws IOException {
                
                boolean isAdmin = authentication.getAuthorities()
                        .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
                
                if (isAdmin) {
                    response.sendRedirect("/admin/dashboard");
                } else {
                    response.sendRedirect("/");
                }
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authenticationProvider(authProvider())
            .authorizeHttpRequests(auth -> auth
                // 🔹 RUTAS PÚBLICAS (agregar /api/** y /public/**)
                .requestMatchers(
                    "/", 
                    "/login", 
                    "/registro", 
                    "/css/**", 
                    "/js/**", 
                    "/img/**", 
                    "/api/auth/**",
                    "/api/**",           // Permite TODAS las APIs
                    "/public/**",        // Para APIs públicas alternativas
                    "/api/servicios/**"  // Específicamente para servicios
                ).permitAll()
                
                // 🔹 RUTAS ADMIN
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // 🔹 TODO LO DEMÁS REQUIERE AUTENTICACIÓN
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .successHandler(successHandler())
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .rememberMe(remember -> remember
                .key("loboso-secret-key-2025")
                .tokenValiditySeconds(86400 * 7)
                .userDetailsService(userDetailsService)
                .rememberMeParameter("remember-me")
            );

        return http.build();
    }
}