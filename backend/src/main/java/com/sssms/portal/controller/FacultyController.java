package com.sssms.portal.controller;

import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import com.sssms.portal.service.FacultyService;
import com.sssms.portal.dto.request.AssessmentSubmissionRequest;
import com.sssms.portal.dto.request.StudentMarkDTO;
import com.sssms.portal.dto.request.AttendanceRequest;
import com.sssms.portal.dto.AttendanceReportDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final SubjectAllocationRepository allocationRepository;
    private final UserRepository userRepository;
    private final FacultyService facultyService;
    private final ClassAssessmentRepository assessmentRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/my-subjects")
    public ResponseEntity<?> getMySubjects(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<SubjectAllocation> allocations = allocationRepository.findByFacultyId(user.getUserId());

        List<Map<String, Object>> response = allocations.stream().map(a -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", a.getId());
            map.put("subjectName", a.getSubject().getName());
            map.put("subjectCode", a.getSubject().getCode());
            map.put("className", a.getClassBatch().getBatchName());
            map.put("division", a.getClassBatch().getDivision());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/allocation/{id}/students")
    public ResponseEntity<List<Student>> getStudents(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getStudentsForAllocation(id));
    }

    @PostMapping("/attendance")
    public ResponseEntity<String> submitAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(facultyService.markAttendance(request));
    }


    @PostMapping("/assessment/save")
    public ResponseEntity<?> saveAssessment(@RequestBody AssessmentSubmissionRequest request) {
        SubjectAllocation allocation = allocationRepository.findById(request.getAllocationId())
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        for (StudentMarkDTO mark : request.getMarks()) {
            Student student = studentRepository.findById(mark.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            ClassAssessment assessment = ClassAssessment.builder()
                    .allocation(allocation)
                    .student(student)
                    .examType(request.getExamType())
                    .marksObtained(mark.getObtained())
                    .maxMarks(request.getMaxMarks())
                    .build();

            assessmentRepository.save(assessment);
        }

        return ResponseEntity.ok("Marks saved successfully");
    }

    @GetMapping("/report/{allocationId}")
        public ResponseEntity<?> getAttendanceReport(
                @PathVariable Long allocationId,
                @RequestParam(required = false) String startDate,
                @RequestParam(required = false) String endDate
        ) {
            LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
            LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

            return ResponseEntity.ok(facultyService.getAttendanceReport(allocationId, start, end));
        }
}