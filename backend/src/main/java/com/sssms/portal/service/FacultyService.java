package com.sssms.portal.service;

import com.sssms.portal.dto.request.AttendanceRequest;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

        // Find all students in that specific Class/Batch
        // (Assuming Student has 'classBatch' link or we filter by Year/Dept)
        // For Phase 3, we stored 'currentYear' and 'department' in Student.
        // So we filter by that.

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
}