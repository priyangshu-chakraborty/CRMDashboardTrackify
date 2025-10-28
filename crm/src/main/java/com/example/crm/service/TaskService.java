package com.example.crm.service;

import com.example.crm.dto.TaskDTO;
import com.example.crm.entity.Deal;
import com.example.crm.entity.Task;
import com.example.crm.entity.User;
import com.example.crm.mapper.EntityMapper;
import com.example.crm.repository.DealRepository;
import com.example.crm.repository.TaskRepository;
import com.example.crm.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    private final DealRepository dealRepo;
    private final EntityMapper mapper;

    public TaskService(TaskRepository taskRepo, EntityMapper mapper, UserRepository userRepo, DealRepository dealRepo) {
        this.taskRepo = taskRepo;
        this.mapper = mapper;
        this.userRepo = userRepo;
        this.dealRepo = dealRepo;
    }

    public List<TaskDTO> getAllTasks() {
        return taskRepo.findAll().stream()
                .map(mapper::toTaskDTO)
                .toList();
    }

    public List<TaskDTO> getTasksByStatus(String status) {
        return taskRepo.findByStatus(status).stream()
                .map(mapper::toTaskDTO)
                .toList();
    }

   public TaskDTO createTask(TaskDTO dto) {
    // Resolve Deal
    Deal deal = dealRepo.findByDealName(dto.getDealName())
        .orElseThrow(() -> new RuntimeException("Deal not found: " + dto.getDealName()));

    // Resolve User
    User user = userRepo.findByUsername(dto.getAssignedTo())
        .orElseThrow(() -> new RuntimeException("User not found: " + dto.getAssignedTo()));

    // Build Task entity
    Task task = new Task();
    task.setDescription(dto.getDescription());
    task.setDueDate(dto.getDueDate());
    task.setStatus(dto.getStatus());
    task.setCreatedAt(LocalDateTime.now());
    task.setDeal(deal);
    task.setAssignedTo(user);

    Task saved = taskRepo.save(task);
    return mapper.toTaskDTO(saved);
}


    public TaskDTO updateTask(Long id, TaskDTO dto) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));

        // Map fields from DTO to Entity
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setStatus(dto.getStatus());
        return mapper.toTaskDTO(taskRepo.save(task));
    }

    // ✅ Add this
    public void deleteTask(Long id) {
        if (!taskRepo.existsById(id)) {
            throw new RuntimeException("Task not found with id " + id);
        }
        taskRepo.deleteById(id);
    }
}
