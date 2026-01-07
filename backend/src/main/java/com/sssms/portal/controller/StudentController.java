package com.sssms.portal.controller;

import com.sssms.portal.entity.AcademicResource;
import com.sssms.portal.entity.Student;
import com.sssms.portal.entity.SubjectAllocation;
import com.sssms.portal.entity.User;
import com.sssms.portal.repository.ResourceRepository;
import com.sssms.portal.repository.StudentRepository;
import com.sssms.portal.repository.SubjectAllocationRepository;
import com.sssms.portal.repository.SubjectRepository;
import com.sssms.portal.repository.UserRepository;
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

    // Inject the missing repositories
    private final StudentRepository studentRepository;
    private final ResourceRepository resourceRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectAllocationRepository allocationRepository;

    @GetMapping("/my-attendance")
    public ResponseEntity<?> getMyAttendance(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(studentService.getMyAttendance(user.getUserId()));
    }

    @GetMapping("/resources/{subjectCode}")
    public ResponseEntity<?> getResourcesForSubject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String subjectCode
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        // Find the Student profile linked to this User
        Student student = studentRepository.findById(user.getUserId()).orElseThrow();

        // 1. Find the Allocation for this Subject + Student's Year
       SubjectAllocation allocation = allocationRepository.findAll().stream()
                       .filter(a -> a.getSubject().getCode().equalsIgnoreCase(subjectCode))
                       .findFirst()
                       .orElseThrow(() -> new RuntimeException("Subject Code mismatch"));
        // 2. Fetch Resources
        List<AcademicResource> resources = resourceRepository.findByAllocationId(allocation.getId());

        // 3. Map to DTO
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