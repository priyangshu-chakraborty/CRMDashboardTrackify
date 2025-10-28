package com.example.crm.service;

import com.example.crm.dto.EmailNotificationDTO;
import com.example.crm.entity.EmailNotification;
import com.example.crm.entity.Task;
import com.example.crm.entity.User;
import com.example.crm.mapper.EntityMapper;
import com.example.crm.repository.EmailNotificationRepository;
import com.example.crm.repository.TaskRepository;
import com.example.crm.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class EmailNotificationService {

    private final EmailNotificationRepository notificationRepo;
    private final EntityMapper mapper;
    private final UserRepository userRepo;
    private final TaskRepository taskRepo;
    private final JavaMailSender mailSender;

    public EmailNotificationService(EmailNotificationRepository notificationRepo,
            EntityMapper mapper,
            UserRepository userRepo,
            TaskRepository taskRepo,
            JavaMailSender mailSender) {
        this.notificationRepo = notificationRepo;
        this.mapper = mapper;
        this.userRepo = userRepo;
        this.taskRepo = taskRepo;
        this.mailSender = mailSender;
    }

    public List<EmailNotificationDTO> getAllNotifications() {
        return notificationRepo.findAll().stream()
                .map(mapper::toEmailNotificationDTO)
                .toList();
    }

    public List<EmailNotificationDTO> getNotificationsByStatus(String status) {
        return notificationRepo.findByStatus(status).stream()
                .map(mapper::toEmailNotificationDTO)
                .toList();
    }

    public EmailNotificationDTO saveNotification(EmailNotificationDTO dto) {
        // Resolve entities
        User user = userRepo.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUsername()));

        Task task = taskRepo.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + dto.getTaskId()));

        EmailNotification notification = new EmailNotification();
        notification.setUser(user);
        notification.setTask(task);
        notification.setStatus("Pending");
        notification.setSentTime(LocalDateTime.now());

        EmailNotification saved = notificationRepo.save(notification);

        // Collect recipients
        List<String> recipients = new ArrayList<>();
        if (user.getEmail() != null)
            recipients.add(user.getEmail());
        if (task.getAssignedTo() != null && task.getAssignedTo().getEmail() != null
                && !Objects.equals(task.getAssignedTo().getEmail(), user.getEmail())) {
            recipients.add(task.getAssignedTo().getEmail());
        }

        if (!recipients.isEmpty()) {
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(recipients.toArray(new String[0]));
                msg.setFrom("priyangshuchakraborty4@gmail.com"); // important for some SMTP providers
                msg.setSubject(
                        "Notification: " + (task.getDescription() != null ? task.getDescription() : "Task Update"));
                msg.setText(
                        "Task: " + (task.getDescription() != null ? task.getDescription() : "(no description)") + "\n"
                                + "Status: " + saved.getStatus() + "\n\n"
                                + "This is an automated message from your CRM.");

                mailSender.send(msg);

                saved.setStatus("Sent");
                saved.setSentTime(LocalDateTime.now());
                saved = notificationRepo.save(saved);
            } catch (Exception ex) {
                saved.setStatus("Failed");
                saved = notificationRepo.save(saved);
            }
        } else {
            saved.setStatus("Failed");
            saved = notificationRepo.save(saved);
        }

        return mapper.toEmailNotificationDTO(saved);
    }

    // ✅ Update notification using DTO
    public EmailNotificationDTO updateNotification(Long id, EmailNotificationDTO dto) {
        EmailNotification existing = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id " + id));

        existing.setStatus(dto.getStatus());
        existing.setSentTime(dto.getSentTime());

        // Map username → User entity
        if (dto.getUsername() != null) {
            existing.setUser(userRepo.findByUsername(dto.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUsername())));
        }

        // Map taskDescription → Task entity
        if (dto.getTaskDescription() != null) {
            existing.setTask(taskRepo.findByDescription(dto.getTaskDescription())
                    .orElseThrow(() -> new RuntimeException("Task not found: " + dto.getTaskDescription())));
        }

        return mapper.toEmailNotificationDTO(notificationRepo.save(existing));
    }

    // ✅ Delete notification
    public void deleteNotification(Long id) {
        if (!notificationRepo.existsById(id)) {
            throw new RuntimeException("Notification not found with id " + id);
        }
        notificationRepo.deleteById(id);
    }
}
