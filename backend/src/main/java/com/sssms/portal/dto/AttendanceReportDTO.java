package com.sssms.portal.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AttendanceReportDTO {
    private int totalSessionsHeld;
    private String subjectName;
    private String className;
    private String range; // "Overall" or "2025-01-01 to 2025-01-31"
    private List<StudentStat> studentStats;

    @Data
    @Builder
    public static class StudentStat {
        private String studentName;
        private String prn;
        private int sessionsAttended;
        private double percentage;
    }
}