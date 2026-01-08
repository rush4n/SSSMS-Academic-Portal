package com.sssms.portal.dto.request;

import com.sssms.portal.entity.TargetRole;
import lombok.Data;

@Data
public class NoticeRequest {
    private String title;
    private String content;
    private TargetRole targetRole;
}