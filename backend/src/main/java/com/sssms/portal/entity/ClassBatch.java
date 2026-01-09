package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "class_batches")
public class ClassBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String batchName; // e.g. "Second Year B.Arch"
    private String division;  // e.g. "A"
    private int academicYear; // e.g. 2025
    private int currentSemester; // e.g. 3
    private String timetablePdf; // Stores filename
}