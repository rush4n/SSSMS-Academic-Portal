package com.sssms.portal.controller;

import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import com.sssms.portal.dto.request.FacultyEnrollmentRequest;
import com.sssms.portal.service.AdminService;
import com.sssms.portal.dto.request.AllocationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

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

    @PostMapping("/upload-results")
        public ResponseEntity<String> uploadResults(@RequestParam("file") MultipartFile file) {
            return ResponseEntity.ok(adminService.processResultLedger(file));
        }

    @GetMapping("/faculty/{facultyId}/allocations")
        public ResponseEntity<?> getFacultyAllocations(@PathVariable Long facultyId) {
            // We reuse the repository logic directly for simplicity here
            // In a strict layered app, move this to AdminService
            return ResponseEntity.ok(adminService.getFacultyAllocations(facultyId));
        }

        // 2. Remove an Allocation (Un-assign)
    @DeleteMapping("/allocation/{id}")
        public ResponseEntity<?> removeAllocation(@PathVariable Long id) {
            adminService.removeAllocation(id);
            return ResponseEntity.ok("Allocation removed successfully");
        }

    @GetMapping("/faculty/all")
        public ResponseEntity<List<Map<String, Object>>> getAllFaculty() {
            return ResponseEntity.ok(adminService.getAllFaculty());
        }
}
