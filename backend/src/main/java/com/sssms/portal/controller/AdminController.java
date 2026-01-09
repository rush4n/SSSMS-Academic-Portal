package com.sssms.portal.controller;

import com.sssms.portal.dto.request.AllocationRequest;
import com.sssms.portal.dto.request.FacultyEnrollmentRequest;
import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import com.sssms.portal.entity.ClassBatch;
import com.sssms.portal.entity.Subject;
import com.sssms.portal.repository.ClassBatchRepository;
import com.sssms.portal.repository.SubjectRepository;
import com.sssms.portal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.sssms.portal.entity.Student;
import com.sssms.portal.repository.StudentRepository;

import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;
    private final ClassBatchRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;

    @PostMapping("/enroll-student")
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
        return ResponseEntity.ok(adminService.getFacultyAllocations(facultyId));
    }

    @DeleteMapping("/allocation/{id}")
    public ResponseEntity<?> removeAllocation(@PathVariable Long id) {
        adminService.removeAllocation(id);
        return ResponseEntity.ok("Allocation removed successfully");
    }

    @GetMapping("/faculty/all")
    public ResponseEntity<List<Map<String, Object>>> getAllFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }

    // New Endpoints for Phase 18
    @PostMapping("/classes")
    public ResponseEntity<?> createClass(@RequestBody ClassBatch classBatch) {
        classRepository.save(classBatch);
        return ResponseEntity.ok("Class Batch Created");
    }

    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@RequestBody Subject subject) {
        subjectRepository.save(subject);
        return ResponseEntity.ok("Subject Created");
    }

    @GetMapping("/subjects")
        public ResponseEntity<List<Subject>> getAllSubjects() {
            return ResponseEntity.ok(subjectRepository.findAll());
    }

        @GetMapping("/classes")
        public ResponseEntity<List<ClassBatch>> getAllClasses() {
            return ResponseEntity.ok(classRepository.findAll());
    }

    @GetMapping("/students")
        public ResponseEntity<List<Student>> getAllStudents(
                @RequestParam(required = false) String department,
                @RequestParam(required = false) Integer year
        ) {
            List<Student> allStudents = studentRepository.findAll();

            // Filter Logic
            if (department != null && !department.isEmpty()) {
                allStudents = allStudents.stream()
                        .filter(s -> s.getDepartment().equalsIgnoreCase(department))
                        .collect(Collectors.toList());
            }

            if (year != null) {
                allStudents = allStudents.stream()
                        .filter(s -> s.getCurrentYear() == year)
                        .collect(Collectors.toList());
            }

            // Default Sort by Name
            allStudents.sort(Comparator.comparing(Student::getFirstName));

            return ResponseEntity.ok(allStudents);
        }

    @PutMapping("/student/{id}")
        public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentEnrollmentRequest request) {
            Student student = studentRepository.findById(id).orElseThrow();

            // Update Editable Fields
            student.setFirstName(request.getFirstName());
            student.setLastName(request.getLastName());
            student.setCurrentYear(request.getCurrentYear()); // Changing this re-assigns courses (logically)
            student.setDepartment(request.getDepartment());

            studentRepository.save(student);
            return ResponseEntity.ok("Student Updated");
        }
}