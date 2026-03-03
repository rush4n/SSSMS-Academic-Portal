//check
package com.sssms.portal.dto.request;

import com.sssms.portal.entity.ExamType;
import lombok.Data;

@Data
public class AcademicMarksRequest {
    private Long studentId;
    private Long allocationId;
    private ExamType examType;
    private Double marks;
    private Double maxMarks;
}