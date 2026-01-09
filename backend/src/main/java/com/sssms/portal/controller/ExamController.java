package com.sssms.portal.controller;

import com.sssms.portal.entity.ClassBatch;
import com.sssms.portal.entity.Student;
import com.sssms.portal.entity.User;
import com.sssms.portal.repository.ClassBatchRepository;
import com.sssms.portal.repository.StudentRepository;
import com.sssms.portal.repository.UserRepository;
import com.sssms.portal.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExamController {

    private final ClassBatchRepository classRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    // 1. Upload (Admin OR Faculty)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadSchedule(@RequestParam("classId") Long classId, @RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        ClassBatch batch = classRepository.findById(classId).orElseThrow();
        batch.setExamSchedulePdf(fileName);
        classRepository.save(batch);
        return ResponseEntity.ok("Exam Schedule Uploaded");
    }

    // 2. View (Student)
    @GetMapping("/student/me")
    public ResponseEntity<?> getMyExamSchedule(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Student student = studentRepository.findById(user.getUserId()).orElseThrow();

        // Find class based on Year
        ClassBatch batch = classRepository.findAll().stream()
                .filter(b -> b.getCurrentSemester() == student.getCurrentYear())
                .findFirst().orElseThrow(() -> new RuntimeException("Class not found"));

        if (batch.getExamSchedulePdf() == null) return ResponseEntity.ok(Map.of("exists", false));

        return ResponseEntity.ok(Map.of("exists", true, "fileName", batch.getExamSchedulePdf()));
    }

    // 3. Helper: Get All Classes (For the Dropdown)
    @GetMapping("/classes")
    public ResponseEntity<?> getAllClasses() {
        return ResponseEntity.ok(classRepository.findAll());
    }

    // 4. View File (Standard)
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}