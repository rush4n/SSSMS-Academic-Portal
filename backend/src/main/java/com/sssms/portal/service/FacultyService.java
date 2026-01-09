package com.sssms.portal.service;

import com.sssms.portal.dto.request.AttendanceRequest;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.sssms.portal.dto.AttendanceReportDTO;
import java.time.LocalDate;
import java.util.ArrayList;


@Service
@RequiredArgsConstructor
public class FacultyService {

    private final SubjectAllocationRepository allocationRepository;
    private final StudentRepository studentRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;

    // 1. Get Students belonging to the allocated class
    public List<Student> getStudentsForAllocation(Long allocationId) {
        SubjectAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        ClassBatch batch = allocation.getClassBatch();

        return studentRepository.findAll().stream()
                .filter(s -> s.getCurrentYear() == batch.getCurrentSemester() && // logic might vary based on your data model
                             s.getDepartment().equals("Architecture")) // Hardcoded for now, fix later
                .collect(Collectors.toList());
    }

    // 2. Save Attendance
    @Transactional
    public String markAttendance(AttendanceRequest request) {
        SubjectAllocation allocation = allocationRepository.findById(request.getAllocationId())
                .orElseThrow(() -> new RuntimeException("Invalid Allocation"));

        // Create Session Header
        AttendanceSession session = AttendanceSession.builder()
                .allocation(allocation)
                .date(request.getDate())
                .build();

        sessionRepository.save(session);

        // Create individual records
        List<AttendanceRecord> records = request.getStudents().stream().map(s -> {
            Student student = studentRepository.findById(s.getStudentId())
                    .orElseThrow();

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
                        if (startDate == null || endDate == null) return true; // Overall
                        return !s.getDate().isBefore(startDate) && !s.getDate().isAfter(endDate);
                    })
                    .collect(Collectors.toList());

            int totalSessions = sessions.size();
            List<AttendanceReportDTO.StudentStat> stats = new ArrayList<>();

            // 2. Get Students
            List<Student> students = getStudentsForAllocation(allocationId);

            // 3. Calculate Stats per Student
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

            return AttendanceReportDTO.builder()
                    .subjectName(allocation.getSubject().getName())
                    .className(allocation.getClassBatch().getBatchName())
                    .totalSessionsHeld(totalSessions)
                    .range((startDate == null) ? "Overall" : startDate + " to " + endDate)
                    .studentStats(stats)
                    .build();
        }
}