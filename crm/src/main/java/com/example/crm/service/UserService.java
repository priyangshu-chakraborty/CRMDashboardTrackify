package com.example.crm.service;

import com.example.crm.dto.UserDTO;
import com.example.crm.entity.Role;
import com.example.crm.entity.User;
import com.example.crm.mapper.EntityMapper;
import com.example.crm.repository.RoleRepository;
import com.example.crm.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final EntityMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, RoleRepository roleRepo,
            EntityMapper mapper, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(mapper::toUserDTO)
                .toList();
    }

    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepo.findByUsername(username).map(mapper::toUserDTO);
    }

    public UserDTO registerUser(UserDTO dto, Collection<String> callerRoles) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setStatus("ACTIVE");

        Set<Role> rolesToAssign = new HashSet<>();

        if (dto.getRoles() == null || dto.getRoles().isEmpty()) {
            // default role
            Role sales = roleRepo.findByRoleName("ROLE_SALES")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            rolesToAssign.add(sales);
        } else {
            for (String roleName : dto.getRoles()) {
                // Only Admins can assign MANAGER or ADMIN
                if ((roleName.equals("ROLE_MANAGER") || roleName.equals("ROLE_ADMIN"))
                        && !callerRoles.contains("ROLE_ADMIN")) {
                    // downgrade to sales if caller is not admin
                    Role sales = roleRepo.findByRoleName("ROLE_SALES")
                            .orElseThrow(() -> new RuntimeException("Default role not found"));
                    rolesToAssign.add(sales);
                } else {
                    Role role = roleRepo.findByRoleName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                    rolesToAssign.add(role);
                }
            }
        }

        user.setRoles(rolesToAssign);
        return mapper.toUserDTO(userRepo.save(user));
    }

    public UserDTO updateUserRoles(Long userId, Set<String> roleNames) {
    User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

    Set<Role> roles = roleNames.stream()
            .map(roleName -> {
                // Normalize: ensure DB lookup always uses ROLE_ prefix
                String normalized = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
                return roleRepo.findByRoleName(normalized)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + normalized));
            })
            .collect(Collectors.toSet());

    user.setRoles(roles);
    return mapper.toUserDTO(userRepo.save(user));
    }

}
