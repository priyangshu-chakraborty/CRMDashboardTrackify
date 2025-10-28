package com.example.crm.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {
    private Long customerId;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String address;
    private String createdBy; // username of creator
    private LocalDateTime createdAt;
}
