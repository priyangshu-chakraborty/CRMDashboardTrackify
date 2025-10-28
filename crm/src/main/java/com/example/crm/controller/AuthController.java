package com.example.crm.controller;

import com.example.crm.config.JwtUtil;
import com.example.crm.dto.UserDTO;
import com.example.crm.entity.User;
import com.example.crm.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO dto,
            Authentication authentication) {
        Collection<String> callerRoles = new ArrayList<>();

        if (authentication != null && authentication.isAuthenticated()) {
            callerRoles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
        }

        UserDTO saved = userService.registerUser(dto, callerRoles);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<UserDTO> updateUserRoles(@PathVariable Long id, @RequestBody Set<String> roles) {
        return ResponseEntity.ok(userService.updateUserRoles(id, roles));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Authenticate using Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        // Extract username and roles
        String authenticatedUsername = authentication.getName();
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        // Generate JWT with username + roles
        String token = jwtUtil.generateToken(authenticatedUsername, roles);

        // Fetch full user data
        UserDTO userDTO = userService.getUserByUsername(authenticatedUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build response
        Map<String, Object> response = Map.of(
                "token", token,
                "user", userDTO);

        return ResponseEntity.ok(response);
    }

    // List all users (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get current user profile (any authenticated user)
    @GetMapping("/api/auth/me")
    public UserDTO getCurrentUser(Authentication authentication) {
        return userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
