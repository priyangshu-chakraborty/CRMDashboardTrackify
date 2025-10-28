package com.example.crm.service;

import com.example.crm.dto.DealDTO;
import com.example.crm.entity.Customer;
import com.example.crm.entity.Deal;
import com.example.crm.entity.User;
import com.example.crm.mapper.EntityMapper;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.repository.DealRepository;
import com.example.crm.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepo;
    private final UserRepository userRepo;
    private final CustomerRepository customerRepo;
    private final EntityMapper mapper;

    public DealService(DealRepository dealRepo, EntityMapper mapper, CustomerRepository customerRepo,
            UserRepository userRepo) {
        this.dealRepo = dealRepo;
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.mapper = mapper;
    }

    public List<DealDTO> getAllDeals() {
        return dealRepo.findAll().stream()
                .map(mapper::toDealDTO)
                .toList();
    }

    public List<DealDTO> getDealsByStage(String stage) {
        return dealRepo.findByStage(stage).stream()
                .map(mapper::toDealDTO)
                .toList();
    }

    public DealDTO createDeal(DealDTO dto) {
        // Resolve customer by name
        Customer customer = customerRepo.findByName(dto.getCustomerName())
                .orElseThrow(() -> new RuntimeException("Customer not found: " + dto.getCustomerName()));

        // Resolve user by username
        User assignee = userRepo.findByUsername(dto.getAssignedTo())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getAssignedTo()));

        // Build entity
        Deal deal = new Deal();
        deal.setDealName(dto.getDealName());
        deal.setAmount(dto.getAmount());
        deal.setStage(dto.getStage());
        deal.setCustomer(customer);
        deal.setAssignedTo(assignee);
        deal.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        deal.setUpdatedAt(LocalDateTime.now());

        return mapper.toDealDTO(dealRepo.save(deal));
    }

    // ✅ Get single deal by ID
    public DealDTO getDealById(Long id) {
        return dealRepo.findById(id)
                .map(mapper::toDealDTO)
                .orElseThrow(() -> new RuntimeException("Deal not found with id " + id));
    }

    // ✅ Update deal using DealDTO
    public DealDTO updateDeal(Long id, DealDTO dto) {
        Deal existing = dealRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found with id " + id));

        existing.setDealName(dto.getDealName());
        existing.setAmount(dto.getAmount());
        existing.setStage(dto.getStage());
        // If you want to update relationships:
        // existing.setCustomer(customerRepo.findByName(dto.getCustomerName()));
        // existing.setAssignedTo(userRepo.findByUsername(dto.getAssignedTo()));

        existing.setUpdatedAt(LocalDateTime.now());

        return mapper.toDealDTO(dealRepo.save(existing));
    }

    // ✅ Delete deal
    public void deleteDeal(Long id) {
        if (!dealRepo.existsById(id)) {
            throw new RuntimeException("Deal not found with id " + id);
        }
        dealRepo.deleteById(id);
    }
}
