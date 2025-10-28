package com.example.crm.repository;

import com.example.crm.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByStage(String stage);

    List<Deal> findByAssignedTo_UserId(Long userId);

    Optional<Deal> findByDealName(String dealName);
}
