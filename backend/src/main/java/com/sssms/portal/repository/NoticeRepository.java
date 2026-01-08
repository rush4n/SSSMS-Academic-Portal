package com.sssms.portal.repository;

import com.sssms.portal.entity.Notice;
import com.sssms.portal.entity.TargetRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // Order by newest first
    List<Notice> findAllByOrderByDateDesc();

    // Find notices for specific role OR 'ALL', ordered by date
    @Query("SELECT n FROM Notice n WHERE n.targetRole = :role OR n.targetRole = 'ALL' ORDER BY n.date DESC")
    List<Notice> findByTargetRoleOrAll(TargetRole role);
}