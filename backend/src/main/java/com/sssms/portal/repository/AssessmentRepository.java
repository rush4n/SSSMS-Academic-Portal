package com.sssms.portal.repository;
import com.sssms.portal.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByAllocationId(Long allocationId);
}
