package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.time.DayOfWeek;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "timetable_slots")
public class TimetableSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek; // MONDAY, TUESDAY...

    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;

    @ManyToOne
    @JoinColumn(name = "allocation_id", nullable = false)
    private SubjectAllocation allocation; // Links Subject + Faculty + Class
}