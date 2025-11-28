package com.sssms.portal.controller;

import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import com.sssms.portal.service.AdminService;
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
}
