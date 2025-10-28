package com.example.crm.controller;

import com.example.crm.dto.DealDTO;
import com.example.crm.entity.Deal;
import com.example.crm.service.DealService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    // Sales, Manager, Admin can view
    @PreAuthorize("hasAnyRole('SALES','MANAGER','ADMIN')")
    @GetMapping
    public List<DealDTO> getAllDeals() {
        return dealService.getAllDeals();
    }

    // Sales, Manager, Admin can filter by stage
    @PreAuthorize("hasAnyRole('SALES','MANAGER','ADMIN')")
    @GetMapping("/stage/{stage}")
    public List<DealDTO> getDealsByStage(@PathVariable String stage) {
        return dealService.getDealsByStage(stage);
    }

    // Only Manager and Admin can create
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PostMapping
    public DealDTO createDeal(@RequestBody DealDTO dto) {
        return dealService.createDeal(dto);
    }


    // Only Admin can delete
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
    }

    // Get single deal (Sales, Manager, Admin)
    @PreAuthorize("hasAnyRole('SALES','MANAGER','ADMIN')")
    @GetMapping("/{id}")
    public DealDTO getDealById(@PathVariable Long id) {
        return dealService.getDealById(id);
    }

    // Update deal (Manager, Admin)
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @PutMapping("/{id}")
    public DealDTO updateDeal(@PathVariable Long id, @RequestBody DealDTO dto) {
        return dealService.updateDeal(id, dto);
    }

}
