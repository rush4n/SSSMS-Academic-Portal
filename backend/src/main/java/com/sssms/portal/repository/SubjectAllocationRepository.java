package com.sssms.portal.repository;
import com.sssms.portal.entity.SubjectAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectAllocationRepository extends JpaRepository<SubjectAllocation, Long> {

    List<SubjectAllocation> findByFacultyId(Long facultyId);
}