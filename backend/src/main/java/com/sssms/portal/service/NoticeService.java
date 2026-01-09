package com.sssms.portal.service;

import com.sssms.portal.dto.request.NoticeRequest;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.NoticeRepository;
import com.sssms.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public void createNotice(String title, String content, TargetRole targetRole, MultipartFile file, String email) {
            User user = userRepository.findByEmail(email).orElseThrow();

            String fileName = null;
            if (file != null && !file.isEmpty()) {
                fileName = fileStorageService.storeFile(file);
            }

            Notice notice = Notice.builder()
                    .title(title)
                    .content(content)
                    .targetRole(targetRole)
                    .attachment(fileName)
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
            notices = noticeRepository.findAllByOrderByDateDesc();
        } else {
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
                   map.put("attachment", n.getAttachment());
                   return map;
               }).collect(Collectors.toList());
    }
}