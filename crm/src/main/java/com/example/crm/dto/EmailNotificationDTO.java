package com.example.crm.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailNotificationDTO {
    private Long notificationId;
    private LocalDateTime sentTime;
    private String status;

    // For resolving entities
    private String username; // from User (unique username is fine)
    private Long taskId; // safer than description for lookup

    // For returning to frontend
    private String taskDescription; // filled when mapping entity → DTO
}
