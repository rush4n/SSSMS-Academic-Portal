package com.sssms.portal.controller;

import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import com.sssms.portal.dto.request.FacultyEnrollmentRequest;
import com.sssms.portal.service.AdminService;
import com.sssms.portal.dto.request.AllocationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

    // Only Admins can access this endpoint
    @PostMapping("/enroll-student")
    // @PreAuthorize("hasRole('ADMIN')") // We will enable this later
    public ResponseEntity<String> enrollStudent(@RequestBody StudentEnrollmentRequest request) {
        return ResponseEntity.ok(adminService.enrollStudent(request));
    }

    @PostMapping("/enroll-faculty")
        public ResponseEntity<String> enrollFaculty(@RequestBody FacultyEnrollmentRequest request) {
            return ResponseEntity.ok(adminService.enrollFaculty(request));
     }

    @PostMapping("/allocate-subject")
        public ResponseEntity<String> allocateSubject(@RequestBody AllocationRequest request) {
            return ResponseEntity.ok(adminService.allocateSubject(request));
        }
}
