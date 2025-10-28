package com.example.crm.repository;

import com.example.crm.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(String status);

    List<Task> findByAssignedTo_UserId(Long userId);

    Optional<Task> findByDescription(String description);
}
