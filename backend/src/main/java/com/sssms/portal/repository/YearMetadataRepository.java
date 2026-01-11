package com.sssms.portal.repository;

import com.sssms.portal.entity.AcademicYear;
import com.sssms.portal.entity.YearMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YearMetadataRepository extends JpaRepository<YearMetadata, AcademicYear> {
}