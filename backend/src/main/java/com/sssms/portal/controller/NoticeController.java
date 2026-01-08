package com.sssms.portal.controller;

import com.sssms.portal.dto.request.NoticeRequest;
import com.sssms.portal.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NoticeController {

    private final NoticeService noticeService;

    // View Notices (Available to Everyone)
    @GetMapping
    public ResponseEntity<?> getNotices(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(noticeService.getNoticesForUser(userDetails.getUsername()));
    }

    // Post Notice (Admin or Faculty only - Handled by SecurityConfig)
    @PostMapping
    public ResponseEntity<?> createNotice(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody NoticeRequest request
    ) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        noticeService.createNotice(request, userDetails.getUsername());
        return ResponseEntity.ok("Notice posted successfully");
    }
}