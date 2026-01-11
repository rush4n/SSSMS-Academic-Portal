package com.sssms.portal.service;

import com.sssms.portal.dto.AttendanceReportDTO;
import com.sssms.portal.dto.request.AttendanceRequest;
import com.sssms.portal.dto.request.AssessmentRequest;

import com.sssms.portal.entity.*;

import com.sssms.portal.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final SubjectAllocationRepository allocationRepository;
    private final StudentRepository studentRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;
    private final AssessmentRepository assessmentRepository;
    private final StudentMarkRepository studentMarkRepository;

    public List<Student> getStudentsForAllocation(Long allocationId) {
        SubjectAllocation allocation = allocationRepository.findById(allocationId).orElseThrow();
        AcademicYear year = allocation.getSubject().getAcademicYear();

        return studentRepository.findAll().stream()
                .filter(s -> s.getAcademicYear() == year)
                .collect(Collectors.toList());
    }

    @Transactional
    public String markAttendance(AttendanceRequest request) {
        SubjectAllocation allocation = allocationRepository.findById(request.getAllocationId())
                .orElseThrow(() -> new RuntimeException("Invalid Allocation"));

        AttendanceSession session = AttendanceSession.builder()
                .allocation(allocation)
                .date(request.getDate())
                .build();

        sessionRepository.save(session);

        List<AttendanceRecord> records = request.getStudents().stream().map(s -> {
            Student student = studentRepository.findById(s.getStudentId()).orElseThrow();
            return AttendanceRecord.builder()
                    .session(session)
                    .student(student)
                    .status(s.getStatus())
                    .build();
        }).collect(Collectors.toList());

        recordRepository.saveAll(records);
        return "Attendance Marked Successfully";
    }

    public AttendanceReportDTO getAttendanceReport(Long allocationId, LocalDate startDate, LocalDate endDate) {
        SubjectAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        // 1. Fetch Sessions
        List<AttendanceSession> sessions = sessionRepository.findAll().stream()
                .filter(s -> s.getAllocation().getId().equals(allocationId))
                .filter(s -> {
                    if (startDate == null || endDate == null) return true;
                    return !s.getDate().isBefore(startDate) && !s.getDate().isAfter(endDate);
                })
                .collect(Collectors.toList());

        int totalSessions = sessions.size();
        List<AttendanceReportDTO.StudentStat> stats = new ArrayList<>();

        // 2. Get Students
        List<Student> students = getStudentsForAllocation(allocationId);

        // 3. Calculate Stats
        for (Student s : students) {
            long attended = 0;
            for (AttendanceSession session : sessions) {
                boolean isPresent = recordRepository.findAll().stream()
                        .anyMatch(r -> r.getSession().getId().equals(session.getId())
                                    && r.getStudent().getId().equals(s.getId())
                                    && r.getStatus() == AttendanceStatus.PRESENT);
                if (isPresent) attended++;
            }

            double percent = (totalSessions == 0) ? 0 : ((double) attended / totalSessions) * 100;

            stats.add(AttendanceReportDTO.StudentStat.builder()
                    .studentName(s.getFirstName() + " " + s.getLastName())
                    .prn(s.getPrn())
                    .sessionsAttended((int) attended)
                    .percentage(Math.round(percent * 10.0) / 10.0)
                    .build());
        }

        // Updated Class Name Logic
        String className = allocation.getSubject().getAcademicYear().toString();

        return AttendanceReportDTO.builder()
                .subjectName(allocation.getSubject().getName())
                .className(className)
                .totalSessionsHeld(totalSessions)
                .range((startDate == null) ? "Overall" : startDate + " to " + endDate)
                .studentStats(stats)
                .build();
    }

    @Transactional
    public String createAssessment(com.sssms.portal.dto.request.AssessmentRequest request) {
        SubjectAllocation allocation = allocationRepository.findById(request.getAllocationId()).orElseThrow();

        Assessment assessment = Assessment.builder()
                .title(request.getTitle())
                .type(request.getType())
                .maxMarks(request.getMaxMarks())
                .allocation(allocation)
                .date(LocalDate.now())
                .build();

        assessmentRepository.save(assessment);

        List<StudentMark> marksList = request.getMarks().stream().map(m -> {
            Student s = studentRepository.findById(m.getStudentId()).orElseThrow();
            return StudentMark.builder()
                    .assessment(assessment)
                    .student(s)
                    .marksObtained(m.getMarks())
                    .build();
        }).collect(Collectors.toList());

        studentMarkRepository.saveAll(marksList);
        return "Assessment Created";
    }

    public ByteArrayInputStream generateAttendanceCSV(Long allocationId, LocalDate startDate, LocalDate endDate) {
            AttendanceReportDTO report = getAttendanceReport(allocationId, startDate, endDate);

            try (ByteArrayOutputStream out = new ByteArrayOutputStream();
                 PrintWriter writer = new PrintWriter(out)) {

                // Header
                writer.println("Subject," + report.getSubjectName());
                writer.println("Class," + report.getClassName());
                writer.println("Range," + report.getRange());
                writer.println("Total Sessions," + report.getTotalSessionsHeld());
                writer.println(""); // Empty Line

                // Columns
                writer.println("PRN,Student Name,Attended,Total,Percentage");

                // Data Rows
                for (AttendanceReportDTO.StudentStat s : report.getStudentStats()) {
                    writer.printf("%s,%s,%d,%d,%.1f%%%n",
                            s.getPrn(),
                            s.getStudentName(),
                            s.getSessionsAttended(),
                            report.getTotalSessionsHeld(),
                            s.getPercentage());
                }

                writer.flush();
                return new ByteArrayInputStream(out.toByteArray());

            } catch (Exception e) {
                throw new RuntimeException("Failed to generate CSV data: " + e.getMessage());
            }
        }


}