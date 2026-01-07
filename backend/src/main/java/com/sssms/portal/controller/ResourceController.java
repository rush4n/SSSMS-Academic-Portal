package com.sssms.portal.controller;

import com.sssms.portal.entity.AcademicResource;
import com.sssms.portal.entity.SubjectAllocation;
import com.sssms.portal.repository.ResourceRepository;
import com.sssms.portal.repository.SubjectAllocationRepository;
import com.sssms.portal.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ResourceController {

    private final FileStorageService fileStorageService;
    private final ResourceRepository resourceRepository;
    private final SubjectAllocationRepository allocationRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("allocationId") Long allocationId,
            @RequestParam("title") String title
    ) {
        SubjectAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        String fileName = fileStorageService.storeFile(file);

        AcademicResource resource = AcademicResource.builder()
                .title(title)
                .fileName(fileName)
                .contentType(file.getContentType())
                .allocation(allocation)
                .uploadDate(LocalDateTime.now())
                .build();

        resourceRepository.save(resource);

        return ResponseEntity.ok("File uploaded successfully");
    }

    @GetMapping("/allocation/{allocationId}")
    public ResponseEntity<List<Map<String, Object>>> getResources(@PathVariable Long allocationId) {
        List<AcademicResource> resources = resourceRepository.findByAllocationId(allocationId);

        List<Map<String, Object>> response = resources.stream().map(r -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", r.getId());
            map.put("title", r.getTitle());
            map.put("fileName", r.getFileName());
            map.put("date", r.getUploadDate());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}