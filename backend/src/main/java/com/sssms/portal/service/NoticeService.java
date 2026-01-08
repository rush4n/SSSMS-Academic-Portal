package com.sssms.portal.service;

import com.sssms.portal.dto.request.NoticeRequest;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.NoticeRepository;
import com.sssms.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    public void createNotice(NoticeRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .targetRole(request.getTargetRole())
                .date(LocalDateTime.now())
                .postedBy(user)
                .build();

        noticeRepository.save(notice);
    }

    public List<Map<String, Object>> getNoticesForUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Role userRole = user.getRole();

        List<Notice> notices;

        if (userRole == Role.ADMIN) {
            // Admins see everything
            notices = noticeRepository.findAllByOrderByDateDesc();
        } else {
            // Map User Role to Target Role Enum
            TargetRole target = TargetRole.valueOf(userRole.name());
            notices = noticeRepository.findByTargetRoleOrAll(target);
        }

       return notices.stream().map(n -> {
                   Map<String, Object> map = new java.util.HashMap<>();
                   map.put("id", n.getId());
                   map.put("title", n.getTitle());
                   map.put("content", n.getContent());
                   map.put("date", n.getDate());
                   map.put("author", n.getPostedBy().getEmail());
                   map.put("target", n.getTargetRole());
                   return map;
               }).collect(Collectors.toList());
    }
}