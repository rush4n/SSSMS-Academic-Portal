package com.sssms.portal.service;

import com.sssms.portal.dto.request.StudentAttendanceDTO;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final SubjectAllocationRepository allocationRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;

    public List<StudentAttendanceDTO> getMyAttendance(Long userId) {
        // 1. Get Student Profile
        Student student = studentRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        // 2. Find all Subjects allocated to this student's Class (Year + Dept)
        // Note: In a real app, we'd query by ClassBatch ID.
        // For Phase 3/4 simplicity, we iterate allocations matching the student's year.

        List<SubjectAllocation> myAllocations = allocationRepository.findAll().stream()
                .filter(a -> a.getClassBatch().getCurrentSemester() == student.getCurrentYear())
                .toList();

        List<StudentAttendanceDTO> report = new ArrayList<>();

        for (SubjectAllocation allocation : myAllocations) {
            // 3. Count Total Sessions for this Subject
            List<AttendanceSession> sessions = sessionRepository.findAll().stream()
                    .filter(s -> s.getAllocation().getId().equals(allocation.getId()))
                    .toList();

            int total = sessions.size();

            // 4. Count How many this student was PRESENT for
            long attended = recordRepository.findAll().stream()
                    .filter(r -> r.getStudent().getId().equals(student.getId())
                              && r.getSession().getAllocation().getId().equals(allocation.getId())
                              && r.getStatus() == AttendanceStatus.PRESENT)
                    .count();

            double percent = (total == 0) ? 0 : ((double) attended / total) * 100;

            report.add(StudentAttendanceDTO.builder()
                    .subjectName(allocation.getSubject().getName())
                    .subjectCode(allocation.getSubject().getCode())
                    .totalSessions(total)
                    .attendedSessions((int) attended)
                    .percentage(Math.round(percent * 10.0) / 10.0) // Round to 1 decimal
                    .build());
        }

        return report;
    }
}