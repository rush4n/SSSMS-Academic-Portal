package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendance_sessions")
public class AttendanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which "Allocation" is this for? (Links Faculty + Subject + Class)
    @ManyToOne
    @JoinColumn(name = "allocation_id", nullable = false)
    private SubjectAllocation allocation;

    @Column(nullable = false)
    private LocalDate date;

    // Optional: "10:00 AM - 11:00 AM" if you want time slots later
    // private String timeSlot;
}