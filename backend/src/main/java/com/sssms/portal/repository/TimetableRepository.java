package com.sssms.portal.repository;

import com.sssms.portal.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<TimetableSlot, Long> {
    // Find all slots for a specific class
    List<TimetableSlot> findByAllocationClassBatchIdOrderByDayOfWeekAscStartTimeAsc(Long classBatchId);
}