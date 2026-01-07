package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "academic_resources")
public class AcademicResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;      // "Unit 1 Notes"
    private String fileName;   // "unit1_12345.pdf" (Stored on disk)
    private String contentType; // "application/pdf"

    @ManyToOne
    @JoinColumn(name = "allocation_id", nullable = false)
    private SubjectAllocation allocation; // Links to Subject+Class

    private LocalDateTime uploadDate;
}