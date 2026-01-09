package com.sssms.portal.controller;

import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
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

import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TimetableController {

    private final ClassBatchRepository classRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;

    // --- ADMIN ENDPOINTS ---

    @PostMapping("/upload/class")
    public ResponseEntity<?> uploadClassTimetable(@RequestParam("classId") Long classId, @RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        ClassBatch batch = classRepository.findById(classId).orElseThrow();
        batch.setTimetablePdf(fileName);
        classRepository.save(batch);
        return ResponseEntity.ok("Class Timetable Uploaded");
    }

    @PostMapping("/upload/faculty")
    public ResponseEntity<?> uploadFacultyTimetable(@RequestParam("facultyId") Long facultyId, @RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        Faculty faculty = facultyRepository.findById(facultyId).orElseThrow();
        faculty.setTimetablePdf(fileName);
        facultyRepository.save(faculty);
        return ResponseEntity.ok("Faculty Timetable Uploaded");
    }

    // --- VIEW ENDPOINTS ---

    @GetMapping("/student/me")
    public ResponseEntity<?> getMyClassTimetable(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Student student = studentRepository.findById(user.getUserId()).orElseThrow();

        // Find class based on year (Simplified logic as per previous phases)
        ClassBatch batch = classRepository.findAll().stream()
                .filter(b -> b.getCurrentSemester() == student.getCurrentYear())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Class not found"));

        if (batch.getTimetablePdf() == null) return ResponseEntity.ok(Map.of("exists", false));

        return ResponseEntity.ok(Map.of("exists", true, "fileName", batch.getTimetablePdf()));
    }

    @GetMapping("/faculty/me")
    public ResponseEntity<?> getMyPersonalTimetable(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Faculty faculty = facultyRepository.findById(user.getUserId()).orElseThrow();

        if (faculty.getTimetablePdf() == null) return ResponseEntity.ok(Map.of("exists", false));

        return ResponseEntity.ok(Map.of("exists", true, "fileName", faculty.getTimetablePdf()));
    }

    // --- DOWNLOADER ---

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        // Inline means "Open in browser" instead of "Download immediately"
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}