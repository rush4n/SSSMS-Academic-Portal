package com.sssms.portal.dto.request;

import com.sssms.portal.entity.AttendanceStatus;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceRequest {
    private Long allocationId;
    private LocalDate date;
    private List<StudentStatus> students;

    @Data
    public static class StudentStatus {
        private Long studentId;
        private AttendanceStatus status;
    }
}