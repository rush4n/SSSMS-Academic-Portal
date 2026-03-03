//check

package com.sssms.portal.repository;

import com.sssms.portal.entity.AcademicMarks;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AcademicMarksRepository extends JpaRepository<AcademicMarks, Long> {
    List<AcademicMarks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    List<AcademicMarks> findByStudentId(Long studentId);
}