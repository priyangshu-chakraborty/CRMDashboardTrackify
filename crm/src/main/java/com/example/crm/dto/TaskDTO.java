package com.example.crm.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
    private Long taskId;
    private String description;
    private LocalDate dueDate;
    private String status;
    private LocalDateTime createdAt;
    private String dealName; // from Deal
    private String assignedTo; // username of User
}
