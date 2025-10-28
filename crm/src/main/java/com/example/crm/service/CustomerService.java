package com.example.crm.service;

import com.example.crm.dto.CustomerDTO;
import com.example.crm.entity.Customer;
import com.example.crm.entity.User;
import com.example.crm.mapper.EntityMapper;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepo;
    private final UserRepository userRepo;
    private final EntityMapper mapper;

    public CustomerService(CustomerRepository customerRepo, EntityMapper mapper, UserRepository userRepo) {
        this.customerRepo = customerRepo;
        this.mapper = mapper;
        this.userRepo = userRepo;
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepo.findAll().stream()
                .map(mapper::toCustomerDTO)
                .toList();
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {
        User creator = userRepo.findByUsername(dto.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getCreatedBy()));

        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setCompany(dto.getCompany());
        customer.setAddress(dto.getAddress());
        customer.setCreatedBy(creator);
        customer.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());

        return mapper.toCustomerDTO(customerRepo.save(customer));
    }

    // ✅ Update existing customer
    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer existing = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + id));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setCompany(dto.getCompany());

        return mapper.toCustomerDTO(customerRepo.save(existing));
    }

    // ✅ Delete customer
    public void deleteCustomer(Long id) {
        if (!customerRepo.existsById(id)) {
            throw new RuntimeException("Customer not found with id " + id);
        }
        customerRepo.deleteById(id);
    }

    // (Optional) Get single customer by ID
    public CustomerDTO getCustomerById(Long id) {
        return customerRepo.findById(id)
                .map(mapper::toCustomerDTO)
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + id));
    }
}
