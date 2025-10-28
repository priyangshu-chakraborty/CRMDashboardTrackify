package com.example.crm.controller;

import com.example.crm.dto.TaskDTO;
import com.example.crm.entity.Task;
import com.example.crm.service.TaskService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Sales, Manager, Admin can view
    @PreAuthorize("hasAnyRole('SALES','MANAGER','ADMIN')")
    @GetMapping
    public List<TaskDTO> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Sales, Manager, Admin can filter
    @PreAuthorize("hasAnyRole('SALES','MANAGER','ADMIN')")
    @GetMapping("/status/{status}")
    public List<TaskDTO> getTasksByStatus(@PathVariable String status) {
        return taskService.getTasksByStatus(status);
    }

    // Only Sales and Manager can create tasks
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping
    public TaskDTO createTask(@RequestBody TaskDTO dto) {
        return taskService.createTask(dto);
    }

    // Only Manager and Admin can update tasks
    @PreAuthorize("hasAnyRole('SALES','MANAGER','ADMIN')")
    @PutMapping("/{id}")
    public TaskDTO updateTask(@PathVariable Long id, @RequestBody TaskDTO dto) {
        return taskService.updateTask(id, dto);
    }

    // Only Admin can delete
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
