package com.sssms.portal.controller;

import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import com.sssms.portal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StudentController {

    private final StudentService studentService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ResourceRepository resourceRepository;
    private final SubjectAllocationRepository allocationRepository;
    private final ExamResultRepository resultRepository;
    // 👇 Inject the Assessment Repository
    private final ClassAssessmentRepository assessmentRepository;

    @GetMapping("/my-attendance")
    public ResponseEntity<?> getMyAttendance(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(studentService.getMyAttendance(user.getUserId()));
    }

    @GetMapping("/my-results")
    public ResponseEntity<?> getMyResults(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Student student = studentRepository.findById(user.getUserId()).orElseThrow();

        List<ExamResult> results = resultRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/my-assessments")
    public ResponseEntity<?> getMyAssessments(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Student student = studentRepository.findById(user.getUserId()).orElseThrow();

        List<ClassAssessment> assessments = assessmentRepository.findByStudentId(student.getId());

        // Map data to a simple structure
        List<Map<String, Object>> response = assessments.stream().map(a -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", a.getId());
            // We get Subject Name via Allocation -> Subject
            map.put("subjectName", a.getAllocation().getSubject().getName());
            map.put("subjectCode", a.getAllocation().getSubject().getCode());
            map.put("examType", a.getExamType());
            map.put("obtained", a.getMarksObtained());
            map.put("max", a.getMaxMarks());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
        public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
            if (userDetails == null) return ResponseEntity.status(401).build();
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            return ResponseEntity.ok(studentService.getProfile(user.getUserId()));
    }

    @GetMapping("/resources/{subjectCode}")
    public ResponseEntity<?> getResourcesForSubject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String subjectCode
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        SubjectAllocation allocation = allocationRepository.findAll().stream()
                .filter(a -> a.getSubject().getCode().equalsIgnoreCase(subjectCode))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Subject Code mismatch"));

        List<AcademicResource> resources = resourceRepository.findByAllocationId(allocation.getId());

        List<Map<String, Object>> response = resources.stream().map(r -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("title", r.getTitle());
            map.put("fileName", r.getFileName());
            map.put("date", r.getUploadDate());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}