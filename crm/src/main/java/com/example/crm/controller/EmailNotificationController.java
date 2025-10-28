package com.example.crm.controller;

import com.example.crm.dto.EmailNotificationDTO;
import com.example.crm.entity.EmailNotification;
import com.example.crm.service.EmailNotificationService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/notifications")
public class EmailNotificationController {

    private final EmailNotificationService notificationService;

    public EmailNotificationController(EmailNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Manager and Admin can view all notifications
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping
    public List<EmailNotificationDTO> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    // Manager and Admin can filter by status
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/status/{status}")
    public List<EmailNotificationDTO> getByStatus(@PathVariable String status) {
        return notificationService.getNotificationsByStatus(status);
    }

    // Only Admin can create notifications manually
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public EmailNotificationDTO createNotification(@RequestBody EmailNotificationDTO dto) {
        return notificationService.saveNotification(dto);
    }



    // Update notification status (Manager, Admin)
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{id}")
    public EmailNotificationDTO updateNotification(@PathVariable Long id, @RequestBody EmailNotificationDTO dto) {
        return notificationService.updateNotification(id, dto);
    }

    // Delete notification (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }

}
