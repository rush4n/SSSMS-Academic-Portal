package com.sssms.portal.repository;
import com.sssms.portal.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {}