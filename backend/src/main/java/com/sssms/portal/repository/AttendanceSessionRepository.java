package com.sssms.portal.repository;
import com.sssms.portal.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    List<AttendanceSession> findByAllocationId(Long allocationId);
}
