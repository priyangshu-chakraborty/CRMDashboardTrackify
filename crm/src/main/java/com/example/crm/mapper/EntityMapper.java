package com.example.crm.mapper;

import com.example.crm.dto.*;
import com.example.crm.entity.*;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    // ---------------- USER ----------------
    public UserDTO toUserDTO(User user) {
        if (user == null)
            return null;
        Set<String> roleNames = user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getStatus(),
                roleNames);
    }

    // ---------------- ROLE ----------------
    public RoleDTO toRoleDTO(Role role) {
        if (role == null)
            return null;
        return new RoleDTO(
                role.getRoleId(),
                role.getRoleName(),
                role.getDescription());
    }

    // ---------------- CUSTOMER ----------------
    public CustomerDTO toCustomerDTO(Customer customer) {
        if (customer == null)
            return null;
        return new CustomerDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCompany(),
                customer.getAddress(),
                customer.getCreatedBy() != null ? customer.getCreatedBy().getUsername() : null,
                customer.getCreatedAt());
    }

    // ---------------- DEAL ----------------
    public DealDTO toDealDTO(Deal deal) {
        if (deal == null)
            return null;
        return new DealDTO(
                deal.getDealId(),
                deal.getDealName(),
                deal.getAmount(),
                deal.getStage(),
                deal.getCustomer() != null ? deal.getCustomer().getName() : null,
                deal.getAssignedTo() != null ? deal.getAssignedTo().getUsername() : null,
                deal.getCreatedAt(),
                deal.getUpdatedAt());
    }

    // ---------------- TASK ----------------
    public TaskDTO toTaskDTO(Task task) {
        if (task == null)
            return null;
        return new TaskDTO(
                task.getTaskId(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getDeal() != null ? task.getDeal().getDealName() : null,
                task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : null);
    }

    // ---------------- EMAIL NOTIFICATION ----------------
    public EmailNotificationDTO toEmailNotificationDTO(EmailNotification n) {
        if (n == null)
            return null;
        return new EmailNotificationDTO(
                n.getNotificationId(),
                n.getSentTime(),
                n.getStatus(),
                n.getUser() != null ? n.getUser().getUsername() : null,
                n.getTask() != null ? n.getTask().getTaskId() : null,
                n.getTask() != null ? n.getTask().getDescription() : null);
    }
}
