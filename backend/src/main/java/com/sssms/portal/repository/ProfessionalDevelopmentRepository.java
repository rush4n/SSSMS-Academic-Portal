package com.sssms.portal.repository;

import com.sssms.portal.entity.ProfessionalDevelopment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfessionalDevelopmentRepository extends JpaRepository<ProfessionalDevelopment, Long> {
    List<ProfessionalDevelopment> findByFacultyIdOrderByStartDateDesc(Long facultyId);
}

