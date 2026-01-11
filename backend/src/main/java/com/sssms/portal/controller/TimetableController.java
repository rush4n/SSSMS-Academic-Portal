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

    private final YearMetadataRepository yearRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;

    @PostMapping("/upload/class")
        public ResponseEntity<?> uploadClassTimetable(@RequestParam("year") AcademicYear year, @RequestParam("file") MultipartFile file) {
            String fileName = fileStorageService.storeFile(file);

            YearMetadata metadata = yearRepository.findById(year)
                    .orElse(YearMetadata.builder().id(year).build());

            metadata.setTimetablePdf(fileName);
            yearRepository.save(metadata);

            return ResponseEntity.ok("Timetable Uploaded for " + year);
        }


    @PostMapping("/upload/faculty")
    public ResponseEntity<?> uploadFacultyTimetable(@RequestParam("facultyId") Long facultyId, @RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        Faculty faculty = facultyRepository.findById(facultyId).orElseThrow();
        faculty.setTimetablePdf(fileName);
        facultyRepository.save(faculty);
        return ResponseEntity.ok("Faculty Timetable Uploaded");
    }

    @GetMapping("/student/me")
        public ResponseEntity<?> getMyClassTimetable(@AuthenticationPrincipal UserDetails userDetails) {
            if (userDetails == null) return ResponseEntity.status(401).build();
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            Student student = studentRepository.findById(user.getUserId()).orElseThrow();

            YearMetadata metadata = yearRepository.findById(student.getAcademicYear()).orElse(null);

            if (metadata == null || metadata.getTimetablePdf() == null) {
                return ResponseEntity.ok(Map.of("exists", false));
            }

            return ResponseEntity.ok(Map.of("exists", true, "fileName", metadata.getTimetablePdf()));
        }

    @GetMapping("/faculty/me")
    public ResponseEntity<?> getMyPersonalTimetable(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Faculty faculty = facultyRepository.findById(user.getUserId()).orElseThrow();

        if (faculty.getTimetablePdf() == null) return ResponseEntity.ok(Map.of("exists", false));

        return ResponseEntity.ok(Map.of("exists", true, "fileName", faculty.getTimetablePdf()));
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}