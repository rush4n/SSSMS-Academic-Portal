package com.sssms.portal.repository;

import com.sssms.portal.entity.AcademicResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<AcademicResource, Long> {
    List<AcademicResource> findByAllocationId(Long allocationId);
}