package com.sssms.portal.dto.request;

import com.sssms.portal.entity.AssessmentType;
import lombok.Data;
import java.util.List;

@Data
public class AssessmentRequest {
    private Long allocationId;
    private String title;
    private AssessmentType type;
    private int maxMarks;
    private List<StudentMarkEntry> marks;

    @Data
    public static class StudentMarkEntry {
        private Long studentId;
        private double marks;
    }
}