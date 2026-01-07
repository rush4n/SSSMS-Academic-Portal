package com.sssms.portal.controller;

import com.sssms.portal.entity.User;
import com.sssms.portal.entity.SubjectAllocation;
import com.sssms.portal.repository.SubjectAllocationRepository;
import com.sssms.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.sssms.portal.dto.request.AttendanceRequest;
import com.sssms.portal.service.FacultyService;
import com.sssms.portal.entity.Student;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final SubjectAllocationRepository allocationRepository;
    private final UserRepository userRepository;
    private final FacultyService facultyService;

    @GetMapping("/my-subjects")
        public ResponseEntity<?> getMySubjects(@AuthenticationPrincipal UserDetails userDetails) {
            if (userDetails == null) return ResponseEntity.status(401).build();

            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

            List<SubjectAllocation> allocations = allocationRepository.findByFacultyId(user.getUserId());

            // Explicitly create a List of Maps to satisfy the compiler
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
}