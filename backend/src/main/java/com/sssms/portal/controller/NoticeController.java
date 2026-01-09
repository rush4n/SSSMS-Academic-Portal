package com.sssms.portal.controller;

import com.sssms.portal.dto.request.NoticeRequest;
import com.sssms.portal.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.sssms.portal.service.FileStorageService;
import com.sssms.portal.entity.TargetRole;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import com.sssms.portal.service.FileStorageService;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NoticeController {

    private final NoticeService noticeService;
    private final FileStorageService fileStorageService;

    // View Notices (Available to Everyone)
    @GetMapping
    public ResponseEntity<?> getNotices(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(noticeService.getNoticesForUser(userDetails.getUsername()));
    }

    // Post Notice (Admin or Faculty only)

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> createNotice(
                @AuthenticationPrincipal UserDetails userDetails,
                @RequestParam("title") String title,
                @RequestParam("content") String content,
                @RequestParam("targetRole") TargetRole targetRole,
                @RequestParam(value = "file", required = false) MultipartFile file
        ) {
            if (userDetails == null) return ResponseEntity.status(401).build();

            noticeService.createNotice(title, content, targetRole, file, userDetails.getUsername());
            return ResponseEntity.ok("Notice posted successfully");
        }

        // Reuse the file storage service for downloading notice attachments
        @GetMapping("/download/{fileName}")
        public ResponseEntity<Resource> downloadAttachment(@PathVariable String fileName) {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
}