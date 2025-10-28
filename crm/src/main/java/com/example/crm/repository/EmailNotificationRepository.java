package com.example.crm.repository;

import com.example.crm.entity.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {
    List<EmailNotification> findByStatus(String status);

    List<EmailNotification> findByUser_UserId(Long userId);
}
