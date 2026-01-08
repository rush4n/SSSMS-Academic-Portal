package com.sssms.portal.repository;

import com.sssms.portal.entity.ClassAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassAssessmentRepository extends JpaRepository<ClassAssessment, Long> {
    List<ClassAssessment> findByAllocationIdAndExamType(Long allocationId, String examType);
    List<ClassAssessment> findByStudentId(Long studentId);
}