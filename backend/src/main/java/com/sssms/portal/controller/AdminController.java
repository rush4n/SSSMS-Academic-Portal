package com.sssms.portal.controller;

import com.sssms.portal.dto.request.AllocationRequest;
import com.sssms.portal.dto.request.FacultyEnrollmentRequest;
import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import com.sssms.portal.entity.AcademicYear;
import com.sssms.portal.entity.Student;
import com.sssms.portal.entity.Subject;
import com.sssms.portal.entity.SubjectAllocation;
import com.sssms.portal.repository.StudentRepository;
import com.sssms.portal.repository.SubjectAllocationRepository;
import com.sssms.portal.repository.SubjectRepository;
import com.sssms.portal.service.AdminService;
import com.sssms.portal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.sssms.portal.repository.UserRepository;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final SubjectAllocationRepository allocationRepository;
    private final UserRepository userRepository;
    private final com.sssms.portal.service.StudentService studentService;

    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@RequestBody Subject subject) {
        subjectRepository.save(subject);
        return ResponseEntity.ok("Subject Created");
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }

    @PostMapping("/enroll-student")
    public ResponseEntity<String> enrollStudent(@RequestBody StudentEnrollmentRequest request) {
        return ResponseEntity.ok(adminService.enrollStudent(request));
    }

    @PostMapping("/enroll-faculty")
    public ResponseEntity<String> enrollFaculty(@RequestBody FacultyEnrollmentRequest request) {
        return ResponseEntity.ok(adminService.enrollFaculty(request));
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

    @GetMapping("/years")
    public ResponseEntity<List<AcademicYear>> getAllYears() {
        return ResponseEntity.ok(Arrays.asList(AcademicYear.values()));
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents(@RequestParam(required = false) String year) {
        List<Student> allStudents = studentRepository.findAll();
        if (year != null && !year.isEmpty()) {
            try {
                AcademicYear yearEnum = AcademicYear.valueOf(year);
                allStudents = allStudents.stream()
                        .filter(s -> s.getAcademicYear() == yearEnum)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) { }
        }
        allStudents.sort(Comparator.comparing(Student::getFirstName));
        return ResponseEntity.ok(allStudents);
    }

    @PutMapping("/student/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentEnrollmentRequest request) {
        Student student = studentRepository.findById(id).orElseThrow();
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        if (request.getAcademicYear() != null) {
            student.setAcademicYear(request.getAcademicYear());
        }
        studentRepository.save(student);
        return ResponseEntity.ok("Student Updated");
    }

    @PostMapping("/allocate-subject")
    public ResponseEntity<String> allocateSubject(@RequestBody AllocationRequest request) {
        return ResponseEntity.ok(adminService.allocateSubject(request));
    }

    @GetMapping("/allocations/all")
    public ResponseEntity<List<Map<String, Object>>> getAllAllocations() {
        List<SubjectAllocation> list = allocationRepository.findAll();
        List<Map<String, Object>> response = list.stream().map(a -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", a.getId());
            map.put("subjectName", a.getSubject().getName());
            map.put("subjectCode", a.getSubject().getCode());
            if (a.getFaculty() != null) {
                map.put("facultyName", a.getFaculty().getFirstName() + " " + a.getFaculty().getLastName());
            } else {
                map.put("facultyName", "Unassigned");
            }
            map.put("year", a.getSubject().getAcademicYear() != null ? a.getSubject().getAcademicYear().toString() : "N/A");
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/student/{studentId}/course/{allocationId}")
    public ResponseEntity<?> addCourseToStudent(@PathVariable Long studentId, @PathVariable Long allocationId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        SubjectAllocation allocation = allocationRepository.findById(allocationId).orElseThrow();
        student.getExtraCourses().add(allocation);
        studentRepository.save(student);
        return ResponseEntity.ok("Course Assigned");
    }

    @DeleteMapping("/student/{studentId}/course/{allocationId}")
    public ResponseEntity<?> removeCourseFromStudent(@PathVariable Long studentId, @PathVariable Long allocationId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        SubjectAllocation allocation = allocationRepository.findById(allocationId).orElseThrow();
        student.getExtraCourses().remove(allocation);
        studentRepository.save(student);
        return ResponseEntity.ok("Course Removed");
    }

    @DeleteMapping("/student/{id}")
        public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("Student Un-enrolled Successfully");
        }

    @DeleteMapping("/faculty/{id}")
        public ResponseEntity<?> deleteFaculty(@PathVariable Long id) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("Faculty Un-enrolled Successfully");
        }

    @DeleteMapping("/subject/{id}")
        public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
            subjectRepository.deleteById(id);
            return ResponseEntity.ok("Subject Deleted Successfully");
        }

    @GetMapping("/student/{id}/profile")
        public ResponseEntity<?> getStudentProfile(@PathVariable Long id) {
            return ResponseEntity.ok(studentService.getProfile(id));
        }

    @GetMapping("/faculty/{id}/profile")
        public ResponseEntity<?> getFacultyProfile(@PathVariable Long id) {
            return ResponseEntity.ok(adminService.getFacultyProfile(id));
     }
}