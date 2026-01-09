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

    private String title;
    private String fileName;
    private String contentType;

    @ManyToOne
    @JoinColumn(name = "allocation_id", nullable = false)
    private SubjectAllocation allocation;

    private LocalDateTime uploadDate;
}