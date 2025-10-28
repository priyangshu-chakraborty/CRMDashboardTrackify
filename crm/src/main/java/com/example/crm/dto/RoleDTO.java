package com.example.crm.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    private Long roleId;
    private String roleName;
    private String description;
}
