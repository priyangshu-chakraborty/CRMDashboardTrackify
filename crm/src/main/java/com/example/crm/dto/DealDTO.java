package com.example.crm.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DealDTO {
    private Long dealId;
    private String dealName;
    private BigDecimal amount;
    private String stage;
    private String customerName; // from Customer
    private String assignedTo; // username of User
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
