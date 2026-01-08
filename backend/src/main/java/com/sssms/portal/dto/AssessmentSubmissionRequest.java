package com.sssms.portal.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AssessmentSubmissionRequest {
    private Long allocationId;
    private String examType;
    private Double maxMarks;
    private List<StudentMarkDTO> marks;
}