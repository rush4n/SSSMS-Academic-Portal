package com.sssms.portal.repository;

import com.sssms.portal.entity.FeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FeeRepository extends JpaRepository<FeeRecord, Long> {
    Optional<FeeRecord> findByStudentId(Long studentId);
}